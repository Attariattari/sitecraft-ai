import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { loginSchema } from "@/lib/validations/authValidation";
import { signAuthToken } from "@/lib/auth/tokens";
import { isRootSuperAdminEmail } from "@/lib/auth/rootSuperAdmin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, rememberMe } = loginSchema.parse(body);

    // Root Super Admin must go through OTP flow — never a direct session
    if (isRootSuperAdminEmail(email)) {
      const crypto = (await import("crypto")).default;
      const bcryptLib = (await import("bcryptjs")).default;

      await dbConnect();

      const ipAddress =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "";
      const userAgent = req.headers.get("user-agent") || "";

      const SuperAdminVerification = (await import("@/models/SuperAdminVerification")).default;

      const existing = await SuperAdminVerification.findOne({ email });
      const cooldownMs = 60 * 1000;
      if (existing) {
        const elapsed = Date.now() - new Date(existing.lastSentAt).getTime();
        if (elapsed < cooldownMs) {
          const remaining = Math.ceil((cooldownMs - elapsed) / 1000);
          return NextResponse.json(
            {
              success: false,
              isSuperAdmin: true,
              message: `A code was already sent. Please wait ${remaining}s or check your email.`,
              cooldown: remaining,
            },
            { status: 429 }
          );
        }
      }

      const otp = String(crypto.randomInt(100000, 999999));
      const otpHash = await bcryptLib.hash(otp, 10);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await SuperAdminVerification.findOneAndUpdate(
        { email },
        { email, otpHash, expiresAt, attempts: 0, lastSentAt: new Date(), ipAddress, userAgent },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const { sendSuperAdminVerificationEmail } = await import("@/lib/email/sendSuperAdminVerificationEmail");
      await sendSuperAdminVerificationEmail({ to: email, otp, ipAddress, userAgent });

      return NextResponse.json({
        success: false,
        isSuperAdmin: true,
        message: "Verification code sent. Please check your email.",
      });
    }

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
