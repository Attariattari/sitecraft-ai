import "server-only";
import Payment from "@/models/Payment";
import Subscription from "@/models/Subscription";
import { FIRST_PURCHASE_BONUS_MONTHS } from "@/lib/server/billing/billingConfig";

export async function getFirstPurchaseBonus({ userId, planSlug }) {
  const previousPaidPayments = await Payment.countDocuments({
    userId,
    status: "paid",
  });
  const previousPaidSubscriptions = await Subscription.countDocuments({
    userId,
    adminGranted: false,
    status: { $in: ["active", "cancelled", "expired", "past_due"] },
  });

  if (previousPaidPayments > 0 || previousPaidSubscriptions > 0) {
    return { applies: false, bonusMonths: 0 };
  }

  const bonusMonths = FIRST_PURCHASE_BONUS_MONTHS[planSlug] || 0;
  return { applies: bonusMonths > 0, bonusMonths };
}
