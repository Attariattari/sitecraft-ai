import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/models/Notification";

export async function GET(req) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }, );
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit")) || 20;

        const notifications = await Notification.find({ userId: user.id })
            .sort({ createdAt: -1 })
            .limit(limit);

        const unreadCount = await Notification.countDocuments({
            userId: user.id,
            read: false,
        });

        return NextResponse.json({
            success: true,
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error("Notifications fetch error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 }, );
    }
}

export async function PATCH() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }, );
        }

        await dbConnect();
        await Notification.updateMany({ userId: user.id, read: false }, { read: true }, );

        return NextResponse.json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        console.error("Mark all read error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 }, );
    }
}