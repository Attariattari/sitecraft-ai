import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import {
  getPlanBySlug,
  getPlanFeatures,
  getPlanLimits,
  getUserPlanSlug,
  serializePublicPlan,
} from "@/lib/plans/planEntitlements";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const planSlug = getUserPlanSlug(user);

    return NextResponse.json({
      success: true,
      plan: serializePublicPlan(getPlanBySlug(planSlug)),
      subscription: user.subscription || {
        status: planSlug === "free" ? "free" : "active",
        planSlug,
      },
      usage: user.usage || {},
      features: getPlanFeatures(planSlug),
      limits: getPlanLimits(planSlug),
    });
  } catch (error) {
    console.error("Get user plan error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
