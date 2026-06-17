import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { forgotPasswordSchema } from "@/lib/validations/authValidation";
import { sendPasswordResetEmail } from "@/lib/email/sendPasswordResetEmail";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    await dbConnect();
    const user = await User.findOne({ email });
    console.log(
      `[Forgot Password] User search for ${email}: ${user ? "Found" : "Not Found"}`,
    );

    // Always return a positive message regardless of whether the user exists
    // to prevent email enumeration attacks.
    const successMessage = {
      success: true,
      message:
        "If your email is registered, you will receive a password reset link shortly.",
    };

    if (!user || !user.isEmailVerified) {
      console.log(`[Forgot Password] User not found or not verified: ${email}`);
      return NextResponse.json(successMessage);
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await User.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: tokenHash,
        resetPasswordExpires: tokenExpiry,
      },
    );
    console.log(`[Forgot Password] Reset token saved to DB for ${email}`);

    const emailSent = await sendPasswordResetEmail(email, resetToken);
    console.log(
      `[Forgot Password] Email send result: ${emailSent ? "Success" : "Failed"}`,
    );

    return NextResponse.json(successMessage);
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
