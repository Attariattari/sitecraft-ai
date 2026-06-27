import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/auth/requireUser";
import { getPurchasablePlanBySlug } from "@/lib/plans/planService";
import { getPlanAmount, calculateCheckoutPricing } from "@/lib/server/billing/pricing";
import { validateCoupon } from "@/lib/server/billing/validateCoupon";
import { getFirstPurchaseBonus } from "@/lib/server/billing/applyFirstPurchaseBonus";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";
import { enforceRateLimit } from "@/lib/server/security/rateLimit";

export async function POST(request) {
  try {
    const limited = await enforceRateLimit(request, "checkout-coupon", { limit: 20, windowMs: 60_000 });
    if (!limited.allowed) return limited.response;

    const auth = await requireUser();
    if (auth.error) return auth.error;

    const body = await request.json();
    const plan = await getPurchasablePlanBySlug(body.planSlug);
    if (!plan) return safeErrorResponse("Plan is not purchasable.", 404);

    const billingCycle = body.billingCycle === "yearly" ? "yearly" : "monthly";
    const amount = getPlanAmount(plan, billingCycle);
    const coupon = await validateCoupon({
      code: body.couponCode,
      userId: auth.user.id,
      planSlug: plan.slug,
      amount,
    });
    if (!coupon.valid) return safeErrorResponse(coupon.message, 400);

    const pricing = calculateCheckoutPricing({ plan, billingCycle, couponResult: coupon });
    const firstPurchaseBonus = await getFirstPurchaseBonus({ userId: auth.user.id, planSlug: plan.slug });

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountAmount: coupon.discountAmount,
        bonusMonths: coupon.bonusMonths,
        message: coupon.message,
      },
      pricing,
      firstPurchaseBonus,
    });
  } catch (error) {
    logServerError("Apply coupon error", error);
    return safeErrorResponse();
  }
}
