import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";
import { REALTIME_EVENTS } from "@/lib/realtime/events";

export async function POST() {
  const cookieStore = await cookies();

  try {
    // Try to identify current user and bump their sessionVersion
    const current = await getCurrentUser();
    if (current && current.id) {
      await dbConnect();
      // increment sessionVersion to invalidate existing tokens
      await User.findByIdAndUpdate(current.id, { $inc: { sessionVersion: 1 } });

      // NOTE: We intentionally do NOT emit a real-time FORCE_LOGOUT event
      // from the logout endpoint to avoid notifying the initiating session
      // (which would cause an immediate self-logout cascade). Other
      // sessions will be invalidated by the bumped `sessionVersion` and
      // will detect the change via normal auth checks or polling.
    }
  } catch (err) {
    console.error("Logout error identifying user:", err);
  }

  // Always delete cookie for this request
  cookieStore.delete("sitecraft_token");

  return NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });
}
