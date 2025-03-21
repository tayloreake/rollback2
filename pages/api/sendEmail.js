import nodemailer from "nodemailer"
import { rateLimiter } from "./middleware/rateLimiter"

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});

async function verifyRecaptcha(token) {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
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
    // Apply rate limiting
    await limiter(req);

    const { to, message, recaptchaToken } = req.body;

    if (!recaptchaToken) {
      return res.status(400).json({ success: false, message: 'reCAPTCHA token is required' });
    }

    // Verify reCAPTCHA
    // const isHuman = await verifyRecaptcha(recaptchaToken);
    // if (!isHuman) {
    //   return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
    // }

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

    await transporter.sendMail(mailOptions);
    
    return res.status(200).json({ 
      success: true, 
      message: "Email sent successfully" 
    });
  } catch (error) {
    console.error("Error sending email:", error);
    
    if (error.message === 'Too many requests') {
      return res.status(429).json({ 
        success: false, 
        message: 'Too many requests. Please try again later.' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: "Failed to send email",
      error: error.message 
    });
  }
}
