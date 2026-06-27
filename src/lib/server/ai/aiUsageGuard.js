import "server-only";
import dbConnect from "@/lib/dbConnect";
import AIUsageLog from "@/models/AIUsageLog";
import { requireFeature, requireLimit } from "@/lib/plans/planEntitlements";

export function checkAIEntitlement(user, featureKey = "aiWebsiteGeneration") {
  const feature = requireFeature(user, featureKey);
  if (!feature.allowed) return feature;
  return requireLimit(user, "aiCreditsPerMonth", user?.usage?.aiCreditsUsedThisMonth || 0);
}

export async function logAIUsage({ userId = null, route, provider = "gemini", model = "", tokensUsed = 0, creditsUsed = 0, status = "success", errorMessage = "" }) {
  try {
    await dbConnect();
    await AIUsageLog.create({
      userId,
      provider,
      model,
      totalTokens: tokensUsed,
      status: status === "failed" ? "failed" : status === "partial" ? "partial" : "success",
      error: errorMessage ? String(errorMessage).slice(0, 500) : "",
      route,
      creditsUsed,
    });
  } catch (error) {
    console.error(`AI usage log failed: ${error.message}`);
  }
}
