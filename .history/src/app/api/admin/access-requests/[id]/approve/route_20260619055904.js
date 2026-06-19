import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
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

        targetUser.status = "active";
        targetUser.restrictionAppeal.status = "approved";
        targetUser.restrictionAppeal.reviewedBy = actor.id;
        targetUser.restrictionAppeal.reviewedAt = new Date();
        await targetUser.save();

        // Log & Notify
        await createActivityLog({
            actorId: actor.id,
            targetUserId: targetUser._id,
            action: "appeal_approved",
            description: "Access appeal approved",
            req,
        });

        await createNotification({
            userId: targetUser._id,
            type: "unrestriction",
            title: "Appeal Approved",
            message: "Your access review request has been approved. Your account is now active.",
        });

        // Email
        await sendAccessRestoredEmail({
            to: targetUser.email,
            name: targetUser.name,
            loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
        });

        return NextResponse.json({
            success: true,
            message: "Appeal approved successfully",
        });
    } catch (error) {
        console.error("Appeal approve error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 }, );
    }
}