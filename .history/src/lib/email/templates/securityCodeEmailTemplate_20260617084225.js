export function getSecurityCodeEmailHtml(
  code,
  actionName = "change your password",
) {
  return `
    <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #F7FAF8; border-radius: 24px; border: 1px solid #DDEBE4;">
      <h2 style="color: #0F172A; text-align: center; font-size: 32px; font-weight: 800; margin-bottom: 24px; letter-spacing: -0.02em;">Identity Verification</h2>
      <p style="color: #64748B; font-size: 18px; text-align: center; line-height: 1.6; margin-bottom: 32px;">
        You've requested to <strong>${actionName}</strong>. 
        Please use the 6-digit verification code below to confirm it's really you.
      </p>
      
      <div style="background-color: #FFFFFF; border: 2px solid #10B981; border-radius: 20px; padding: 24px; text-align: center; margin-bottom: 32px; box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1);">
        <span style="font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #10B981;">${code}</span>
      </div>
      
      <p style="color: #94A3B8; font-size: 14px; text-align: center; line-height: 1.6;">
        This code is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email and ensure your account is secure.
      </p>
      
      <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #DDEBE4; text-align: center;">
        <p style="color: #0F172A; font-size: 16px; font-weight: 700; margin-bottom: 4px;">SiteCraft AI Security Team</p>
        <p style="color: #64748B; font-size: 12px; font-weight: 600; text-transform: uppercase; tracking-widest;">Building the future with AI</p>
      </div>
    </div>
  `;
}
