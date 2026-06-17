import { transporter, EMAIL_FROM } from "./transporter";
import { getResetPasswordEmailHtml } from "./templates/resetPasswordEmailTemplate";

export async function sendPasswordResetEmail(to, resetToken) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

  if (!transporter) {
    console.log(`[Development Mode] Mock Password Reset Email Sent`);
    console.log(`To: ${to}`);
    console.log(`Reset Link: ${resetLink}`);
    return true; // Simulate success
  }

  try {
    const html = getResetPasswordEmailHtml(resetLink);

    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject: "Reset your SiteCraft AI password",
      html,
    });
    return true;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return false;
  }
}
