import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import getBaseUrl from "@/lib/getBaseUrl";

export async function GET(req) {
  try {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Google OAuth environment variables are missing. Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
        },
        { status: 500 },
      );
    }

    const baseUrl = getBaseUrl();
    const REDIRECT_URI =
      process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/api/auth/google/callback`;

    // generate state and store in httpOnly cookie briefly
    const state = crypto.randomBytes(16).toString("hex");
    const cookieStore = await cookies();
    cookieStore.set("google_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth/google/callback",
      maxAge: 300,
    });

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      state,
      access_type: "offline",
      prompt: "select_account",
    });

    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    return NextResponse.redirect(googleUrl);
  } catch (err) {
    console.error("Google start error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to start Google OAuth." },
      { status: 500 },
    );
  }
}
