import "server-only";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import PlanGrant from "@/models/PlanGrant";
import { addMonths } from "@/lib/server/billing/pricing";
import { invalidateAdminStats, invalidateUserCache } from "@/lib/server/cache/cacheInvalidation";
import { createAuditLog } from "@/lib/server/audit/createAuditLog";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";

export async function giftPlan({ admin, userId, planSlug, months = 1, reason = "", request = null }) {
  const slug = String(planSlug || "").toLowerCase();
  if (!["basic", "pro"].includes(slug)) {
    return { ok: false, status: 400, message: "Only Basic or Pro can be gifted." };
  }

  await dbConnect();
  const user = await User.findById(userId);
  if (!user) return { ok: false, status: 404, message: "User not found." };

  const startDate = new Date();
  const expiresAt = addMonths(startDate, Math.max(1, Number(months || 1)));
  const subscription = await Subscription.findOneAndUpdate(
    { userId },
    {
      $set: {
        userId,
        planSlug: slug,
        status: "gifted",
        billingCycle: "manual",
        startDate,
        currentPeriodStart: startDate,
        currentPeriodEnd: expiresAt,
        expiresAt,
        cancelAtPeriodEnd: false,
        adminGranted: true,
        grantedBy: admin.id,
        grantReason: reason,
        grantSource: "admin_gift",
        bonusMonthsApplied: Math.max(0, Number(months || 1)),
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  const grant = await PlanGrant.create({
    userId,
    planSlug: slug,
    grantedBy: admin.id,
    reason,
    bonusMonths: Math.max(1, Number(months || 1)),
    startDate,
    expiresAt,
    status: "active",
    source: "admin_gift",
  });

  await User.findByIdAndUpdate(userId, {
    $set: {
      plan: slug,
      "subscription.status": "active",
      "subscription.planSlug": slug,
      "subscription.startedAt": startDate,
      "subscription.expiresAt": expiresAt,
      "subscription.currentPeriodStart": startDate,
      "subscription.currentPeriodEnd": expiresAt,
    },
  });

  await Promise.all([invalidateUserCache(userId), invalidateAdminStats()]);
  await createAuditLog({
    user: admin,
    action: "billing.subscription.gifted",
    targetType: "Subscription",
    targetId: subscription._id,
    metadata: { userId, planSlug: slug, months, reason },
    request,
  });
  await realtimeEmitter.emitToUser(userId, "billing:admin-grant-created", {
    title: "Plan access granted",
    message: `SiteCraft AI Admin granted ${slug} access until ${expiresAt.toDateString()}.`,
    metadata: { planSlug: slug, expiresAt },
  });

  return { ok: true, subscription, grant };
}

export async function extendSubscription({ admin, subscriptionId, months = 1, days = 0, reason = "", request = null }) {
  await dbConnect();
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) return { ok: false, status: 404, message: "Subscription not found." };

  const base = subscription.expiresAt && subscription.expiresAt > new Date() ? subscription.expiresAt : new Date();
  const extended = addMonths(base, Number(months || 0));
  extended.setDate(extended.getDate() + Number(days || 0));

  subscription.expiresAt = extended;
  subscription.currentPeriodEnd = extended;
  subscription.status = subscription.adminGranted ? "gifted" : "active";
  subscription.grantReason = reason || subscription.grantReason;
  subscription.bonusMonthsApplied += Math.max(0, Number(months || 0));
  await subscription.save();

  await User.findByIdAndUpdate(subscription.userId, {
    $set: {
      plan: subscription.planSlug,
      "subscription.status": "active",
      "subscription.planSlug": subscription.planSlug,
      "subscription.expiresAt": extended,
      "subscription.currentPeriodEnd": extended,
    },
  });

  await Promise.all([invalidateUserCache(subscription.userId), invalidateAdminStats()]);
  await createAuditLog({
    user: admin,
    action: "billing.subscription.extended",
    targetType: "Subscription",
    targetId: subscription._id,
    metadata: { months, days, reason },
    request,
  });
  return { ok: true, subscription };
}

export async function cancelSubscription({ admin, subscriptionId, reason = "", request = null }) {
  await dbConnect();
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) return { ok: false, status: 404, message: "Subscription not found." };

  subscription.status = "cancelled";
  subscription.cancelledAt = new Date();
  subscription.cancelledBy = admin.id;
  subscription.cancelReason = reason;
  subscription.cancelAtPeriodEnd = false;
  await subscription.save();

  await User.findByIdAndUpdate(subscription.userId, {
    $set: {
      plan: "free",
      "subscription.status": "cancelled",
      "subscription.planSlug": "free",
      "subscription.expiresAt": subscription.cancelledAt,
    },
  });

  await Promise.all([invalidateUserCache(subscription.userId), invalidateAdminStats()]);
  await createAuditLog({
    user: admin,
    action: "billing.subscription.cancelled",
    targetType: "Subscription",
    targetId: subscription._id,
    metadata: { reason },
    request,
  });
  return { ok: true, subscription };
}
