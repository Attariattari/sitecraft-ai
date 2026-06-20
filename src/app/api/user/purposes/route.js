import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyAuthToken } from "@/lib/auth/tokens";
import { getPurposeLimitByPlan, SUPPORTED_PURPOSES } from "@/lib/purposeLimits";

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

        const { selectedPurposes, primaryPurpose } = await req.json();

        if (!selectedPurposes || !Array.isArray(selectedPurposes) || selectedPurposes.length === 0) {
            return NextResponse.json({ success: false, message: "At least one purpose must be selected." }, { status: 400 });
        }

        const invalid = selectedPurposes.find(p => !SUPPORTED_PURPOSES.includes(p));
        if (invalid) {
            return NextResponse.json({ success: false, message: `Invalid purpose: ${invalid}` }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const limit = getPurposeLimitByPlan(user.plan);
        if (selectedPurposes.length > limit) {
            return NextResponse.json({
                success: false,
                message: `Your current plan allows only ${limit} website purpose${limit > 1 ? 's' : ''}. Upgrade to select more purposes.`
            }, { status: 403 });
        }

        let finalPrimary = primaryPurpose;
        if (!finalPrimary || !selectedPurposes.includes(finalPrimary)) {
            finalPrimary = selectedPurposes[0];
        }

        user.selectedPurposes = selectedPurposes;
        user.primaryPurpose = finalPrimary;
        user.accountPurpose = finalPrimary;

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Website purposes updated successfully.",
            user: {
                id: user._id,
                plan: user.plan,
                selectedPurposes: user.selectedPurposes,
                primaryPurpose: user.primaryPurpose
            }
        });

    } catch (error) {
        console.error("PATCH Purposes error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
