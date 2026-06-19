import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import {
    isRootSuperAdminEmail,
    assertNotRootSuperAdminTarget,
} from "@/lib/auth/rootSuperAdmin";
import {
    createActivityLog,
    createNotification,
} from "@/lib/admin/adminHelpers";
import { sendRoleChangedEmail } from "@/lib/email/sendRoleChangedEmail";

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
            // Only Root can promote others to super-admin (or maybe only Root can exist?
            // User said: "block creating extra root super-admin", "anyone -> root super-admin through UI/API"
            // Actually, "Root Super Admin ... can promote user to admin ... can demote admin to user"
            // "everyone -> root super-admin ... not allowed"
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

        // Create Notification
        await createNotification({
            userId: targetUser._id,
            type: "role_change",
            title: "Role Updated",
            message: `Your account role has been changed from ${oldRole} to ${newRole}.`,
            metadata: { oldRole, newRole },
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