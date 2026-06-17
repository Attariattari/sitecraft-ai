import { transporter, EMAIL_FROM } from "./transporter";
import { getVerificationEmailHtml } from "./templates/verificationEmailTemplate";

export async function sendVerificationEmail(to, code) {
  if (!transporter) {
    console.log(`[Development Mode] Mock Email Sent`);
    console.log(`To: ${to}`);
    console.log(`Verification Code: ${code}`);
    return true; // Simulate success
  }

  try {
    const html = getVerificationEmailHtml(code);

    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject: "Verify your SiteCraft AI account",
      html,
    });
    return true;
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return false;
  }
}
