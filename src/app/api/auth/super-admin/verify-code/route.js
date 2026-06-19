import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import SuperAdminVerification from "@/models/SuperAdminVerification";
import { isRootSuperAdminEmail, ensureRootSuperAdminUser } from "@/lib/auth/rootSuperAdmin";
import { signAuthToken } from "@/lib/auth/tokens";

const MAX_ATTEMPTS = 5;

export async function POST(req) {
  try {
    const body = await req.json();
    const email = (body.email || "").toLowerCase().trim();
    const code = (body.code || "").trim();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Email and code are required." },
        { status: 400 }
      );
    }

    if (!isRootSuperAdminEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 403 }
      );
    }

    await dbConnect();

    const verification = await SuperAdminVerification.findOne({ email });

    if (!verification) {
      return NextResponse.json(
        { success: false, message: "No pending verification found. Request a new code." },
        { status: 400 }
      );
    }

    if (new Date() > verification.expiresAt) {
      await SuperAdminVerification.deleteOne({ email });
      return NextResponse.json(
        { success: false, message: "Verification code has expired. Request a new one." },
        { status: 400 }
      );
    }

    if (verification.attempts >= MAX_ATTEMPTS) {
      await SuperAdminVerification.deleteOne({ email });
      return NextResponse.json(
        { success: false, message: "Too many failed attempts. Request a new code." },
        { status: 429 }
      );
    }

    const isMatch = await bcrypt.compare(code, verification.otpHash);

    if (!isMatch) {
      await SuperAdminVerification.findOneAndUpdate(
        { email },
        { $inc: { attempts: 1 } }
      );
      const remaining = MAX_ATTEMPTS - (verification.attempts + 1);
      return NextResponse.json(
        {
          success: false,
          message: `Invalid code. ${remaining > 0 ? `${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` : "No attempts remaining."}`,
        },
        { status: 400 }
      );
    }

    // OTP valid — clean up and create session
    await SuperAdminVerification.deleteOne({ email });

    const user = await ensureRootSuperAdminUser();

    user.lastLoginAt = new Date();
    await user.save();

    const token = signAuthToken(user);

    const cookieStore = await cookies();
    cookieStore.set("sitecraft_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json({
      success: true,
      message: "Verification successful.",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        isRootSuperAdmin: user.isRootSuperAdmin,
      },
    });
  } catch (error) {
    console.error("super-admin/verify-code error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
