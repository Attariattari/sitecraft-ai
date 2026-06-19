import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth/tokens";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

function safeUserPayload(user) {
  if (!user) return null;
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    accountPurpose: user.accountPurpose,
    profileImage: user.profileImage,
    profile: user.profile,
    preferences: user.preferences,
    isRootSuperAdmin: user.isRootSuperAdmin || false,
    status: user.status,
    sessionVersion: user.sessionVersion || 0,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("sitecraft_token");
    const token = cookie ? cookie.value : null;

    if (!token) {
      return NextResponse.json({ success: true, authenticated: false, authState: "guest", user: null });
    }

    const decoded = verifyAuthToken(token);
    if (!decoded) {
      return NextResponse.json({ success: true, authenticated: false, authState: "guest", user: null });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId).select("-password -__v");
    if (!user) {
      return NextResponse.json({ success: true, authenticated: false, authState: "guest", user: null });
    }

    // If DB sessionVersion mismatch, treat as guest (token invalidated)
    const tokenVersion = decoded.sessionVersion !== undefined ? decoded.sessionVersion : 0;
    const dbVersion = user.sessionVersion || 0;
    if (dbVersion !== tokenVersion) {
      return NextResponse.json({ success: true, authenticated: false, authState: "guest", user: null });
    }

    // Restricted or suspended from DB
    if (user.status === "restricted") {
      return NextResponse.json({ success: true, authenticated: true, authState: "restricted", user: safeUserPayload(user) });
    }
    if (user.status === "suspended") {
      return NextResponse.json({ success: true, authenticated: true, authState: "suspended", user: safeUserPayload(user) });
    }

    // Otherwise authenticated
    return NextResponse.json({ success: true, authenticated: true, authState: "authenticated", user: safeUserPayload(user) });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
