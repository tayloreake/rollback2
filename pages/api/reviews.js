import { rateLimiter } from "./middleware/rateLimiter"
import { syncInquiryToZoho } from "../../utils/zoho"

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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Apply rate limiting
    await limiter(req);

    const { sentiment, review, name, email, recaptchaToken } = req.body;

    if (!sentiment || !review || !name || !email || !recaptchaToken) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Verify reCAPTCHA (previously disabled — re-enabled: this endpoint
    // writes visitor PII and must not be an open spam pipe)
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }
    
    // Reviews go to Zoho Website Inquiries (Lead_Source "Review") — never to
    // public Sanity (same exposure class as quotes). Display stays gated by
    // the CMS `approved` flag.
    const zoho = await syncInquiryToZoho({
      name,
      email,
      phone: "",
      source: "Review",
      notes: `[${sentiment}] ${review}`.slice(0, 255),
    });

    return res.status(200).json({
      success: true,
      message: 'Review submitted successfully',
      data: { zoho: zoho?.ok ? "synced" : "pending" }
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    
    if (error.message === 'Too many requests') {
      return res.status(429).json({ 
        message: 'Too many reviews submitted. Please try again later.' 
      });
    }

    return res.status(500).json({ 
      message: 'Error submitting review',
      error: error.message 
    });
  }
}
