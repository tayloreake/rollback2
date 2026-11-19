// Plain SMS sender (contact form + legacy callers).
// Quote intake now goes through /api/submitQuote (ledger → SMS/email → Zoho).
import { rateLimiter } from "./middleware/rateLimiter"
import { getClientIp, getDetailedIpInfo } from "../../utils/getClientIp";
import { verifyRecaptcha, sendLeadSms } from "../../utils/leadNotify"

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});

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

    const { message, recaptchaToken } = req.body;

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

    if (!message) {
      return res.status(400).json({ success: false, message: "'message' field is required" });
    }

    const result = await sendLeadSms(message, ipAddress);
    if (!result.ok) {
      return res.status(500).json({
        success: false,
        message: "Failed to send SMS via AfricaTalking",
        error: result.error || "Unknown error during SMS send"
      });
    }

    return res.status(200).json({
      success: true,
      message: "SMS sent successfully",
      ipAddress: ipAddress,
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
