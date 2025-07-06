import nodemailer from "nodemailer";
import { rateLimiter } from "./middleware/rateLimiter";

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5
});

async function verifyRecaptcha(token) {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await limiter(req);

    const { to, message, recaptchaToken } = req.body;

    // ✅ Validate fields
    if (!recaptchaToken) {
      return res.status(400).json({ success: false, message: 'reCAPTCHA token is required' });
    }

    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
    }

    if (!to) {
      return res.status(400).json({ success: false, message: "'to' field (recipient email) is required" });
    }
    if (!message) {
      return res.status(400).json({ success: false, message: "'message' field is required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NEXT_PUBLIC_GMAIL_USERNAME,
        pass: process.env.NEXT_PUBLIC_GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NEXT_PUBLIC_GMAIL_USERNAME,
      to,
      subject: "Taylor Movers Quote Request",
      text: message,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Nodemailer sendMail error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send email via Nodemailer",
        error: error?.message || error || "Unknown error during email send"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (error) {
    console.error("Error in sendEmail handler:", error);
    if (error?.message === 'Too many requests') {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error?.message || error || "Unknown error"
    });
  }
}
// This API route handles sending emails using Nodemailer with rate limiting and reCAPTCHA verification.
// It ensures that the request is a POST method, applies rate limiting, verifies reCAPTCHA,
// validates the required fields, and sends the email using Gmail's SMTP service.