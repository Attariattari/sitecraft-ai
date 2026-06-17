export function getResetPasswordEmailHtml(resetLink) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset your SiteCraft AI password</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; color: #111827; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: #f0fdf4; padding: 30px; text-align: center; border-bottom: 1px solid #dcfce7; }
        .header h1 { margin: 0; color: #10b981; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 40px; text-align: center; }
        .title { font-size: 20px; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 15px; }
        .text { font-size: 15px; color: #4b5563; line-height: 1.6; margin-bottom: 30px; }
        .btn-container { margin: 35px 0; }
        .btn { display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background 0.2s; }
        .expiry { color: #f97316; font-size: 13px; font-weight: 600; margin-top: 15px; margin-bottom: 30px; }
        .security-note { font-size: 12px; color: #9ca3af; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f3f4f6; text-align: left; }
        .footer { background: #111827; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SiteCraft AI</h1>
        </div>
        <div class="content">
          <h2 class="title">Reset your password</h2>
          <p class="text">We received a request to reset the password for your SiteCraft AI account. Click the button below to reset your password.</p>
          
          <div class="btn-container">
            <a href="${resetLink}" class="btn">Reset Password</a>
          </div>
          
          <p class="expiry">This link will expire in 15 minutes.</p>
          
          <p class="security-note">If you did not make this request, you can safely ignore this email. Your password will remain unchanged.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SiteCraft AI. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}
