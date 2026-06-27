import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";
import { giftPlan } from "@/lib/server/billing/adminBilling";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";

export async function POST(request) {
  try {
    const auth = await requireSuperAdmin();
    if (auth.error) return auth.error;
    const body = await request.json();
    const result = await giftPlan({
      admin: auth.user,
      userId: body.userId,
      planSlug: body.planSlug,
      months: body.months,
      reason: body.reason,
      request,
    });
    if (!result.ok) return safeErrorResponse(result.message, result.status || 400);
    return NextResponse.json({ success: true, subscription: result.subscription, grant: result.grant });
  } catch (error) {
    logServerError("Gift plan error", error);
    return safeErrorResponse();
  }
}
