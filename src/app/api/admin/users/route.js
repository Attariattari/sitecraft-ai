import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req) {
    try {
        const user = await getCurrentUser();

        // RBAC Check
        if (!user || (user.role !== "admin" && user.role !== "super-admin")) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 }, );
        }

        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role");
        const plan = searchParams.get("plan");
        const accountPurpose = searchParams.get("accountPurpose");
        const status = searchParams.get("status");
        const verified = searchParams.get("verified");

        await dbConnect();

        const query = {};
        if (role) query.role = role;
        if (plan) query.plan = plan;
        if (accountPurpose) query.accountPurpose = accountPurpose;
        if (status) query.status = status;
        if (verified === "true") query.isEmailVerified = true;
        if (verified === "false") query.isEmailVerified = false;

        // Fetch users, excluding sensitive fields
        const users = await User.find(query)
            .select("-password -resetPasswordToken -resetPasswordExpires")
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            users,
        });
    } catch (error) {
        console.error("Admin user list error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 }, );
    }
}
