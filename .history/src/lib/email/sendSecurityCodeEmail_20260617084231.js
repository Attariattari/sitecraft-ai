import { transporter, EMAIL_FROM } from "./transporter";
import { getSecurityCodeEmailHtml } from "./templates/securityCodeEmailTemplate";

export async function sendSecurityCodeEmail(
  to,
  code,
  action = "change your password",
) {
  if (!transporter) {
    console.log(`[Development Mode] Security Code Mock Email Sent`);
    console.log(`To: ${to}`);
    console.log(`Action: ${action}`);
    console.log(`Code: ${code}`);
    return true;
  }

  try {
    const html = getSecurityCodeEmailHtml(code, action);

    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject: `Security Verification - ${code}`,
      html,
      text: `Your SiteCraft AI security verification code is: ${code}. Use this to ${action}. This code will expire in 10 minutes.`,
    });
    return true;
  } catch (error) {
    console.error("Failed to send security code email:", error);
    return false;
  }
}
