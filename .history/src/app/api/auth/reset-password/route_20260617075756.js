import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { resetPasswordSchema } from "@/lib/validations/authValidation";

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, password } = resetPasswordSchema.parse(body);

    await dbConnect();

    // Hash the incoming raw token to compare with stored hash
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user with this token hash and ensure it's not expired
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Password reset token is invalid or has expired.",
        },
        { status: 400 },
      );
    }

    // Set new password
    matchedUser.password = await bcrypt.hash(password, 12);
    matchedUser.resetPasswordToken = undefined;
    matchedUser.resetPasswordExpires = undefined;
    await matchedUser.save();

    return NextResponse.json({
      success: true,
      message: "Password has been successfully reset. You can now log in.",
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
