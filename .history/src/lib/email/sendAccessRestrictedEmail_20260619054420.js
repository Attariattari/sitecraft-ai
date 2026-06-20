import { transporter } from "../transporter";
import { getAccessRestrictedEmailHtml } from "./templates/accessRestrictedTemplate";

export async function sendAccessRestrictedEmail({
    to,
    name,
    reason,
    requestReviewUrl,
}) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: "Your SiteCraft AI access has been restricted",
        html: getAccessRestrictedEmailHtml({ name, reason, requestReviewUrl }),
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Error sending access restricted email:", error);
        return { success: false, error };
    }
}