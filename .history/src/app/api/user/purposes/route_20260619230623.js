import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyAuthToken } from "@/lib/auth/tokens";
import { getPurposeLimitByPlan } from "@/lib/purposeLimits";
import { filterAvailablePurposes } from "@/lib/categories/categoryService";

import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function PATCH(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const payload = { id: user._id }; // For compatibility with existing code

    const { selectedPurposes, primaryPurpose } = await req.json();

    if (
      !selectedPurposes ||
      !Array.isArray(selectedPurposes) ||
      selectedPurposes.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "At least one purpose must be selected." },
        { status: 400 },
      );
    }

    await dbConnect();

    // Dynamic Validation: Check if purposes are actually available in DB
    const availablePurposes = await filterAvailablePurposes(selectedPurposes);
    if (availablePurposes.length !== selectedPurposes.length) {
      const invalid = selectedPurposes.filter(
        (p) => !availablePurposes.includes(p),
      );
      return NextResponse.json(
        {
          success: false,
          message: `One or more selected categories are no longer available: ${invalid.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const limit = getPurposeLimitByPlan(user.plan);
    if (selectedPurposes.length > limit) {
      return NextResponse.json(
        {
          success: false,
          message: `Your current plan allows only ${limit} website purpose${limit > 1 ? "s" : ""}. Upgrade to select more purposes.`,
        },
        { status: 403 },
      );
    }

    let finalPrimary = primaryPurpose;
    if (!finalPrimary || !selectedPurposes.includes(finalPrimary)) {
      finalPrimary = selectedPurposes[0];
    }

    await User.findByIdAndUpdate(
      payload.id,
      {
        $set: {
          selectedPurposes,
          primaryPurpose: finalPrimary,
          accountPurpose: finalPrimary,
        },
      },
      { runValidators: false },
    );

    return NextResponse.json({
      success: true,
      message: "Website purposes updated successfully.",
      user: {
        id: user._id,
        plan: user.plan,
        selectedPurposes: selectedPurposes,
        primaryPurpose: finalPrimary,
      },
    });
  } catch (error) {
    console.error("PATCH Purposes error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
