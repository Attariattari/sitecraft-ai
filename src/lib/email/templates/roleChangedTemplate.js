export function getRoleChangedEmailHtml({ name, oldRole, newRole }) {
    const year = new Date().getFullYear();
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SiteCraft AI - Role Updated</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#020617;border:1px solid #1e293b;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:40px;text-align:center;">
              <div style="background-color:#3b82f6;width:64px;height:64px;border-radius:100px;display:inline-block;margin-bottom:24px;">
                <span style="color:#ffffff;font-size:32px;line-height:64px;">⚡</span>
              </div>
              <h1 style="color:#ffffff;font-size:24px;margin:0 0 16px;">Role Updated</h1>
              <p style="color:#94a3b8;font-size:16px;line-height:1.6;margin:0 0 24px;">
                Hi ${name},<br><br>
                Your account role has been updated on SiteCraft AI.
              </p>
              <div style="background-color:#1e293b;padding:20px;border-radius:12px;margin-bottom:32px;text-align:left;display:inline-block;width:100%;box-sizing:border-box;">
                <table width="100%">
                  <tr>
                    <td width="50%">
                      <p style="color:#64748b;font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">Previous Role</p>
                      <p style="color:#ef4444;font-size:16px;font-weight:bold;margin:0;">${oldRole}</p>
                    </td>
                    <td width="50%">
                      <p style="color:#64748b;font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">New Role</p>
                      <p style="color:#10b981;font-size:16px;font-weight:bold;margin:0;">${newRole}</p>
                    </td>
                  </tr>
                </table>
              </div>
              <p style="color:#64748b;font-size:14px;margin:0;">
                If you did not expect this change, please contact support immediately.
              </p>
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
