import { NextResponse } from "next/server";
import { getPublicFeatureFlags } from "@/lib/features/featureFlagService";

export async function GET() {
  try {
    const flags = await getPublicFeatureFlags();

    return NextResponse.json({
      success: true,
      flags,
    });
  } catch (error) {
    console.error("Public API Get feature flags error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
