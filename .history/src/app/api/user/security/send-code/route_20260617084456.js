import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import SecurityChallenge from "@/models/SecurityChallenge";
import { sendSecurityCodeEmail } from "@/lib/email/sendSecurityCodeEmail";

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);

    // Delete any existing challenges for this user of this type
    await SecurityChallenge.deleteMany({
      userId: user.id,
      type: "password_change",
    });

    // Create new challenge
    await SecurityChallenge.create({
      userId: user.id,
      email: user.email,
      codeHash,
      type: "password_change",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send email
    const emailSent = await sendSecurityCodeEmail(
      user.email,
      code,
      "change your password",
    );

    if (!emailSent) {
      return NextResponse.json(
        { success: false, message: "Failed to send verification email" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("Security code error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
