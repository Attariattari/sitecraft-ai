import { EMAIL_FROM, transporter } from "@/lib/email/transporter";

const adminEmail = process.env.CONTACT_NOTIFY_EMAIL || process.env.ROOT_SUPER_ADMIN_EMAIL || process.env.SMTP_USER;

export function isContactEmailConfigured() {
  return Boolean(transporter && adminEmail);
}

export async function sendContactNotificationEmail(message) {
  if (!isContactEmailConfigured()) {
    return { sent: false, message: "Email notification is not configured." };
  }

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: adminEmail,
    subject: `New SiteCraft AI contact: ${message.subject}`,
    text: [
      "New contact message received.",
      "",
      `Name: ${message.name}`,
      `Email: ${message.email}`,
      `Phone: ${message.phone || "Not provided"}`,
      `Inquiry type: ${message.inquiryType}`,
      `Subject: ${message.subject}`,
      "",
      message.message,
      "",
      "Open /admin/messages to manage this message.",
    ].join("\n"),
  });

  return { sent: true };
}

export async function sendContactReplyEmail({ to, subject, replyMessage }) {
  if (!transporter) {
    return { sent: false, message: "Email sending is not configured yet." };
  }

  await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject: `Re: ${subject}`,
    text: replyMessage,
  });

  return { sent: true };
}
