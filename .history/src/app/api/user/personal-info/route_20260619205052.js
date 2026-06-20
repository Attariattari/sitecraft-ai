import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import PersonalInfo from "@/models/PersonalInfo";
import User from "@/models/User";
import { verifyAuthToken } from "@/lib/auth/tokens";

export async function GET(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("sitecraft_token") ? .value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyAuthToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findById(decoded.userId).select("plan selectedPurposes primaryPurpose");
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        let personalInfo = await PersonalInfo.findOne({ userId: decoded.userId });

        if (!personalInfo) {
            // Return empty structure if not found
            return NextResponse.json({
                success: true,
                sharedInfo: {},
                purposeInfo: {},
                selectedPurposes: user.selectedPurposes || [],
                primaryPurpose: user.primaryPurpose || ""
            });
        }

        // Filter purposeInfo to only return data for selected purposes
        const filteredPurposeInfo = {};
        if (user.selectedPurposes && user.selectedPurposes.length > 0) {
            user.selectedPurposes.forEach(p => {
                if (personalInfo.purposeInfo[p]) {
                    filteredPurposeInfo[p] = personalInfo.purposeInfo[p];
                } else {
                    filteredPurposeInfo[p] = {};
                }
            });
        }

        return NextResponse.json({
            success: true,
            sharedInfo: personalInfo.sharedInfo || {},
            purposeInfo: filteredPurposeInfo,
            selectedPurposes: user.selectedPurposes || [],
            primaryPurpose: user.primaryPurpose || ""
        });

    } catch (error) {
        console.error("GET Personal Info error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("sitecraft_token") ? .value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyAuthToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
        }

        const { sharedInfo, purposeInfo, activePurpose } = await req.json();

        await dbConnect();

        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        let personalInfo = await PersonalInfo.findOne({ userId: decoded.userId });

        if (!personalInfo) {
            personalInfo = new PersonalInfo({ userId: decoded.userId });
        }

        if (sharedInfo) {
            personalInfo.sharedInfo = {...personalInfo.sharedInfo, ...sharedInfo };
        }

        if (purposeInfo && activePurpose) {
            // Validate that the purpose belongs to the user's selected purposes
            if (!user.selectedPurposes.includes(activePurpose)) {
                return NextResponse.json({ success: false, message: "Purpose not active for this user." }, { status: 400 });
            }

            personalInfo.purposeInfo[activePurpose] = {
                ...personalInfo.purposeInfo[activePurpose],
                ...purposeInfo
            };
            // Force Mongoose to recognize changes in the Mixed field
            personalInfo.markModified(`purposeInfo.${activePurpose}`);
        }

        await personalInfo.save();

        return NextResponse.json({
            success: true,
            message: "Personal information saved successfully.",
            personalInfo
        });

    } catch (error) {
        console.error("PATCH Personal Info error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}