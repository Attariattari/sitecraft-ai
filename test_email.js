import nodemailer from "nodemailer";

const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 587;
const SMTP_USER = "pirghulammuhyodin@gmail.com";
const SMTP_PASS = "diak pted ybbu pgqg";

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // 587 uses STARTTLS
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: SMTP_USER,
      to: "attariattari549@gmail.com",
      subject: "Test Email from SiteCraft AI",
      text: "This is a test email.",
    });
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
  process.exit(0);
}

testEmail();
