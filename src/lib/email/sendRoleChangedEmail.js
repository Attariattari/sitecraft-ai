import { transporter, EMAIL_FROM } from "./transporter";

import { getRoleChangedEmailHtml } from "./templates/roleChangedTemplate";

export async function sendRoleChangedEmail({ to, name, oldRole, newRole }) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: "Your SiteCraft AI role has been updated",
        html: getRoleChangedEmailHtml({ name, oldRole, newRole }),
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Error sending role changed email:", error);
        return { success: false, error };
    }
}
