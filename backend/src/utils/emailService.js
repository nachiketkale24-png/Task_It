const nodemailer = require('nodemailer');

/**
 * Sends an HTML notification email.
 * Gracefully skips (logs to console) if EMAIL_USER or EMAIL_PASS are not configured.
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[EmailService] Skipping email (no SMTP config). Would send to: ${to} | Subject: ${subject}`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Task It" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`[EmailService] Email sent to ${to}`);
  } catch (err) {
    console.error(`[EmailService] Failed to send email: ${err.message}`);
  }
};

module.exports = { sendEmail };
