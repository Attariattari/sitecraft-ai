import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { loginSchema } from "@/lib/validations/authValidation";
import { signAuthToken } from "@/lib/auth/tokens";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, rememberMe } = loginSchema.parse(body);

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 },
      );
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Please verify your email before logging in.",
          isUnverified: true,
        },
        { status: 403 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 },
      );
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signAuthToken(user);

    const cookieStore = await cookies();
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30 days or 7 days

    cookieStore.set("sitecraft_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        accountPurpose: user.accountPurpose,
      },
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
