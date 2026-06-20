import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import {
    isRootSuperAdminEmail,
    assertNotRootSuperAdminTarget,
} from "@/lib/auth/rootSuperAdmin";
import { createActivityLog } from "@/lib/admin/adminHelpers";
import { sendRoleChangedEmail } from "@/lib/email/sendRoleChangedEmail";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";
import { REALTIME_EVENTS } from "@/lib/realtime/events";

export async function PATCH(req, { params }) {
    try {
        const actor = await getCurrentUser();
        const { id } = await params;

        if (!actor || actor.role !== "super-admin") {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 }, );
        }

        const { role: newRole } = await req.json();
        if (!["user", "admin", "super-admin"].includes(newRole)) {
            return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 }, );
        }

        await dbConnect();
        const targetUser = await User.findById(id);
        if (!targetUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 }, );
        }

        // Role Change Rules
        assertNotRootSuperAdminTarget(targetUser);
        if (newRole === "super-admin" && !actor.isRootSuperAdmin) {
            return NextResponse.json({ success: false, message: "Only one Root Super Admin can exist." }, { status: 403 }, );
        }

        const oldRole = targetUser.role;
        targetUser.role = newRole;
        await targetUser.save();

        // Log Activity
        await createActivityLog({
            actorId: actor.id,
            targetUserId: targetUser._id,
            action: "role_changed",
            description: `Role changed from ${oldRole} to ${newRole}`,
            metadata: { oldRole, newRole },
            req,
        });

        // Realtime Emits & Notifications
        await realtimeEmitter.emitToUser(
            targetUser._id,
            REALTIME_EVENTS.USER.ROLE_UPDATED, {
                title: "Role Updated",
                message: `Your account role has been changed from ${oldRole} to ${newRole}.`,
                metadata: { oldRole, newRole },
            },
        );

        await realtimeEmitter.emitToAdmins(REALTIME_EVENTS.ADMIN.USER_UPDATED, {
            userId: targetUser._id,
            action: "role_changed",
        });

        // Send Email
        await sendRoleChangedEmail({
            to: targetUser.email,
            name: targetUser.name,
            oldRole,
            newRole,
        });

        return NextResponse.json({
            success: true,
            message: "Role updated successfully",
        });
    } catch (error) {
        console.error("Role change error:", error);
        return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 }, );
    }
}