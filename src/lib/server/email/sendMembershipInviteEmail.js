import "server-only";
import { EMAIL_FROM, transporter } from "@/lib/email/transporter";
import { getMembershipInviteEmailHtml } from "@/lib/email/templates/membershipInviteTemplate";

export async function sendMembershipInviteEmail({ invite, redeemUrl, targetName = "" }) {
  if (!transporter) {
    return {
      ok: false,
      message: "Invite created, but email sending is not configured.",
    };
  }

  const planName = invite.planSlug === "pro" ? "Pro" : "Basic";
  const durationLabel = invite.durationMonths
    ? `${invite.durationMonths} month${invite.durationMonths === 1 ? "" : "s"}`
    : `${invite.durationDays} day${invite.durationDays === 1 ? "" : "s"}`;

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: invite.targetEmail,
    subject: invite.emailSubject || "You've received free SiteCraft AI membership access",
    html: getMembershipInviteEmailHtml({
      name: targetName || invite.targetEmail,
      planName,
      durationLabel,
      redeemUrl,
      expiresAt: new Date(invite.tokenExpiresAt).toLocaleDateString(),
      adminMessage: invite.adminMessage,
    }),
  });

  return { ok: true, message: "Invite email sent." };
}
