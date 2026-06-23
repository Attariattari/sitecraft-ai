import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { assertNotRootSuperAdminTarget } from "@/lib/auth/rootSuperAdmin";
import { createActivityLog } from "@/lib/admin/adminHelpers";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";
import { REALTIME_EVENTS } from "@/lib/realtime/events";

export async function PATCH(req, { params }) {
  try {
    const actor = await getCurrentUser();
    const { id } = await params;

    if (!actor || actor.role !== "super-admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    assertNotRootSuperAdminTarget(targetUser);

    targetUser.sessionVersion += 1;
    await targetUser.save();

    await createActivityLog({
      actorId: actor.id,
      targetUserId: targetUser._id,
      action: "user_sessions_revoked",
      description: "User sessions revoked",
      req,
    });

    await realtimeEmitter.emitToUser(targetUser._id, REALTIME_EVENTS.USER.SESSION_REVOKED, {
      title: "Session Ended",
      message: "Your session was ended by an administrator.",
      severity: "warning",
    });

    await realtimeEmitter.emitToUser(targetUser._id, REALTIME_EVENTS.SESSION.FORCE_LOGOUT, {
      reason: "session-revoked",
      redirectTo: "/login",
    });

    return NextResponse.json({
      success: true,
      message: "User sessions revoked successfully",
    });
  } catch (error) {
    console.error("Revoke sessions error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
