// Quote intake orchestrator (Sanity Security §7.3 + §8).
// Flow, in order:
//   1. validate + reCAPTCHA
//   2. send SMS + sales email (existing trails, kept as-is)
//   3. attempt Zoho CRM Leads create/upsert — the system of record for management reporting
// Nothing here writes to the public Sanity dataset.
import { rateLimiter } from "./middleware/rateLimiter"
import { getClientIp, getDetailedIpInfo, getGeolocation } from "../../utils/getClientIp"
import { verifyRecaptcha, validateQuoteData, sendSalesEmail, sendLeadSms } from "../../utils/leadNotify"
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

    // 1. SMS + email trails (kept as-is)
    const sms = await sendLeadSms(message, ipAddress)
    const mail = await sendSalesEmail(message, attribution)

    // 2. Zoho attempt — system of record for management reporting
    let zoho = { ok: false, error: null }
    let zohoError = null
    try {
      zoho = await syncQuoteToZoho(quoteData, attribution)
      if (zoho?.ok) {
        zohoError = null
      } else if (!zoho?.skipped) {
        zohoError = zoho?.error || "Zoho sync failed"
      }
    } catch (e) {
      zohoError = e?.message || "Zoho sync threw"
      console.error("Quote Zoho sync threw:", zohoError)
      zoho = { ok: false, error: zohoError }
    }

    if (!mail.ok && !sms.ok) {
      return res.status(500).json({ success: false, message: "Failed to deliver quote request. Please try again." })
    }
    // Surface the CRM outcome so a silent failure is visible in logs/alerting
    // instead of looking like a clean submission.
    if (zohoError) console.error("Quote Zoho sync failed:", zohoError)
    return res.status(200).json({
      success: true,
      message: "Quote request submitted successfully",
      zoho: zoho?.ok ? "synced" : "pending",
      zohoError: zoho?.ok ? null : zohoError,
    })
  } catch (error) {
    console.error("Error in submitQuote handler:", error)
    if (error?.message === "Too many requests") {
      return res.status(429).json({ success: false, message: "Too many requests. Please try again later." })
    }
    return res.status(500).json({ success: false, message: "Failed to submit quote request" })
  }
}