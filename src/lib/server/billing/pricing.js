import "server-only";
import { getDefaultCurrency } from "@/lib/server/billing/billingConfig";

export function getPlanAmount(plan, billingCycle = "monthly") {
  if (billingCycle === "yearly") return Number(plan.priceYearly || plan.priceMonthly * 10 || 0);
  return Number(plan.priceMonthly || 0);
}

export function addMonths(date, months) {
  const next = new Date(date);
  const currentDate = next.getDate();
  next.setMonth(next.getMonth() + Number(months || 0));
  if (next.getDate() < currentDate) next.setDate(0);
  return next;
}

export function calculateCheckoutPricing({ plan, billingCycle = "monthly", couponResult = null }) {
  const amount = getPlanAmount(plan, billingCycle);
  const discountAmount = Math.min(Number(couponResult?.discountAmount || 0), amount);
  const finalAmount = Math.max(0, amount - discountAmount);
  const cycleMonths = billingCycle === "yearly" ? 12 : 1;
  const couponBonusMonths = Number(couponResult?.bonusMonths || 0);

  return {
    amount,
    discountAmount,
    finalAmount,
    currency: getDefaultCurrency(plan),
    cycleMonths,
    couponBonusMonths,
  };
}
