import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Template from "@/models/Template";
import { TEMPLATE_REGISTRY } from "@/lib/templateRegistry";
import { siteCraftTemplates } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getPlanLimits, getUserPlanSlug, requireFeature } from "@/lib/plans/planEntitlements";
import { logServerError, safeErrorResponse } from "@/lib/server/security/safeError";
import { getOrSetCache, safeCacheKey } from "@/lib/server/cache/cache";
import { serverEnv } from "@/lib/server/env";

export async function GET(request) {
  try {
    await dbConnect();
    const user = await getCurrentUser();
    const entitlementUser = user || { plan: "free" };

    const templateAccess = requireFeature(entitlementUser, "templateAccess");
    if (!templateAccess.allowed) {
      return NextResponse.json(
        {
          success: false,
          code: templateAccess.code,
          message: templateAccess.message,
          upgradeTo: templateAccess.upgradeTo,
        },
        { status: 403 },
      );
    }

    const planSlug = getUserPlanSlug(entitlementUser);
    await getOrSetCache("public:templates:db-seed", serverEnv.CACHE_PUBLIC_TTL_SECONDS, async () => {
      let templates = await Template.find({ isActive: true }).sort({ order: 1 }).lean();
      if (templates.length === 0) {
        const created = await Template.insertMany(siteCraftTemplates);
        templates = created.map((item) => item.toObject());
      }
      return templates.length;
    });
    const key = safeCacheKey(["public", "templates", planSlug]);
    const registryTemplates = await getOrSetCache(key, serverEnv.CACHE_PUBLIC_TTL_SECONDS, async () =>
      Object.values(TEMPLATE_REGISTRY).sort((a, b) => a.order - b.order),
    );
    const templateLimit = getPlanLimits(planSlug).templates;
    const visibleTemplates = templateLimit === -1
      ? registryTemplates
      : registryTemplates.slice(0, templateLimit);

    return NextResponse.json({
      success: true,
      templates: visibleTemplates,
      count: visibleTemplates.length,
      plan: planSlug,
      totalAvailable: registryTemplates.length,
    });
  } catch (error) {
    logServerError("Get templates error", error);
    return safeErrorResponse();
  }
}
