import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import {
    createActivityLog,
    createNotification,
} from "@/lib/admin/adminHelpers";

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

        targetUser.restrictionAppeal.status = "rejected";
        targetUser.restrictionAppeal.reviewedBy = actor.id;
        targetUser.restrictionAppeal.reviewedAt = new Date();
        await targetUser.save();

        // Log & Notify
        await createActivityLog({
            actorId: actor.id,
            targetUserId: targetUser._id,
            action: "appeal_rejected",
            description: "Access appeal rejected",
            req,
        });

        await createNotification({
            userId: targetUser._id,
            type: "appeal_status",
            title: "Appeal Rejected",
            message: "Your access review request has been reviewed and rejected. Your account remains restricted.",
        });

        // Optionally send rejection email if needed (not explicitly asked but good practice)

        return NextResponse.json({
            success: true,
            message: "Appeal rejected successfully",
        });
    } catch (error) {
        console.error("Appeal reject error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 }, );
    }
}