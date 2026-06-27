import "server-only";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import { getPurchasablePlanBySlug } from "@/lib/plans/planService";
import { BILLING_CYCLES, BILLING_PLAN_SLUGS, getPaymentMethods } from "@/lib/server/billing/billingConfig";
import { calculateCheckoutPricing, getPlanAmount } from "@/lib/server/billing/pricing";
import { getFirstPurchaseBonus } from "@/lib/server/billing/applyFirstPurchaseBonus";
import { validateCoupon } from "@/lib/server/billing/validateCoupon";
import { getPaymentProvider } from "@/lib/server/payments/paymentProviderFactory";
import { serverEnv } from "@/lib/server/env";

export async function createCheckoutSession({ user, planSlug, billingCycle, couponCode, paymentMethod }) {
  const slug = String(planSlug || "").toLowerCase();
  const cycle = BILLING_CYCLES.includes(billingCycle) ? billingCycle : "monthly";
  const method = String(paymentMethod || "card").toLowerCase();

  if (serverEnv.PAYMENTS_ENABLED !== "true") {
    return { ok: false, status: 503, message: "Payments are not enabled yet." };
  }
  if (!BILLING_PLAN_SLUGS.includes(slug)) {
    return { ok: false, status: 400, message: "This plan is not available for checkout." };
  }

  const paymentMethods = getPaymentMethods();
  const methodConfig = paymentMethods.find((item) => item.id === method);
  if (!methodConfig?.enabled) {
    return { ok: false, status: 400, message: "Selected payment method is not available yet." };
  }

  const plan = await getPurchasablePlanBySlug(slug);
  if (!plan) return { ok: false, status: 404, message: "Plan is not purchasable." };

  let couponResult = null;
  const amount = getPlanAmount(plan, cycle);
  if (couponCode) {
    couponResult = await validateCoupon({
      code: couponCode,
      userId: user.id,
      planSlug: slug,
      amount,
    });
    if (!couponResult.valid) return { ok: false, status: 400, message: couponResult.message };
  }

  const pricing = calculateCheckoutPricing({ plan, billingCycle: cycle, couponResult });
  const bonus = await getFirstPurchaseBonus({ userId: user.id, planSlug: slug });

  await dbConnect();
  const reference = `scai_${crypto.randomBytes(12).toString("hex")}`;
  const payment = await Payment.create({
    userId: user.id,
    planSlug: slug,
    amount: pricing.amount,
    discountAmount: pricing.discountAmount,
    finalAmount: pricing.finalAmount,
    currency: pricing.currency,
    paymentMethod: method,
    paymentProvider: methodConfig.provider,
    providerReference: reference,
    status: "pending",
    billingCycle: cycle,
    couponCode: couponResult?.code || "",
    metadata: {
      cycleMonths: pricing.cycleMonths,
      couponBonusMonths: pricing.couponBonusMonths,
      firstPurchaseBonusMonths: bonus.bonusMonths,
      firstPurchaseBonusEligible: bonus.applies,
    },
  });

  const provider = getPaymentProvider(method);
  const session = await provider.createCheckoutSession({
    user,
    plan,
    billingCycle: cycle,
    coupon: couponResult?.coupon || null,
    amount: pricing.finalAmount,
    payment,
  });

  if (!session.ok) {
    payment.status = "failed";
    payment.failedReason = session.code || session.message || "Provider not configured";
    await payment.save();
    return { ok: false, status: 400, message: session.message };
  }

  return {
    ok: true,
    paymentId: payment._id.toString(),
    providerReference: reference,
    redirectUrl: session.redirectUrl,
    instructions: session.instructions || "",
    pricing,
    bonus,
  };
}
