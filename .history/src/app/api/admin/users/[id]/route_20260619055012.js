import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { assertNotRootSuperAdminTarget } from "@/lib/auth/rootSuperAdmin";
import { createActivityLog } from "@/lib/admin/adminHelpers";

export async function GET(req, { params }) {
    try {
        const user = await getCurrentUser();
        const { id } = await params;

        // RBAC Check
        if (!user || (user.role !== "admin" && user.role !== "super-admin")) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 }, );
        }

        await dbConnect();

        const targetUser = await User.findById(id).select(
            "-password -resetPasswordToken -resetPasswordExpires",
        );
        if (!targetUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 }, );
        }

        return NextResponse.json({
            success: true,
            user: targetUser,
        });
    } catch (error) {
        console.error("Admin user detail error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 }, );
    }
}

export async function DELETE(req, { params }) {
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

        // Protection
        assertNotRootSuperAdminTarget(targetUser);

        await User.findByIdAndDelete(id);

        // Log Activity
        await createActivityLog({
            actorId: actor.id,
            targetUserId: id,
            action: "user_deleted",
            description: `User ${targetUser.email} was deleted by ${actor.email}`,
            metadata: { deletedUserEmail: targetUser.email },
            req,
        });

        return NextResponse.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 }, );
    }
}