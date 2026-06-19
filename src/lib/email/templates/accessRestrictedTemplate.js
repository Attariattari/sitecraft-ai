export function getAccessRestrictedEmailHtml({
    name,
    reason,
    requestReviewUrl,
}) {
    const year = new Date().getFullYear();
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SiteCraft AI - Access Restricted</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#020617;border:1px solid #1e293b;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:40px;text-align:center;">
              <div style="background-color:#ef4444;width:64px;height:64px;border-radius:100px;display:inline-block;margin-bottom:24px;">
                <span style="color:#ffffff;font-size:32px;line-height:64px;">!</span>
              </div>
              <h1 style="color:#ffffff;font-size:24px;margin:0 0 16px;">Access Restricted</h1>
              <p style="color:#94a3b8;font-size:16px;line-height:1.6;margin:0 0 24px;">
                Hi ${name},<br><br>
                Your SiteCraft AI account access has been restricted due to the following reason:
              </p>
              <div style="background-color:#1e293b;padding:20px;border-radius:12px;margin-bottom:32px;text-align:left;">
                <p style="color:#f1f5f9;font-size:15px;margin:0;"><strong>Reason:</strong> ${reason}</p>
                <p style="color:#64748b;font-size:13px;margin:10px 0 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 32px;">
                If you believe this was a mistake, you can request a review of your account status.
              </p>
              <a href="${requestReviewUrl}" style="background-color:#10b981;color:#ffffff;padding:16px 32px;border-radius:12px;text-decoration:none;font-weight:bold;display:inline-block;">Request Access Review</a>
            </td>
          </tr>
          <tr>
            <td style="padding:20px;text-align:center;border-top:1px solid #1e293b;background-color:#0a0f1d;">
              <p style="color:#475569;font-size:12px;margin:0;">&copy; ${year} SiteCraft AI. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}