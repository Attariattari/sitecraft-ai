import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { assertNotRootSuperAdminTarget } from "@/lib/auth/rootSuperAdmin";
import {
    createActivityLog,
    createNotification,
} from "@/lib/admin/adminHelpers";
import { sendAccessRestoredEmail } from "@/lib/email/sendAccessRestoredEmail";

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

        // Create Notification
        await createNotification({
            userId: targetUser._id,
            type: "unrestriction",
            title: "Access Restored",
            message: "Your account access has been fully restored.",
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