import "server-only";
import Site from "@/models/Site";
import GeneratedSite from "@/models/GeneratedSite";
import { getPlanLimits, normalizeActivePlanSlug } from "@/lib/plans/planEntitlements";
import { getPlanLimitMessage, getRecommendedUpgrade } from "@/lib/server/plans/planEntitlements";

export async function checkWebsiteLimit(userId, planSlug = "free") {
  const normalized = normalizeActivePlanSlug(planSlug);
  const limit = getPlanLimits(normalized).websites;
  const statusFilter = { $in: ["draft", "generated", "preview", "published"] };
  const [siteCount, generatedCount] = await Promise.all([
    Site.countDocuments({ ownerId: userId, status: statusFilter }),
    GeneratedSite.countDocuments({ userId, status: { $in: ["draft", "preview", "published"] } }),
  ]);
  const currentCount = Math.max(siteCount, generatedCount);
  const allowed = currentCount < limit;

  return {
    allowed,
    currentCount,
    limit,
    planSlug: normalized,
    recommendedPlan: allowed ? "" : getRecommendedUpgrade(normalized),
    reason: allowed ? "" : getPlanLimitMessage(normalized, "websites"),
  };
}
