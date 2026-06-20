import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { assertNotRootSuperAdminTarget } from "@/lib/auth/rootSuperAdmin";
import { createActivityLog } from "@/lib/admin/adminHelpers";
import { sendAccessRestrictedEmail } from "@/lib/email/sendAccessRestrictedEmail";
import { signReviewToken } from "@/lib/auth/reviewTokens";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";
import { REALTIME_EVENTS } from "@/lib/realtime/events";

export async function PATCH(req, { params }) {
    try {
        const actor = await getCurrentUser();
        const { id } = await params;

        // Only Admin or Super Admin
        if (!actor || (actor.role !== "admin" && actor.role !== "super-admin")) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 }, );
        }

        const { reason } = await req.json();
        if (!reason) {
            return NextResponse.json({ success: false, message: "Reason is required" }, { status: 400 }, );
        }

        await dbConnect();
        const targetUser = await User.findById(id);
        if (!targetUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 }, );
        }

        // Protection
        assertNotRootSuperAdminTarget(targetUser);

        targetUser.status = "restricted";
        targetUser.restrictedAt = new Date();
        targetUser.restrictedBy = actor.id;
        targetUser.restrictionReason = reason;
        targetUser.sessionVersion += 1; // Force logout/session invalidation
        await targetUser.save();

        // Log Activity
        await createActivityLog({
            actorId: actor.id,
            targetUserId: targetUser._id,
            action: "user_restricted",
            description: `User restricted for: ${reason}`,
            metadata: { reason },
            req,
        });

        // Realtime Emits & Notifications
        await realtimeEmitter.emitToUser(
            targetUser._id,
            REALTIME_EVENTS.USER.RESTRICTED, {
                title: "Access Restricted",
                message: `Your access has been restricted due to: ${reason}`,
                metadata: { reason },
            },
        );

        await realtimeEmitter.emitToUser(
            targetUser._id,
            REALTIME_EVENTS.SESSION.FORCE_LOGOUT, {
                reason: "Account restricted by administrator",
            },
        );

        await realtimeEmitter.emitToAdmins(REALTIME_EVENTS.ADMIN.USER_UPDATED, {
            userId: targetUser._id,
            action: "restricted",
        });

        // Send Email
        const reviewToken = signReviewToken(targetUser._id);
        const requestReviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/restricted/request-review?token=${reviewToken}`;

        await sendAccessRestrictedEmail({
            to: targetUser.email,
            name: targetUser.name,
            reason,
            requestReviewUrl,
        });

        return NextResponse.json({
            success: true,
            message: "User restricted successfully",
        });
    } catch (error) {
        console.error("Restriction error:", error);
        return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 }, );
    }
}