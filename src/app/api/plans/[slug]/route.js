import { NextResponse } from "next/server";
import { getPublicPlanBySlug } from "@/lib/plans/planService";
import { getOrSetCache } from "@/lib/server/cache/cache";
import { serverEnv } from "@/lib/server/env";
import { safeErrorResponse } from "@/lib/server/security/safeError";

export async function GET(_request, { params }) {
  const { slug } = await params;
  const planSlug = String(slug || "").toLowerCase();
  const plan = await getOrSetCache(
    `public:plan:${planSlug}`,
    serverEnv.CACHE_PUBLIC_TTL_SECONDS,
    () => getPublicPlanBySlug(planSlug),
  );

  if (!plan) return safeErrorResponse("Plan not found.", 404);
  return NextResponse.json({ success: true, plan });
}
