import { NextResponse } from "next/server";
import { getAvailableThemes } from "@/lib/themes/themeService";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { applyThemePlanLimit, formatThemeLimitForDisplay } from "@/lib/themes/themePlanLimits";
import { getUserPlanSlug, getNextPlanForLimit } from "@/lib/plans/planEntitlements";
import { getOrSetCache, safeCacheKey } from "@/lib/server/cache/cache";
import { serverEnv } from "@/lib/server/env";

/**
 * Public API to fetch available themes based on context.
 * Enforces active and unlocked status.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const context = searchParams.get("context") || "generate";
    const isPublicShowcase = searchParams.get("public") === "true";
    const includeLocked = searchParams.get("includeLocked") === "true";
    const requestedLimit = Number.parseInt(searchParams.get("limit") || "", 10);

    const user = await getCurrentUser();
    const planSlug = getUserPlanSlug(user || { plan: "free" });
    const availableThemes = await getOrSetCache(
      safeCacheKey(["public", "themes", context]),
      serverEnv.CACHE_PUBLIC_TTL_SECONDS,
      () => getAvailableThemes(context),
    );
    const allowedThemes = applyThemePlanLimit(availableThemes, planSlug);
    const allowedIds = new Set(allowedThemes.flatMap((theme) => [theme.themeId, theme.slug].filter(Boolean)));
    const themes = includeLocked
      ? availableThemes.map((theme) => ({
          ...theme,
          locked: !allowedIds.has(theme.themeId) && !allowedIds.has(theme.slug),
          upgradeTo: getNextPlanForLimit("themes", planSlug, allowedThemes.length),
        }))
      : isPublicShowcase
      ? availableThemes.slice(0, Number.isFinite(requestedLimit) ? requestedLimit : 6)
      : allowedThemes;

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
