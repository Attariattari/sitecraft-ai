import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { ACCOUNT_PURPOSES } from "@/lib/accountPurposeResolver";

export async function PATCH(req) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }, );
        }

        const { accountPurpose } = await req.json();

        if (!ACCOUNT_PURPOSES.includes(accountPurpose)) {
            return NextResponse.json({ success: false, message: "Invalid account purpose" }, { status: 400 }, );
        }

        await dbConnect();
        const updatedUser = await User.findByIdAndUpdate(
            user.id, { accountPurpose }, { new: true },
        ).select("-password -__v");

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 }, );
        }

        return NextResponse.json({
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.error("Update account purpose error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 }, );
    }
}