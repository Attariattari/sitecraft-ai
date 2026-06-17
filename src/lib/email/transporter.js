import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM =
  process.env.EMAIL_FROM || "SiteCraft AI <no-reply@sitecraft.ai>";

let transporter = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
} else {
  console.warn(
    "⚠️ SMTP credentials are missing. Emails will be logged to the console in development mode, but they will fail in production.",
  );
}

export { transporter, EMAIL_FROM };
