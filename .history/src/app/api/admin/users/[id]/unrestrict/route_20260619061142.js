import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { assertNotRootSuperAdminTarget } from "@/lib/auth/rootSuperAdmin";
import { createActivityLog } from "@/lib/admin/adminHelpers";
import { sendAccessRestoredEmail } from "@/lib/email/sendAccessRestoredEmail";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";
import { REALTIME_EVENTS } from "@/lib/realtime/events";

export async function PATCH(req, { params }) {
    try {
        const actor = await getCurrentUser();
        const { id } = await params;

        if (!actor || (actor.role !== "admin" && actor.role !== "super-admin")) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 }, );
        }

        await dbConnect();
        const targetUser = await User.findById(id);
        if (!targetUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 }, );
        }

        assertNotRootSuperAdminTarget(targetUser);

        targetUser.status = "active";
        if (
            targetUser.restrictionAppeal &&
            targetUser.restrictionAppeal.status === "pending"
        ) {
            targetUser.restrictionAppeal.status = "approved";
            targetUser.restrictionAppeal.reviewedBy = actor.id;
            targetUser.restrictionAppeal.reviewedAt = new Date();
        }
        await targetUser.save();

        // Log Activity
        await createActivityLog({
            actorId: actor.id,
            targetUserId: targetUser._id,
            action: "user_unrestricted",
            description: "User access restored",
            req,
        });

        // Realtime Emits & Notifications
        await realtimeEmitter.emitToUser(
            targetUser._id,
            REALTIME_EVENTS.USER.UNRESTRICTED, {
                title: "Access Restored",
                message: "Your account access has been fully restored.",
            },
        );

        await realtimeEmitter.emitToAdmins(REALTIME_EVENTS.ADMIN.USER_UPDATED, {
            userId: targetUser._id,
            action: "unrestricted",
        });

        // Send Email
        await sendAccessRestoredEmail({
            to: targetUser.email,
            name: targetUser.name,
            loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
        });

        return NextResponse.json({
            success: true,
            message: "User unrestricted successfully",
        });
    } catch (error) {
        console.error("Unrestrict error:", error);
        return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 }, );
    }
}