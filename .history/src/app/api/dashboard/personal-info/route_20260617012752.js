import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PersonalInfo from "@/models/PersonalInfo";
import { personalInfoSchema } from "@/lib/validations/personalInfoValidation";
import mongoose from "mongoose";

// A fallback user ID for demo purposes, representing the current logged-in user if auth is not yet plugged in
// In a real scenario, this would come from a session (e.g. NextAuth or Clerk or custom JWT)
const DEMO_USER_ID = new mongoose.Types.ObjectId("65b0f1a8e1b2f90a2a1b1c3d"); // Example dummy static ObjectId for safety

async function getUserId() {
    // TODO: Replace with actual auth session retrieval
    return DEMO_USER_ID;
}

function calculateCompletionScore(data) {
    let score = 0;
    const totalWeight = 7;
    let sectionsFilled = 0;

    if (data.basicInfo && (data.basicInfo.fullName || data.basicInfo.displayName))
        sectionsFilled++;
    if (
        data.contactInfo &&
        (data.contactInfo.primaryEmail || data.contactInfo.phone)
    )
        sectionsFilled++;
    if (data.professionalDetails && data.professionalDetails.professionalSummary)
        sectionsFilled++;
    if (data.skills && data.skills.length > 0) sectionsFilled++;
    if (data.projects && data.projects.length > 0) sectionsFilled++;
    if (data.socialLinks && Object.values(data.socialLinks).some((link) => link))
        sectionsFilled++;
    if (data.websitePreferences && data.websitePreferences.preferredTone)
        sectionsFilled++;

    score = Math.round((sectionsFilled / totalWeight) * 100);
    return Math.min(score, 100);
}

export async function GET(request) {
    try {
        await dbConnect();
        const userId = await getUserId();

        let personalInfo = await PersonalInfo.findOne({ userId });

        if (!personalInfo) {
            // Return safe empty structure
            return NextResponse.json({
                success: true,
                data: {
                    completionScore: 0,
                    basicInfo: {},
                    contactInfo: {},
                    professionalDetails: {},
                    skills: [],
                    services: [],
                    projects: [],
                    experience: [],
                    education: [],
                    socialLinks: {},
                    certifications: [],
                    testimonials: [],
                    websitePreferences: {},
                },
            });
        }

        return NextResponse.json({
            success: true,
            data: personalInfo,
        });
    } catch (error) {
        console.error("GET Personal Info Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch personal info" }, { status: 500 }, );
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const userId = await getUserId();
        const body = await request.json();

        // Validation
        const validationResult = personalInfoSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json({
                success: false,
                error: "Validation failed",
                details: validationResult.error.format(),
            }, { status: 400 }, );
        }

        const validData = validationResult.data;
        const completionScore = calculateCompletionScore(validData);

        // Create or update
        const updatedInfo = await PersonalInfo.findOneAndUpdate({ userId }, {...validData, completionScore }, { new: true, upsert: true, setDefaultsOnInsert: true }, );

        return NextResponse.json({
            success: true,
            data: updatedInfo,
        }, { status: 200 }, );
    } catch (error) {
        console.error("POST Personal Info Error:", error);
        return NextResponse.json({ success: false, error: "Failed to save personal info" }, { status: 500 }, );
    }
}

export async function PATCH(request) {
    return POST(request); // Leverage the same upsert logic
}