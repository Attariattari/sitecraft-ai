export function getSuperAdminVerificationEmailHtml({ otp, ipAddress, userAgent }) {
  const year = new Date().getFullYear();
  const ipLine = ipAddress ? `<p style="margin:4px 0;font-size:13px;color:#6b7280;">IP Address: <strong>${ipAddress}</strong></p>` : "";
  const uaLine = userAgent ? `<p style="margin:4px 0;font-size:13px;color:#6b7280;">Device: <strong>${userAgent.slice(0, 80)}</strong></p>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>SiteCraft AI Super Admin Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#064e3b 0%,#065f46 100%);padding:32px;text-align:center;border-bottom:1px solid #10b981;">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:#10b981;border-radius:10px;width:40px;height:40px;text-align:center;vertical-align:middle;">
                    <span style="color:#fff;font-weight:900;font-size:18px;line-height:40px;">S</span>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">SiteCraft AI</span>
                  </td>
                </tr>
              </table>
              <p style="margin:12px 0 0;color:#a7f3d0;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Super Admin Access Verification</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;text-align:center;">
              <h1 style="margin:0 0 12px;color:#f1f5f9;font-size:22px;font-weight:700;">Verify Your Identity</h1>
              <p style="margin:0 0 32px;color:#94a3b8;font-size:15px;line-height:1.6;">
                A Super Admin login attempt was detected. Use the code below to complete verification.
                This code is valid for <strong style="color:#f97316;">10 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="background:#0f172a;border:2px solid #10b981;border-radius:12px;padding:28px 20px;margin:0 auto 32px;display:inline-block;width:100%;box-sizing:border-box;">
                <p style="margin:0 0 8px;color:#94a3b8;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Your Verification Code</p>
                <p style="margin:0;color:#10b981;font-size:48px;font-weight:900;letter-spacing:12px;font-variant-numeric:tabular-nums;">${otp}</p>
              </div>

              <!-- Warning -->
              <div style="background:#431407;border:1px solid #f97316;border-radius:10px;padding:16px 20px;margin-bottom:28px;text-align:left;">
                <p style="margin:0 0 4px;color:#fb923c;font-size:13px;font-weight:700;">&#9888; Security Warning</p>
                <p style="margin:0;color:#fdba74;font-size:13px;line-height:1.5;">
                  If you did not attempt to log in as Super Admin, your account may be at risk.
                  Do <strong>not</strong> share this code with anyone.
                </p>
              </div>

              <!-- Device Info -->
              ${ipLine || uaLine ? `
              <div style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:14px 18px;text-align:left;margin-bottom:16px;">
                <p style="margin:0 0 6px;color:#64748b;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Request Details</p>
                ${ipLine}
                ${uaLine}
              </div>` : ""}

              <p style="margin:0;color:#475569;font-size:12px;">
                This code expires in 10 minutes and can only be used once.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;padding:20px 32px;text-align:center;border-top:1px solid #1e293b;">
              <p style="margin:0;color:#475569;font-size:12px;">&copy; ${year} SiteCraft AI. All rights reserved.</p>
              <p style="margin:6px 0 0;color:#334155;font-size:11px;">This is an automated security email. Do not reply.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
