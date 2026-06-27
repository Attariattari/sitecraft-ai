import { NextResponse } from "next/server";
import { getPublicFeatures } from "@/lib/features/featureCatalogService";
import { getPlanComparison } from "@/lib/plans/planEntitlements";
import { getOrSetCache, safeCacheKey } from "@/lib/server/cache/cache";
import { serverEnv } from "@/lib/server/env";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      category: searchParams.get("category"),
      status: searchParams.get("status"),
      plan: searchParams.get("plan"),
    };
    const key = safeCacheKey(["public", "features", JSON.stringify(filters)]);
    const features = await getOrSetCache(key, serverEnv.CACHE_PUBLIC_TTL_SECONDS, () =>
      getPublicFeatures(filters),
    );

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
