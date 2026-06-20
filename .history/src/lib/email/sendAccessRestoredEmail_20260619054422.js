import { transporter } from "../transporter";
import { getAccessRestoredEmailHtml } from "./templates/accessRestoredTemplate";

export async function sendAccessRestoredEmail({ to, name, loginUrl }) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: "Your SiteCraft AI access has been restored",
        html: getAccessRestoredEmailHtml({ name, loginUrl }),
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Error sending access restored email:", error);
        return { success: false, error };
    }
}