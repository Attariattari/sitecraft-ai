import "server-only";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import Subscription from "@/models/Subscription";
import Coupon from "@/models/Coupon";
import CouponRedemption from "@/models/CouponRedemption";
import Invoice from "@/models/Invoice";
import User from "@/models/User";
import { addMonths } from "@/lib/server/billing/pricing";
import { getFirstPurchaseBonus } from "@/lib/server/billing/applyFirstPurchaseBonus";
import { createInvoiceNumber } from "@/lib/server/billing/invoiceNumber";
import { invalidateAdminStats, invalidateUserCache } from "@/lib/server/cache/cacheInvalidation";
import { createAuditLog } from "@/lib/server/audit/createAuditLog";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";

export async function activatePaidSubscription({ paymentId, verifier = null, request = null }) {
  await dbConnect();
  const payment = await Payment.findById(paymentId);
  if (!payment) return { ok: false, status: 404, message: "Payment not found." };
  if (payment.status === "paid" && payment.subscriptionId) {
    return { ok: true, payment, alreadyProcessed: true };
  }
  if (!["pending", "processing"].includes(payment.status)) {
    return { ok: false, status: 400, message: "Payment is not payable." };
  }

  const now = new Date();
  const cycleMonths = Number(payment.metadata?.cycleMonths || (payment.billingCycle === "yearly" ? 12 : 1));
  const couponBonusMonths = Number(payment.metadata?.couponBonusMonths || 0);
  const firstBonus = await getFirstPurchaseBonus({
    userId: payment.userId,
    planSlug: payment.planSlug,
  });
  const bonusMonths = couponBonusMonths + firstBonus.bonusMonths;
  const expiresAt = addMonths(now, cycleMonths + bonusMonths);

  const subscription = await Subscription.findOneAndUpdate(
    { userId: payment.userId },
    {
      $set: {
        planSlug: payment.planSlug,
        status: "active",
        billingCycle: payment.billingCycle,
        startDate: now,
        currentPeriodStart: now,
        currentPeriodEnd: expiresAt,
        expiresAt,
        cancelAtPeriodEnd: false,
        paymentProvider: payment.paymentProvider,
        lastPaymentId: payment._id,
        bonusMonthsApplied: bonusMonths,
        firstPurchaseBonusApplied: firstBonus.applies,
        adminGranted: false,
        grantSource: "paid",
        inviteId: null,
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  payment.status = "paid";
  payment.subscriptionId = subscription._id;
  payment.verifiedAt = now;
  await payment.save();

  if (payment.couponCode) {
    const coupon = await Coupon.findOne({ code: payment.couponCode });
    if (coupon) {
      await CouponRedemption.create({
        couponId: coupon._id,
        couponCode: coupon.code,
        userId: payment.userId,
        paymentId: payment._id,
        subscriptionId: subscription._id,
        discountAmount: payment.discountAmount,
        bonusMonths: couponBonusMonths,
      });
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  await Invoice.create({
    userId: payment.userId,
    paymentId: payment._id,
    subscriptionId: subscription._id,
    invoiceNumber: createInvoiceNumber(),
    amount: payment.amount,
    discountAmount: payment.discountAmount,
    finalAmount: payment.finalAmount,
    currency: payment.currency,
    status: "paid",
    paidAt: now,
  });

  await User.findByIdAndUpdate(payment.userId, {
    $set: {
      plan: payment.planSlug,
      "subscription.status": "active",
      "subscription.planSlug": payment.planSlug,
      "subscription.provider": payment.paymentProvider,
      "subscription.startedAt": now,
      "subscription.expiresAt": expiresAt,
      "subscription.currentPeriodStart": now,
      "subscription.currentPeriodEnd": expiresAt,
      "subscription.renewedAt": now,
    },
  });

  await Promise.all([invalidateUserCache(payment.userId), invalidateAdminStats()]);
  await createAuditLog({
    user: verifier,
    action: "billing.payment.verified",
    targetType: "Payment",
    targetId: payment._id,
    metadata: { planSlug: payment.planSlug, finalAmount: payment.finalAmount },
    request,
  });
  await realtimeEmitter.emitToUser(payment.userId, "billing:subscription-updated", {
    title: "Subscription activated",
    message: `Your ${payment.planSlug} plan is now active.`,
    metadata: { planSlug: payment.planSlug },
  });

  return { ok: true, payment, subscription };
}
