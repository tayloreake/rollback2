import nodemailer from "nodemailer";
import { rateLimiter } from "./middleware/rateLimiter";
import { getClientIp, getDetailedIpInfo, getGeolocation } from "../../utils/getClientIp";
import { createQuote } from "../../sanity/sanity-utils";

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
    return {
      success: data.success,
      score: data.score || null, // v3 includes score
      action: data.action || null,
    };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, score: null };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Capture IP and metadata FIRST (before any processing)
  const ipAddress = getClientIp(req);
  const ipDetails = getDetailedIpInfo(req);
  const geolocation = getGeolocation(req);

  try {
    await limiter(req);

    const { to, message, recaptchaToken, quoteData } = req.body;

    // ✅ Validate fields
    if (!recaptchaToken) {
      return res.status(400).json({ success: false, message: 'reCAPTCHA token is required' });
    }

    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success) {
      return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
    }

    // Check reCAPTCHA score (if v3 is used)
    // Scores: 1.0 = very likely human, 0.0 = very likely bot
    // You can adjust this threshold based on your needs
    if (recaptchaResult.score !== null && recaptchaResult.score < 0.5) {
      console.warn(`Low reCAPTCHA score detected: ${recaptchaResult.score} from IP: ${ipAddress}`);
      // Optionally reject low scores:
      // return res.status(400).json({ success: false, message: 'Suspicious activity detected' });
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

    let emailSent = false;
    try {
      await transporter.sendMail(mailOptions);
      emailSent = true;
    } catch (error) {
      console.error("Nodemailer sendMail error:", error);
      // Don't return here - we still want to log to Sanity
    }

    // Log quote submission to Sanity (even if email failed)
    if (quoteData) {
      try {
        await createQuote(
          quoteData.firstName,
          quoteData.email,
          quoteData.phoneNumber,
          quoteData.location,
          quoteData.destination,
          quoteData.moveType,
          quoteData.bedrooms,
          quoteData.moveDate,
          quoteData.referrals,
          ipAddress,
          ipDetails,
          geolocation,
          recaptchaResult.score,
          emailSent,
          false // SMS sent status (updated in sendSms endpoint)
        );
        console.log(`Quote logged to Sanity from IP: ${ipAddress}`);
      } catch (sanityError) {
        console.error("Failed to log quote to Sanity:", sanityError);
        // Don't fail the request if Sanity logging fails
      }
    }

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send email via Nodemailer",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      ipAddress: ipAddress, // Return IP to client for debugging (optional)
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