export function getVerificationEmailHtml(code) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your SiteCraft AI account</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; color: #111827; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: #f0fdf4; padding: 30px; text-align: center; border-bottom: 1px solid #dcfce7; }
        .header h1 { margin: 0; color: #10b981; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 40px; text-align: center; }
        .title { font-size: 20px; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 15px; }
        .text { font-size: 15px; color: #4b5563; line-height: 1.6; margin-bottom: 25px; }
        .code-container { background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 30px 0; letter-spacing: 5px; font-size: 32px; font-weight: 800; color: #10b981; text-align: center; }
        .expiry { color: #f97316; font-size: 13px; font-weight: 600; margin-top: -10px; margin-bottom: 30px; }
        .security-note { font-size: 12px; color: #9ca3af; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f3f4f6; }
        .footer { background: #111827; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SiteCraft AI</h1>
        </div>
        <div class="content">
          <h2 class="title">Verify your email address</h2>
          <p class="text">Use the verification code below to complete your SiteCraft AI signup. This ensures we have the right email for your account.</p>
          
          <div class="code-container">${code}</div>
          
          <p class="expiry">This code will expire in 10 minutes.</p>
          <p class="security-note">If you did not request this verification code, you can safely ignore this email. Someone may have entered your email by mistake.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SiteCraft AI. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}
