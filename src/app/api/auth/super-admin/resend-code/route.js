import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import SuperAdminVerification from "@/models/SuperAdminVerification";
import { isRootSuperAdminEmail } from "@/lib/auth/rootSuperAdmin";
import { sendSuperAdminVerificationEmail } from "@/lib/email/sendSuperAdminVerificationEmail";

function generateOtp() {
  return String(crypto.randomInt(100000, 999999));
}

export async function POST(req) {
  try {
    const body = await req.json();
    const email = (body.email || "").toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    if (!isRootSuperAdminEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 403 }
      );
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "";
    const userAgent = req.headers.get("user-agent") || "";

    await dbConnect();

    const existing = await SuperAdminVerification.findOne({ email });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "No pending verification. Request a new code first." },
        { status: 400 }
      );
    }

    const cooldownMs = 60 * 1000;
    const elapsed = Date.now() - new Date(existing.lastSentAt).getTime();
    if (elapsed < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - elapsed) / 1000);
      return NextResponse.json(
        {
          success: false,
          message: `Please wait ${remaining} seconds before resending.`,
          cooldown: remaining,
        },
        { status: 429 }
      );
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await SuperAdminVerification.findOneAndUpdate(
      { email },
      {
        otpHash,
        expiresAt,
        attempts: 0,
        lastSentAt: new Date(),
        ipAddress,
        userAgent,
      }
    );

    await sendSuperAdminVerificationEmail({ to: email, otp, ipAddress, userAgent });

    return NextResponse.json({
      success: true,
      message: "A new verification code has been sent.",
    });
  } catch (error) {
    console.error("super-admin/resend-code error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
