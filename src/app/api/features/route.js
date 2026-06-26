import { NextResponse } from "next/server";
import { getPublicFeatures } from "@/lib/features/featureCatalogService";
import { getPlanComparison } from "@/lib/plans/planEntitlements";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const features = await getPublicFeatures({
      category: searchParams.get("category"),
      status: searchParams.get("status"),
      plan: searchParams.get("plan"),
    });

    return NextResponse.json({
      success: true,
      features,
      comparison: getPlanComparison(),
    });
  } catch (error) {
    console.error("Public features API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
