import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import PendingSignup from "@/models/PendingSignup";
import { signupSchema } from "@/lib/validations/authValidation";
import { sendVerificationEmail } from "@/lib/email/sendVerificationEmail";

export async function POST(req) {
  try {
    const body = await req.json();
    const validatedData = signupSchema.parse(body);

    await dbConnect();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "Email is already registered. Please log in.",
          },
          { status: 400 },
        );
      }
      // If user exists but not verified, could be an edge case that we handle
      // by asking them to just resend code or logging them into verify email screen
    }

    // 2. Generate 6-digit code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationCodeHash = await bcrypt.hash(verificationCode, 10);
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 3. Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // 4. Save or update PendingSignup
    let pendingSignup = await PendingSignup.findOne({
      email: validatedData.email,
    });

    if (pendingSignup) {
      pendingSignup.name = validatedData.name;
      pendingSignup.passwordHash = passwordHash;
      pendingSignup.accountPurpose = validatedData.accountPurpose;
      pendingSignup.verificationCodeHash = verificationCodeHash;
      pendingSignup.verificationCodeExpires = verificationCodeExpires;
      pendingSignup.lastSentAt = new Date();
      pendingSignup.attempts = 0;
      await pendingSignup.save();
    } else {
      pendingSignup = await PendingSignup.create({
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
        accountPurpose: validatedData.accountPurpose,
        verificationCodeHash,
        verificationCodeExpires,
      });
    }

    // 5. Send Email
    const emailSent = await sendVerificationEmail(
      validatedData.email,
      verificationCode,
    );
    if (!emailSent) {
      // It's still saved, but tell frontend email failed
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send verification email. Please try again.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email.",
      email: validatedData.email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
