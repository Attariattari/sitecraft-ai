import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || (user.role !== "admin" && user.role !== "super-admin")) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 }, );
        }

        await dbConnect();
        // Find users with pending appeals
        const requests = await User.find({ "restrictionAppeal.status": "pending" })
            .select(
                "name email profileImage status restrictionReason restrictionAppeal createdAt",
            )
            .sort({ "restrictionAppeal.requestedAt": -1 });

        return NextResponse.json({ success: true, requests });
    } catch (error) {
        console.error("Access requests fetch error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 }, );
    }
}