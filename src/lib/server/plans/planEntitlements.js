import "server-only";
import User from "@/models/User";
import { getAvailableThemes } from "@/lib/themes/themeService";
import { applyThemePlanLimit } from "@/lib/themes/themePlanLimits";
import {
  getPlanBySlug,
  getPlanFeatures,
  getPlanLimits,
  getUserPlanSlug,
  normalizeActivePlanSlug,
} from "@/lib/plans/planEntitlements";
import { isTemplateAllowedForPlan } from "@/lib/templates/templateService";

export async function getUserPlan(userId) {
  const user = await User.findById(userId).select("plan subscription usage").lean();
  const slug = getUserPlanSlug(user || { plan: "free" });
  return { slug, plan: getPlanBySlug(slug), user };
}

export function getRecommendedUpgrade(planSlug) {
  const slug = normalizeActivePlanSlug(planSlug);
  if (slug === "free") return "basic";
  if (slug === "basic") return "pro";
  return "";
}

export function getPlanLimitMessage(planSlug, limitType = "websites") {
  const slug = normalizeActivePlanSlug(planSlug);
  const planName = slug === "free" ? "Free" : slug === "basic" ? "Basic" : "Pro";
  if (limitType === "websites") {
    return `You have reached your website limit on the ${planName} plan.`;
  }
  if (limitType === "aiCredits") {
    return `You have used your available AI credits on the ${planName} plan.`;
  }
  return `Your ${planName} plan limit has been reached.`;
}

export async function canGenerateWebsite(userId) {
  const { slug, plan, user } = await getUserPlan(userId);
  return {
    allowed: Boolean(plan.features.aiWebsiteGeneration),
    planSlug: slug,
    plan,
    user,
    reason: plan.features.aiWebsiteGeneration ? "" : "Website generation is not included in this plan.",
    recommendedPlan: getRecommendedUpgrade(slug),
  };
}

export async function canUseTemplate(userId, template) {
  const { slug } = await getUserPlan(userId);
  return {
    allowed: isTemplateAllowedForPlan(template, slug),
    planSlug: slug,
    recommendedPlan: template?.availablePlans?.includes("basic") ? "basic" : "pro",
  };
}

export async function canUseTheme(userId, themeId, context = "generate") {
  const { slug } = await getUserPlan(userId);
  const themes = await getAvailableThemes(context);
  const allowedThemes = applyThemePlanLimit(themes, slug);
  const allowed = allowedThemes.some((theme) => theme.themeId === themeId || theme.slug === themeId);
  return {
    allowed,
    planSlug: slug,
    recommendedPlan: getRecommendedUpgrade(slug) || "pro",
    allowedThemes,
    limit: getPlanLimits(slug).themes,
    features: getPlanFeatures(slug),
  };
}
