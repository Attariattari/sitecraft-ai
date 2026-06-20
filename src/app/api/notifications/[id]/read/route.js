import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/models/Notification";

export async function PATCH(req, { params }) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }, );
        }

        const { id } = await params;

        await dbConnect();
        const notification = await Notification.findOne({
            _id: id,
            userId: user.id,
        });

        if (!notification) {
            return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 }, );
        }

        notification.read = true;
        await notification.save();

        return NextResponse.json({ success: true, message: "Marked as read" });
    } catch (error) {
        console.error("Mark read error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 }, );
    }
}