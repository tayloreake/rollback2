// Quote intake orchestrator (Sanity Security §7.3 + §8).
// Flow, in order:
//   1. validate + reCAPTCHA
//   2. send SMS + sales email (existing trails, kept as-is)
//   3. attempt Zoho CRM Leads create/upsert — the system of record for management reporting
// Nothing here writes to the public Sanity dataset.
import { rateLimiter } from "./middleware/rateLimiter"
import { getClientIp, getDetailedIpInfo, getGeolocation } from "../../utils/getClientIp"
import { verifyRecaptcha, validateQuoteData, buildQuoteMessage, sendSalesEmail, sendLeadSms } from "../../utils/leadNotify"
import { recaptchaVerdict, botSignals, captchaOptions } from "../../utils/spamGuard"
import { syncQuoteToZoho } from "../../utils/zoho"
import { sendLeadToMeta } from "../../utils/metaCapi"

const limiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 })

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }
  const ipAddress = getClientIp(req)
  try {
    await limiter(req)
    const { recaptchaToken, quoteData, meta } = req.body
    if (!recaptchaToken) {
      return res.status(400).json({ success: false, message: "reCAPTCHA token is required" })
    }
    const recaptchaResult = await verifyRecaptcha(recaptchaToken)
    const verdict = recaptchaVerdict(recaptchaResult, captchaOptions())
    if (!verdict.ok) {
      console.warn(`Quote blocked (${verdict.reason}) score=${recaptchaResult.score} ip=${ipAddress}`)
      return res.status(400).json({ success: false, message: "reCAPTCHA verification failed" })
    }
    if (!quoteData) {
      return res.status(400).json({ success: false, message: "Missing quote data" })
    }
    const signals = botSignals(req.body)
    if (signals.length) {
      console.warn(`Quote blocked (${signals.join(",")}) ip=${ipAddress}`)
      // Look successful to the bot; deliver nothing.
      return res.status(200).json({ success: true, message: "Quote request submitted successfully", zoho: "skipped" })
    }
    const valid = validateQuoteData(quoteData)
    if (!valid.ok) {
      if (valid.spam) console.warn(`Quote blocked as spam (${valid.reasons.join(",")}) ip=${ipAddress}`)
      return res.status(400).json({ success: false, message: valid.error })
    }
    // Built from the validated quote — the client-supplied message is ignored.
    const message = buildQuoteMessage(quoteData)
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

    // 3. Meta Conversions API (T15b). Consent-gated, deduped with the browser
    // pixel by event_id. Failures are logged only and never block the lead.
    try {
      const capi = await sendLeadToMeta({
        quoteData,
        meta: meta || {},
        ip: ipAddress,
        userAgent: req.headers["user-agent"],
      })
      if (!capi.ok && !capi.skipped) console.error("Meta CAPI failed:", capi.error)
    } catch (e) {
      console.error("Meta CAPI threw:", e?.message)
    }

    if (!mail.ok && !sms.ok) {
      return res.status(500).json({ success: false, message: "Failed to deliver quote request. Please try again." })
    }
    // Surface the CRM outcome so a silent failure is visible in logs/alerting
    // instead of looking like a clean submission.
    if (zohoError) console.error("Quote Zoho sync failed:", zohoError)
    if (zoho?.droppedAttribution?.length) {
      console.warn("Zoho dropped attribution field(s):", zoho.droppedAttribution.join(", "))
    }
    return res.status(200).json({
      success: true,
      message: "Quote request submitted successfully",
      zoho: zoho?.ok ? "synced" : "pending",
      zohoError: zoho?.ok ? null : zohoError,
      // T7 test plan: fields Zoho rejected (should be [] once the custom
      // fields exist on the Leads module).
      zohoDroppedFields: zoho?.droppedAttribution || [],
    })
  } catch (error) {
    console.error("Error in submitQuote handler:", error)
    if (error?.message === "Too many requests") {
      return res.status(429).json({ success: false, message: "Too many requests. Please try again later." })
    }
    return res.status(500).json({ success: false, message: "Failed to submit quote request" })
  }
}