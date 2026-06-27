import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/auth/requireUser";
import { createCheckoutSession } from "@/lib/server/payments/createCheckoutSession";
import { enforceRateLimit } from "@/lib/server/security/rateLimit";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";

export async function POST(request) {
  try {
    const limited = await enforceRateLimit(request, "checkout-create", { limit: 10, windowMs: 60_000 });
    if (!limited.allowed) return limited.response;

    const auth = await requireUser();
    if (auth.error) return auth.error;

    const body = await request.json();
    const result = await createCheckoutSession({
      user: auth.user,
      planSlug: body.planSlug,
      billingCycle: body.billingCycle,
      couponCode: body.couponCode,
      paymentMethod: body.paymentMethod,
    });

    if (!result.ok) return safeErrorResponse(result.message, result.status || 400);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    logServerError("Create checkout error", error);
    return safeErrorResponse();
  }
}
