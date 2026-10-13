// Quote intake orchestrator (Sanity Security §7.3 + §8).
// Flow, in order:
//   1. validate + reCAPTCHA
//   2. write lead to the PRIVATE leads-ledger dataset (status "received") —
//      the source of truth for "was this received", independent of Zoho
//   3. send SMS + sales email (existing trails, kept as-is)
//   4. attempt Zoho CRM Leads create → patch ledger "synced_to_zoho" + lead id;
//      on failure leave "received" with the error (retryable, nothing lost)
// Nothing here writes to the public `production` dataset.
import { rateLimiter } from "./middleware/rateLimiter"
import { getClientIp, getDetailedIpInfo, getGeolocation } from "../../utils/getClientIp"
import { verifyRecaptcha, validateQuoteData, sendSalesEmail, sendLeadSms } from "../../utils/leadNotify"
import { createLeadRecord, patchLeadRecord } from "../../utils/leadLedger"
import { syncQuoteToZoho } from "../../utils/zoho"

const limiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 })

const buildMessage = (q) =>
  [
    "New Move Request:",
    `Name: ${q.firstName || ""}`,
    `Email: ${q.email || ""}`,
    `Phone Number: ${q.phoneNumber || ""}`,
    `Move Type: ${q.moveType || ""}`,
    `Bedrooms: ${q.bedrooms || ""}`,
    `Move Date: ${q.moveDate || ""}`,
    `From: ${q.location || ""}`,
    `To: ${q.destination || ""}`,
    `How did you hear about us: ${q.referrals || q.ref || ""}`,
  ].join("\n")

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }
  const ipAddress = getClientIp(req)
  try {
    await limiter(req)
    const { message, recaptchaToken, quoteData } = req.body
    if (!recaptchaToken) {
      return res.status(400).json({ success: false, message: "reCAPTCHA token is required" })
    }
    const recaptchaResult = await verifyRecaptcha(recaptchaToken)
    if (!recaptchaResult.success) {
      return res.status(400).json({ success: false, message: "reCAPTCHA verification failed" })
    }
    if (recaptchaResult.score !== null && recaptchaResult.score < 0.5) {
      console.warn(`Low reCAPTCHA score: ${recaptchaResult.score} from IP: ${ipAddress}`)
    }
    if (!quoteData) {
      return res.status(400).json({ success: false, message: "Missing quote data" })
    }
    const valid = validateQuoteData(quoteData)
    if (!valid.ok) {
      return res.status(400).json({ success: false, message: valid.error })
    }
    if (!message) {
      return res.status(400).json({ success: false, message: "'message' field is required" })
    }
    const attribution = quoteData.attribution || {}
    const ipDetails = getDetailedIpInfo(req)
    const geolocation = getGeolocation(req)

    // 1. Ledger first — independent of everything downstream
    let ledgerId = null
    try {
      const doc = await createLeadRecord({
        firstName: quoteData.firstName,
        email: quoteData.email,
        phoneNumber: quoteData.phoneNumber,
        location: quoteData.location,
        destination: quoteData.destination,
        moveType: quoteData.moveType,
        bedrooms: quoteData.bedrooms,
        moveDate: quoteData.moveDate,
        referrals: quoteData.referrals,
        attribution: {
          utm_source: attribution.utm_source || "",
          utm_medium: attribution.utm_medium || "",
          utm_campaign: attribution.utm_campaign || "",
          gclid: attribution.gclid || "",
          landing_page: attribution.landing_page || "",
          referrer: attribution.referrer || "",
        },
        ipAddress,
        recaptchaScore: recaptchaResult.score,
        emailSent: false,
        smsSent: false,
      })
      ledgerId = doc?._id || null
    } catch (e) {
      console.error("Ledger write failed (continuing):", e?.message)
    }

    // 2. SMS + email trails (kept as-is)
    const sms = await sendLeadSms(message, ipAddress)
    const mail = await sendSalesEmail(message, attribution)

    // 3. Zoho attempt → patch ledger
    let zoho = { skipped: true }
    try {
      zoho = await syncQuoteToZoho(quoteData, attribution)
      if (ledgerId) {
        if (zoho?.ok) {
          await patchLeadRecord(ledgerId, { status: "synced_to_zoho", zohoLeadId: zoho.leadId, emailSent: mail.ok, smsSent: sms.ok })
        } else if (!zoho?.skipped) {
          await patchLeadRecord(ledgerId, { syncError: zoho.error || "Zoho sync failed", emailSent: mail.ok, smsSent: sms.ok })
        }
      }
    } catch (e) {
      console.error("Zoho sync error (lead safe in ledger):", e?.message)
      if (ledgerId) {
        try { await patchLeadRecord(ledgerId, { syncError: e?.message, emailSent: mail.ok, smsSent: sms.ok }) } catch {}
      }
    }

    if (!mail.ok && !sms.ok) {
      return res.status(500).json({ success: false, message: "Failed to deliver quote request. Please try again." })
    }
    return res.status(200).json({ success: true, message: "Quote request submitted successfully", ledgerId, zoho: zoho?.ok ? "synced" : "pending" })
  } catch (error) {
    console.error("Error in submitQuote handler:", error)
    if (error?.message === "Too many requests") {
      return res.status(429).json({ success: false, message: "Too many requests. Please try again later." })
    }
    return res.status(500).json({ success: false, message: "Failed to submit quote request" })
  }
}
