import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import PendingSignup from "@/models/PendingSignup";
import { verifyEmailSchema } from "@/lib/validations/authValidation";
import { signAuthToken } from "@/lib/auth/tokens";
import { isRootSuperAdminEmail } from "@/lib/auth/rootSuperAdmin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, code } = verifyEmailSchema.parse(body);

    await dbConnect();

    // Find pending signup
    const pendingSignup = await PendingSignup.findOne({ email });
    if (!pendingSignup) {
      return NextResponse.json(
        {
          success: false,
          message: "Signup session expired or invalid. Please sign up again.",
        },
        { status: 400 },
      );
    }

    // Check expiry
    if (new Date() > pendingSignup.verificationCodeExpires) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code expired. Please request a new one.",
        },
        { status: 400 },
      );
    }

    // Check attempts
    if (pendingSignup.attempts >= 5) {
      await PendingSignup.deleteOne({ email });
      return NextResponse.json(
        {
          success: false,
          message: "Too many failed attempts. Please sign up again.",
        },
        { status: 400 },
      );
    }

    // Compare code
    const isCodeValid = await bcrypt.compare(
      code,
      pendingSignup.verificationCodeHash,
    );
    if (!isCodeValid) {
      pendingSignup.attempts += 1;
      await pendingSignup.save();
      return NextResponse.json(
        { success: false, message: "Invalid verification code." },
        { status: 400 },
      );
    }

    // Check if user accidentally exists
    let user = await User.findOne({ email });
    const isRoot = isRootSuperAdminEmail(email);

    if (user) {
      if (user.isEmailVerified) {
        return NextResponse.json(
          { success: false, message: "Account already verified." },
          { status: 400 },
        );
      }
      // Update existing unverified user
      user.name = pendingSignup.name;
      user.password = pendingSignup.passwordHash;
      user.primaryPurpose = pendingSignup.accountPurpose;
      user.selectedPurposes = [pendingSignup.accountPurpose];
      user.accountPurpose = pendingSignup.accountPurpose;
      user.isEmailVerified = true;
      user.emailVerifiedAt = new Date();
      user.lastLoginProvider = "credentials";
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name: pendingSignup.name,
        email: pendingSignup.email,
        password: pendingSignup.passwordHash,
        primaryPurpose: pendingSignup.accountPurpose,
        selectedPurposes: [pendingSignup.accountPurpose],
        accountPurpose: pendingSignup.accountPurpose,
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        plan: isRoot ? "agency" : "free",
        role: isRoot ? "super-admin" : "user",
        isRootSuperAdmin: isRoot,
        lastLoginProvider: "credentials",
      });
    }

    // Clean up
    await PendingSignup.deleteOne({ email });

    // Login user
    const token = signAuthToken(user, "7d", "credentials");

    const cookieStore = await cookies();
    cookieStore.set("sitecraft_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",
      user: safeUserPayload(user, "credentials"),
    });
  } catch (error) {
    console.error("Verify email error:", error);
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
