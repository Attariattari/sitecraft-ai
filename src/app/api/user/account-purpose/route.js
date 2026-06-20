import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyAuthToken } from "@/lib/auth/tokens";
import { isCategorySelectable } from "@/lib/categories/categoryService";

export async function PATCH(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("sitecraft_token") ?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyAuthToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
        }

        const { accountPurpose } = await req.json();

        // Validate accountPurpose availability server-side
        if (!accountPurpose) {
            return NextResponse.json({ success: false, message: "Invalid account purpose. Please select a valid category." }, { status: 400 });
        }

        const selectable = await isCategorySelectable(accountPurpose);
        if (!selectable) {
            return NextResponse.json({ success: false, message: "This category is currently unavailable." }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        await User.findByIdAndUpdate(
            decoded.userId, { $set: { accountPurpose, primaryPurpose: accountPurpose } }, { runValidators: false }
        );

        return NextResponse.json({
            success: true,
            message: "Account purpose updated successfully.",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                accountPurpose: user.accountPurpose
            }
        });
    } catch (error) {
        console.error("Update account purpose error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
