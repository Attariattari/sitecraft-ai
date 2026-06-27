export function getMembershipInviteEmailHtml({
  name = "there",
  planName,
  durationLabel,
  redeemUrl,
  expiresAt,
  adminMessage = "",
}) {
  return `
    <div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:620px;margin:0 auto;padding:32px 18px;">
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;">
          <div style="padding:28px;background:linear-gradient(135deg,#10b981,#f97316);color:#ffffff;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;">SiteCraft AI Membership Gift</p>
            <h1 style="margin:0;font-size:28px;line-height:1.2;">You've received free ${planName} access</h1>
          </div>
          <div style="padding:28px;">
            <p style="margin:0 0 14px;font-size:16px;line-height:1.6;">Hi ${name},</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#475569;">
              You have been selected to receive free SiteCraft AI ${planName} membership access for ${durationLabel}.
              This invite is linked to your email address and can only be used once.
            </p>
            ${adminMessage ? `<p style="margin:0 0 18px;padding:14px;border-radius:12px;background:#f1f5f9;font-size:14px;line-height:1.6;color:#334155;">${adminMessage}</p>` : ""}
            <a href="${redeemUrl}" style="display:inline-block;margin:8px 0 20px;padding:13px 20px;border-radius:12px;background:#10b981;color:#ffffff;text-decoration:none;font-weight:800;">
              Redeem Membership
            </a>
            <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:#64748b;">
              This secure link expires on ${expiresAt}. If you did not expect this invite, you can ignore this email.
            </p>
            <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">
              Need help? Contact SiteCraft AI support through the website contact page.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}
