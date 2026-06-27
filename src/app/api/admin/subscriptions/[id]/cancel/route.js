import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";
import { cancelSubscription } from "@/lib/server/billing/adminBilling";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";

export async function POST(request, { params }) {
  try {
    const auth = await requireSuperAdmin();
    if (auth.error) return auth.error;
    const { id } = await params;
    const body = await request.json();
    const result = await cancelSubscription({
      admin: auth.user,
      subscriptionId: id,
      reason: body.reason,
      request,
    });
    if (!result.ok) return safeErrorResponse(result.message, result.status || 400);
    return NextResponse.json({ success: true, subscription: result.subscription });
  } catch (error) {
    logServerError("Cancel subscription error", error);
    return safeErrorResponse();
  }
}
