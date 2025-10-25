import config from "../../africastalking.config"
import AfricaTalking from "africastalking"
import { rateLimiter } from "./middleware/rateLimiter"
import { getClientIp, getDetailedIpInfo } from "../../utils/getClientIp";

const africastalking = AfricaTalking(config)

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
    return {
      success: data.success,
      score: data.score || null,
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

  // Capture IP information
  const ipAddress = getClientIp(req);
  const ipDetails = getDetailedIpInfo(req);

  try {
    // Apply rate limiting
    await limiter(req);

    const { to, message, recaptchaToken } = req.body;

    if (!recaptchaToken) {
      return res.status(400).json({ success: false, message: 'reCAPTCHA token is required' });
    }

    // Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success) {
      return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
    }

    // Warn on low score
    if (recaptchaResult.score !== null && recaptchaResult.score < 0.5) {
      console.warn(`Low reCAPTCHA score in SMS: ${recaptchaResult.score} from IP: ${ipAddress}`);
    }

    const sms = africastalking.SMS;
    
    // Append IP address to message for tracking
    const messageWithIp = `${message}\n\n[Submitted from IP: ${ipAddress}]`;
    
    let response;
    try {
      response = await sms.send({
        to: ['+254721410517'], 
        message: messageWithIp, 
        from: process.env.NEXT_PUBLIC_AT_USER_ID || 'TaylorMover'
      });
      console.log(`SMS sent successfully from IP: ${ipAddress}`);
    } catch (error) {
      console.error(`SMS send failed from IP: ${ipAddress}`, error);
      return res.status(500).json({
        success: false,
        message: "Failed to send SMS via AfricaTalking",
        error: error?.message || error || "Unknown error during SMS send"
      });
    }

    return res.status(200).json({
      success: true,
      message: "SMS sent successfully",
      ipAddress: ipAddress,
      data: response
    });
  } catch (error) {
    if (error.message === 'Too many requests') {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to send SMS",
      error: error.message
    });
  }
}
