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

      // Emit a database notification for other devices (polling clients will pick this up)
      try {
        await realtimeEmitter.emitToUser(current.id, REALTIME_EVENTS.SESSION.FORCE_LOGOUT, {
          title: "Signed out",
          message: "You have been signed out from another session.",
        });
      } catch (e) {
        console.warn("Realtime emit failed on logout:", e);
      }
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
