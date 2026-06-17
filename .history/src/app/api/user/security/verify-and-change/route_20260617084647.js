import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import User from "@/models/User";
import SecurityChallenge from "@/models/SecurityChallenge";

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { code, newPassword } = await req.json();

    if (!code || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long",
        },
        { status: 400 },
      );
    }

    await dbConnect();

    // Find challenge
    const challenge = await SecurityChallenge.findOne({
      userId: user.id,
      type: "password_change",
    });

    if (!challenge) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification session expired. Please request a new code.",
        },
        { status: 400 },
      );
    }

    // Check attempts
    if (challenge.attempts >= 5) {
      await SecurityChallenge.deleteOne({ _id: challenge._id });
      return NextResponse.json(
        {
          success: false,
          message: "Too many failed attempts. Please try again later.",
        },
        { status: 400 },
      );
    }

    // Verify code
    const isCodeValid = await bcrypt.compare(code, challenge.codeHash);
    if (!isCodeValid) {
      challenge.attempts += 1;
      await challenge.save();
      return NextResponse.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 },
      );
    }

    // Code is valid - update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Find real user in DB to update
    const dbUser = await User.findById(user.id);

    // Check if new password is same as current password
    const isSamePassword = await bcrypt.compare(newPassword, dbUser.password);
    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password cannot be the same as your current password",
        },
        { status: 400 },
      );
    }

    dbUser.password = hashedPassword;
    await dbUser.save();

    // Clean up challenge
    await SecurityChallenge.deleteOne({ _id: challenge._id });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
