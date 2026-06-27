import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";
import { extendSubscription } from "@/lib/server/billing/adminBilling";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";

export async function POST(request, { params }) {
  try {
    const auth = await requireSuperAdmin();
    if (auth.error) return auth.error;
    const { id } = await params;
    const body = await request.json();
    const result = await extendSubscription({
      admin: auth.user,
      subscriptionId: id,
      months: body.months,
      days: body.days,
      reason: body.reason,
      request,
    });
    if (!result.ok) return safeErrorResponse(result.message, result.status || 400);
    return NextResponse.json({ success: true, subscription: result.subscription });
  } catch (error) {
    logServerError("Extend subscription error", error);
    return safeErrorResponse();
  }
}
