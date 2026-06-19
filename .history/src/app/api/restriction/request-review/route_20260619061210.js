import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyReviewToken } from "@/lib/auth/reviewTokens";
import { createActivityLog } from "@/lib/admin/adminHelpers";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";
import { REALTIME_EVENTS } from "@/lib/realtime/events";

export async function POST(req) {
    try {
        const { token, message } = await req.json();

        if (!token || !message) {
            return NextResponse.json({ success: false, message: "Token and message are required" }, { status: 400 }, );
        }

        const decoded = verifyReviewToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 }, );
        }

        await dbConnect();
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 }, );
        }

        if (user.status !== "restricted") {
            return NextResponse.json({ success: false, message: "Account is not restricted" }, { status: 400 }, );
        }

        user.restrictionAppeal = {
            requested: true,
            message,
            requestedAt: new Date(),
            status: "pending",
        };

        await user.save();

        // Notify Super Admins via Realtime & DB
        await realtimeEmitter.emitToSuperAdmins(
            REALTIME_EVENTS.ADMIN.ACCESS_REQUEST, {
                title: "New Appeal Request",
                message: `User ${user.email} has submitted an access review request.`,
                metadata: { targetUserId: user._id },
            },
        );

        // Log Activity
        await createActivityLog({
            actorId: user._id,
            action: "appeal_submitted",
            description: "Appealed for restriction review",
            metadata: { message },
            req,
        });

        return NextResponse.json({
            success: true,
            message: "Your review request has been sent to the Super Admin.",
        });
    } catch (error) {
        console.error("Review request error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 }, );
    }
}