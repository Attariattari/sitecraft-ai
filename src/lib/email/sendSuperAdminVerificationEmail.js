import { transporter, EMAIL_FROM } from "./transporter";
import { getSuperAdminVerificationEmailHtml } from "./templates/superAdminVerificationTemplate";

export async function sendSuperAdminVerificationEmail({ to, otp, ipAddress, userAgent }) {
  const html = getSuperAdminVerificationEmailHtml({ otp, ipAddress, userAgent });

  if (!transporter) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Dev] Super Admin OTP email suppressed — no SMTP configured.");
      console.log(`[Dev] OTP for ${to}: ${otp}`);
    }
    return true;
  }

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject: "Verify your SiteCraft AI Super Admin access",
      html,
      text: `Your SiteCraft AI Super Admin verification code is: ${otp}. It expires in 10 minutes. Do not share it.`,
    });
    return true;
  } catch (error) {
    console.error("Failed to send Super Admin verification email:", error);
    return false;
  }
}
