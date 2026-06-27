import { NextResponse } from "next/server";
import { getActivePlans } from "@/lib/plans/planService";
import { getOrSetCache } from "@/lib/server/cache/cache";
import { serverEnv } from "@/lib/server/env";

export async function GET() {
  try {
    const plans = await getOrSetCache("public:plans", serverEnv.CACHE_PUBLIC_TTL_SECONDS, getActivePlans);

    return NextResponse.json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error("Get plans error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
