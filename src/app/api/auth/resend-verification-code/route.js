import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import PendingSignup from "@/models/PendingSignup";
import { resendVerificationSchema } from "@/lib/validations/authValidation";
import { sendVerificationEmail } from "@/lib/email/sendVerificationEmail";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = resendVerificationSchema.parse(body);

    await dbConnect();

    const pendingSignup = await PendingSignup.findOne({ email });
    if (!pendingSignup) {
      return NextResponse.json(
        { success: false, message: "No pending signup found for this email." },
        { status: 400 },
      );
    }

    // Cooldown check (60 seconds)
    const timeSinceLastSent =
      Date.now() - new Date(pendingSignup.lastSentAt).getTime();
    if (timeSinceLastSent < 60 * 1000) {
      return NextResponse.json(
        {
          success: false,
          message: "Please wait before requesting a new code.",
        },
        { status: 429 },
      );
    }

    // Generate new code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationCodeHash = await bcrypt.hash(verificationCode, 10);
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    pendingSignup.verificationCodeHash = verificationCodeHash;
    pendingSignup.verificationCodeExpires = verificationCodeExpires;
    pendingSignup.lastSentAt = new Date();
    pendingSignup.attempts = 0; // Reset attempts
    await pendingSignup.save();

    const emailSent = await sendVerificationEmail(email, verificationCode);
    if (!emailSent) {
      return NextResponse.json(
        { success: false, message: "Failed to send verification email." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code resent successfully.",
    });
  } catch (error) {
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
