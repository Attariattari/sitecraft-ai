import "server-only";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import PlanGrant from "@/models/PlanGrant";
import MembershipInvite from "@/models/MembershipInvite";
import { createInviteToken } from "@/lib/server/membership/createInviteToken";
import { hashInviteToken } from "@/lib/server/membership/hashInviteToken";
import { addMonths } from "@/lib/server/billing/pricing";
import { createAuditLog } from "@/lib/server/audit/createAuditLog";
import { invalidateAdminStats, invalidateUserCache } from "@/lib/server/cache/cacheInvalidation";
import { getPublicBaseUrl } from "@/lib/server/env";
import { sendMembershipInviteEmail } from "@/lib/server/email/sendMembershipInviteEmail";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";

export function getDurationLabel(invite) {
  if (invite.durationMonths) return `${invite.durationMonths} month${invite.durationMonths === 1 ? "" : "s"}`;
  return `${invite.durationDays} day${invite.durationDays === 1 ? "" : "s"}`;
}

export function sanitizeInvite(invite) {
  if (!invite) return null;
  return {
    id: invite._id?.toString?.() || invite.id,
    targetEmail: invite.targetEmail,
    targetUserId: invite.targetUserId?.toString?.() || invite.targetUserId || "",
    planSlug: invite.planSlug,
    durationDays: invite.durationDays,
    durationMonths: invite.durationMonths,
    durationLabel: getDurationLabel(invite),
    status: invite.status,
    tokenExpiresAt: invite.tokenExpiresAt,
    redeemedAt: invite.redeemedAt,
    revokedAt: invite.revokedAt,
    adminMessage: invite.adminMessage,
    emailSubject: invite.emailSubject,
    emailSentAt: invite.emailSentAt,
    emailStatus: invite.emailStatus,
    usageLimit: invite.usageLimit,
    usedCount: invite.usedCount,
    source: invite.source,
    createdAt: invite.createdAt,
    updatedAt: invite.updatedAt,
    createdBy: invite.createdBy,
  };
}

export function buildRedeemUrl(token) {
  return `${getPublicBaseUrl()}/membership/redeem/${encodeURIComponent(token)}`;
}

function resolveExpiresAt(value) {
  const parsed = value ? new Date(value) : null;
  if (parsed && !Number.isNaN(parsed.valueOf()) && parsed > new Date()) return parsed;
  const fallback = new Date();
  fallback.setDate(fallback.getDate() + 7);
  return fallback;
}

export async function createMembershipInvite({ admin, payload, request = null }) {
  const planSlug = String(payload.planSlug || "").toLowerCase();
  if (!["basic", "pro"].includes(planSlug)) {
    return { ok: false, status: 400, message: "Only Basic or Pro invites are allowed." };
  }

  const targetEmail = String(payload.targetEmail || "").trim().toLowerCase();
  if (!targetEmail || !targetEmail.includes("@")) {
    return { ok: false, status: 400, message: "A valid target email is required." };
  }

  const durationType = payload.durationType === "days" ? "days" : "months";
  const durationValue = Math.max(1, Number(payload.durationValue || 1));
  const { token, tokenHash } = createInviteToken();

  await dbConnect();
  const targetUser = payload.targetUserId
    ? await User.findById(payload.targetUserId).select("_id email name").lean()
    : await User.findOne({ email: targetEmail }).select("_id email name").lean();

  if (targetUser && targetUser.email.toLowerCase() !== targetEmail) {
    return { ok: false, status: 400, message: "Target user email does not match invite email." };
  }

  const invite = await MembershipInvite.create({
    targetUserId: targetUser?._id,
    targetEmail,
    planSlug,
    durationMonths: durationType === "months" ? durationValue : 0,
    durationDays: durationType === "days" ? durationValue : 0,
    status: payload.sendEmailNow ? "sent" : "draft",
    tokenHash,
    tokenExpiresAt: resolveExpiresAt(payload.tokenExpiresAt),
    createdBy: admin.id,
    adminMessage: String(payload.adminMessage || "").trim(),
    emailSubject: String(payload.emailSubject || "You've received free SiteCraft AI membership access").trim(),
    usageLimit: 1,
    source: ["admin_gift", "promotion", "manual_bonus", "support_compensation"].includes(payload.source)
      ? payload.source
      : "admin_gift",
    metadata: { targetName: targetUser?.name || "" },
  });

  let emailResult = { ok: false, message: "Email not requested." };
  if (payload.sendEmailNow) {
    emailResult = await sendInviteEmail({ invite, token, admin, request });
  }

  await createAuditLog({
    user: admin,
    action: "membership_invite.created",
    targetType: "MembershipInvite",
    targetId: invite._id,
    metadata: { targetEmail, planSlug, durationType, durationValue, emailStatus: invite.emailStatus },
    request,
  });
  await invalidateAdminStats();
  await realtimeEmitter.emitToSuperAdmins("membership-invite:created", {
    title: "Membership invite created",
    message: `${planSlug} invite created for ${targetEmail}.`,
  });

  return { ok: true, invite: sanitizeInvite(invite), token, redeemUrl: buildRedeemUrl(token), emailResult };
}

export async function sendInviteEmail({ invite, token, admin, request = null, resend = false }) {
  const freshInvite = invite.toObject ? invite : await MembershipInvite.findById(invite._id || invite.id);
  if (!freshInvite || ["redeemed", "revoked", "expired"].includes(freshInvite.status)) {
    return { ok: false, message: "Invite cannot be sent." };
  }

  const result = await sendMembershipInviteEmail({
    invite: freshInvite,
    redeemUrl: buildRedeemUrl(token),
    targetName: freshInvite.metadata?.targetName || "",
  });

  freshInvite.emailStatus = result.ok ? "sent" : "failed";
  freshInvite.status = result.ok ? "sent" : "failed";
  freshInvite.emailSentAt = result.ok ? new Date() : freshInvite.emailSentAt;
  await freshInvite.save();

  await createAuditLog({
    user: admin,
    action: resend ? "membership_invite.resent" : "membership_invite.sent",
    targetType: "MembershipInvite",
    targetId: freshInvite._id,
    metadata: { targetEmail: freshInvite.targetEmail, ok: result.ok },
    request,
  });

  return result;
}

export async function regenerateAndSendInvite({ inviteId, admin, request = null }) {
  await dbConnect();
  const invite = await MembershipInvite.findById(inviteId);
  if (!invite) return { ok: false, status: 404, message: "Invite not found." };
  if (["redeemed", "revoked", "expired"].includes(invite.status)) {
    return { ok: false, status: 400, message: "Invite cannot be resent." };
  }

  const { token, tokenHash } = createInviteToken();
  invite.tokenHash = tokenHash;
  invite.usedCount = 0;
  await invite.save();

  const result = await sendInviteEmail({ invite, token, admin, request, resend: true });
  return {
    ...result,
    invite: sanitizeInvite(invite),
    redeemUrl: buildRedeemUrl(token),
  };
}

export async function validateInviteToken(token) {
  const tokenHash = hashInviteToken(token);
  await dbConnect();
  const invite = await MembershipInvite.findOne({ tokenHash }).lean();
  if (!invite) return { ok: false, status: 404, message: "Membership invite was not found." };

  const now = new Date();
  if (invite.status === "revoked") return { ok: false, status: 410, message: "This membership invite was revoked." };
  if (invite.status === "redeemed" || invite.usedCount >= invite.usageLimit) {
    return { ok: false, status: 410, message: "This membership invite has already been used." };
  }
  if (invite.tokenExpiresAt && new Date(invite.tokenExpiresAt) < now) {
    await MembershipInvite.findByIdAndUpdate(invite._id, { $set: { status: "expired" } });
    return { ok: false, status: 410, message: "This membership invite has expired." };
  }
  if (invite.status === "failed") return { ok: false, status: 400, message: "This membership invite is not available." };

  return { ok: true, invite: sanitizeInvite(invite) };
}

export async function redeemInviteToken({ token, user, request = null }) {
  const validation = await validateInviteToken(token);
  if (!validation.ok) return validation;

  await dbConnect();
  const invite = await MembershipInvite.findById(validation.invite.id);
  if (!invite) return { ok: false, status: 404, message: "Membership invite was not found." };

  if (String(user.email || "").toLowerCase() !== invite.targetEmail) {
    await createAuditLog({
      user,
      action: "membership_invite.redeem_email_mismatch",
      targetType: "MembershipInvite",
      targetId: invite._id,
      metadata: { targetEmail: invite.targetEmail },
      request,
    });
    return { ok: false, status: 403, message: "This membership invite is linked to a different email address." };
  }

  if (invite.redeemedBy?.toString() === user.id && invite.status === "redeemed") {
    return { ok: true, invite: sanitizeInvite(invite), alreadyRedeemed: true };
  }

  const now = new Date();
  const expiresAt = invite.durationMonths
    ? addMonths(now, invite.durationMonths)
    : new Date(now.getTime() + invite.durationDays * 24 * 60 * 60 * 1000);

  const subscription = await Subscription.findOneAndUpdate(
    { userId: user.id },
    {
      $set: {
        userId: user.id,
        planSlug: invite.planSlug,
        status: "gifted",
        billingCycle: "manual",
        startDate: now,
        currentPeriodStart: now,
        currentPeriodEnd: expiresAt,
        expiresAt,
        cancelAtPeriodEnd: false,
        paymentProvider: "admin_gift",
        bonusMonthsApplied: invite.durationMonths || 0,
        firstPurchaseBonusApplied: false,
        adminGranted: true,
        grantedBy: invite.createdBy,
        grantReason: invite.adminMessage || invite.source,
        grantSource: "membership_invite",
        inviteId: invite._id,
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  const grant = await PlanGrant.create({
    userId: user.id,
    planSlug: invite.planSlug,
    grantedBy: invite.createdBy,
    reason: invite.adminMessage || invite.source,
    bonusMonths: invite.durationMonths || 0,
    durationDays: invite.durationDays || 0,
    startDate: now,
    expiresAt,
    status: "active",
    source: "membership_invite",
    inviteId: invite._id,
  });

  await User.findByIdAndUpdate(user.id, {
    $set: {
      plan: invite.planSlug,
      "subscription.status": "active",
      "subscription.planSlug": invite.planSlug,
      "subscription.startedAt": now,
      "subscription.expiresAt": expiresAt,
      "subscription.currentPeriodStart": now,
      "subscription.currentPeriodEnd": expiresAt,
    },
  });

  invite.status = "redeemed";
  invite.redeemedAt = now;
  invite.redeemedBy = user.id;
  invite.usedCount += 1;
  await invite.save();

  await Promise.all([invalidateUserCache(user.id), invalidateAdminStats()]);
  await createAuditLog({
    user,
    action: "membership_invite.redeemed",
    targetType: "MembershipInvite",
    targetId: invite._id,
    metadata: { planSlug: invite.planSlug, expiresAt },
    request,
  });
  await createAuditLog({
    user,
    action: "billing.membership_invite.activated",
    targetType: "Subscription",
    targetId: subscription._id,
    metadata: { inviteId: invite._id.toString(), grantId: grant._id.toString() },
    request,
  });
  await realtimeEmitter.emitToUser(user.id, "billing:subscription-updated", {
    title: "Membership gift redeemed",
    message: `Your ${invite.planSlug} membership gift is active.`,
    metadata: { planSlug: invite.planSlug, expiresAt },
  });

  return { ok: true, invite: sanitizeInvite(invite), subscription, grant };
}

export async function revokeInvite({ inviteId, admin, reason = "", request = null }) {
  await dbConnect();
  const invite = await MembershipInvite.findById(inviteId);
  if (!invite) return { ok: false, status: 404, message: "Invite not found." };
  if (invite.status === "redeemed") return { ok: false, status: 400, message: "Redeemed invites cannot be revoked." };

  invite.status = "revoked";
  invite.revokedAt = new Date();
  invite.revokedBy = admin.id;
  invite.revocationReason = reason;
  await invite.save();

  await invalidateAdminStats();
  await createAuditLog({
    user: admin,
    action: "membership_invite.revoked",
    targetType: "MembershipInvite",
    targetId: invite._id,
    metadata: { reason },
    request,
  });
  await realtimeEmitter.emitToSuperAdmins("membership-invite:revoked", {
    title: "Membership invite revoked",
    message: `${invite.planSlug} invite for ${invite.targetEmail} was revoked.`,
  });
  return { ok: true, invite: sanitizeInvite(invite) };
}
