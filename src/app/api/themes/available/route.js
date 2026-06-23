import { NextResponse } from "next/server";
import { getAvailableThemes } from "@/lib/themes/themeService";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { applyThemePlanLimit, formatThemeLimitForDisplay } from "@/lib/themes/themePlanLimits";
import { getUserPlanSlug } from "@/lib/plans/planEntitlements";

/**
 * Public API to fetch available themes based on context.
 * Enforces active and unlocked status.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const context = searchParams.get("context") || "generate";

    const user = await getCurrentUser();
    const planSlug = getUserPlanSlug(user || { plan: "free" });
    const themes = applyThemePlanLimit(await getAvailableThemes(context), planSlug);

    return NextResponse.json({
      success: true,
      themes,
      plan: planSlug,
      limitLabel: formatThemeLimitForDisplay(planSlug),
    });
  } catch (error) {
    console.error("API Get available themes error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
