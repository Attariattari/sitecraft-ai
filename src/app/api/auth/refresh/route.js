import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuthToken, signAuthToken } from "@/lib/auth/tokens";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("sitecraft_token");
    const token = cookie ? cookie.value : null;

    if (!token) {
      return NextResponse.json({ success: false, message: "No token" }, { status: 401 });
    }

    const decoded = verifyAuthToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId).select("-password -__v");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    }

    // If DB sessionVersion mismatch, token is invalidated
    const tokenVersion = decoded.sessionVersion !== undefined ? decoded.sessionVersion : 0;
    const dbVersion = user.sessionVersion || 0;
    if (dbVersion !== tokenVersion) {
      return NextResponse.json({ success: false, message: "Session invalidated" }, { status: 401 });
    }

    // Issue a new token with 24h expiry (sliding window)
    const newToken = signAuthToken(user, "24h");
    const cookieStore2 = await cookies();
    const maxAge = 24 * 60 * 60; // 24 hours

    cookieStore2.set("sitecraft_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return NextResponse.json({ success: true, message: "Token refreshed" });
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
