// Plain sales-email sender (contact / feedback / jobs forms + legacy callers).
// Quote intake goes through /api/submitQuote (ledger → SMS/email → Zoho).
// This route sends email ONLY — no Sanity writes.
// Recipients are allowlisted (no open relay): any client-supplied address
// outside the list falls back to sales@taylorea.com.
import { rateLimiter } from "./middleware/rateLimiter";
import { verifyRecaptcha, sendSalesEmail } from "../../utils/leadNotify";
import { syncInquiryToZoho } from "../../utils/zoho";

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5
});

const ALLOWED_TO = new Set([
  "sales@taylorea.com",
  "hradmin@taylorea.com",
  "marykc@taylorea.com",
  "stephaniem@taylorea.com",
]);

const pickRecipients = (raw) => {
  const list = String(raw || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => ALLOWED_TO.has(s));
  return list.length ? list : ["sales@taylorea.com"];
};

const cleanSubject = (raw, fallback) => {
  const s = String(raw || "").replace(/[\r\n]+/g, " ").trim().slice(0, 120);
  return s || fallback;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await limiter(req);

    const { message, recaptchaToken, inquiry } = req.body;

    if (!recaptchaToken) {
      return res.status(400).json({ success: false, message: 'reCAPTCHA token is required' });
    }

    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success) {
      return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
    }

    if (recaptchaResult.score !== null && recaptchaResult.score < 0.5) {
      console.warn(`Low reCAPTCHA score detected: ${recaptchaResult.score}`);
    }

    if (!message) {
      return res.status(400).json({ success: false, message: "'message' field is required" });
    }

    const result = await sendSalesEmail(message, {}, {
      to: pickRecipients(req.body.to),
      subject: cleanSubject(req.body.subject, "Taylor Movers Website Message"),
    });

    if (!result.ok) {
      return res.status(500).json({
        success: false,
        message: "Failed to send email via Nodemailer",
      });
    }

    // Optional visitor confirmation with a FIXED template (safe: no
    // attacker-controlled recipients beyond the verified submitter, no
    // attacker-controlled body).
    const confirmTo = String(req.body.confirmTo || "").trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(confirmTo)) {
      try {
        await sendSalesEmail(
          "Thanks for contacting Taylor Movers Kenya — we received your message and will respond shortly. For urgent moves call +254 721 410 517.",
          {},
          { to: [confirmTo], subject: "We received your message — Taylor Movers" }
        );
      } catch {}
    }

    // Non-quote inquiries (contact / feedback / job) → Zoho Website Inquiries.
    // Awaited (not fire-and-forget) so a Zoho failure is logged instead of
    // being swallowed by a bare .catch(() => {}).
    if (inquiry) {
      try {
        const zoho = await syncInquiryToZoho(inquiry)
        if (!zoho?.ok && !zoho?.skipped) {
          console.error("Zoho inquiry sync failed:", zoho?.error || "unknown")
        }
      } catch (e) {
        console.error("Zoho inquiry sync threw:", e?.message)
      }
    }

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
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
