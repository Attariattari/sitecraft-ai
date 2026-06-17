import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { resetPasswordSchema } from "@/lib/validations/authValidation";

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, password } = resetPasswordSchema.parse(body);

    await dbConnect();

    // We do not have user email, so we need to find the user with an unexpired token.
    // Wait, the standard way with hashed token requires us to check all tokens if we only
    // have the raw token, since we don't know the email.
    // A better way is to pass `userId` or `email` as part of the token link or check in a lightweight loop.
    // Or, we find users with resetPasswordExpires > Date.now(), then compare hashes.

    const users = await User.find({
      resetPasswordExpires: { $gt: new Date() },
    });

    let matchedUser = null;

    for (const user of users) {
      if (await bcrypt.compare(token, user.resetPasswordToken)) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
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
