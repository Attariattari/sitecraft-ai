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

    const { reason } = await req.json();
    if (!reason?.trim()) {
      return NextResponse.json({ success: false, message: "Reason is required" }, { status: 400 });
    }

    await dbConnect();
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    assertNotRootSuperAdminTarget(targetUser);

    targetUser.status = "suspended";
    targetUser.suspendedAt = new Date();
    targetUser.suspendedBy = actor.id;
    targetUser.suspendedReason = reason;
    targetUser.sessionVersion += 1;
    await targetUser.save();

    await createActivityLog({
      actorId: actor.id,
      targetUserId: targetUser._id,
      action: "user_suspended",
      description: "User suspended",
      metadata: { reason },
      req,
    });

    await realtimeEmitter.emitToUser(targetUser._id, REALTIME_EVENTS.USER.SUSPENDED, {
      title: "Account Suspended",
      message: "Your account has been suspended.",
      metadata: { reason },
      severity: "error",
    });

    await realtimeEmitter.emitToUser(targetUser._id, REALTIME_EVENTS.SESSION.FORCE_LOGOUT, {
      reason: "suspended",
      redirectTo: "/suspended",
    });

    await realtimeEmitter.emitToAdmins(REALTIME_EVENTS.ADMIN.USER_UPDATED, {
      userId: targetUser._id,
      action: "suspended",
    });

    return NextResponse.json({
      success: true,
      message: "User suspended successfully",
    });
  } catch (error) {
    console.error("Suspension error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
