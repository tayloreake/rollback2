// Shared server-side lead transports (Sanity Security §7/§8).
// Used by /api/submitQuote (full orchestration) and kept available to the
// legacy /api/sendEmail + /api/sendSms routes (contact form).
// Nothing here touches the public Sanity production dataset.
import nodemailer from "nodemailer"
import AfricaTalking from "africastalking"
import config from "../africastalking.config"

export async function verifyRecaptcha(token) {
  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    })
    const data = await response.json()
    return { success: data.success, score: data.score || null, action: data.action || null }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return { success: false, score: null }
  }
}

export const normalizePhone = (raw) => {
  if (!raw) return raw
  let p = String(raw).trim().replace(/[\s-]/g, "")
  if (/^0\d{9}$/.test(p)) p = "+254" + p.slice(1)
  else if (/^254\d{9}$/.test(p)) p = "+" + p
  else if (!p.startsWith("+")) p = p.startsWith("00") ? "+" + p.slice(2) : p
  return p.slice(0, 16)
}

// Server-side validation mirrors the client (intl phone + real names).
// Normalizes in place. Returns { ok } or { ok: false, error }.
export function validateQuoteData(quoteData) {
  if (!quoteData) return { ok: false, error: "Missing quote data" }
  const phoneOk = /^\+?\d[\d\s-]{7,15}$/.test(String(quoteData.phoneNumber || "").trim())
  if (!phoneOk) return { ok: false, error: "Invalid phone number" }
  const nameOk = /^[\p{L}\p{M}' .-]{2,80}$/u.test(String(quoteData.firstName || "").trim())
  if (!nameOk) return { ok: false, error: "Invalid name" }
  quoteData.phoneNumber = normalizePhone(quoteData.phoneNumber)
  if (typeof quoteData.firstName === "string") quoteData.firstName = quoteData.firstName.trim().slice(0, 80)
  if (typeof quoteData.email === "string") quoteData.email = quoteData.email.trim().slice(0, 120)
  return { ok: true }
}

export function formatAttributionBlock(attribution = {}) {
  return [
    "--- Attribution ---",
    `utm: ${(attribution.utm_source || "")}/${(attribution.utm_medium || "")}/${(attribution.utm_campaign || "")}`,
    `gclid: ${attribution.gclid || ""}`,
    `landing: ${attribution.landing_page || ""}`,
    `referrer: ${attribution.referrer || ""}`,
  ].join("\n")
}

export async function sendSalesEmail(message, attribution = {}, options = {}) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USERNAME, pass: process.env.GMAIL_APP_PASSWORD },
    })
    await transporter.sendMail({
      from: process.env.GMAIL_USERNAME,
      // Default recipient is sales; callers may pass an allowlisted override
      // (validated by the API route — never raw client input).
      to: options.to || "sales@taylorea.com",
      subject: options.subject || "Taylor Movers Quote Request",
      text: `${message}\n\n${formatAttributionBlock(attribution)}`,
    })
    return { ok: true }
  } catch (error) {
    console.error("Nodemailer sendMail error:", error?.message)
    return { ok: false, error: error?.message }
  }
}

export async function sendLeadSms(message, ipAddress = "") {
  try {
    const sms = AfricaTalking(config).SMS
    const messageWithIp = ipAddress ? `${message}\n\n[Submitted from IP: ${ipAddress}]` : message
    await sms.send({
      to: ["+254721410517"],
      message: messageWithIp,
      from: process.env.NEXT_PUBLIC_AT_USER_ID || "TaylorMover",
    })
    return { ok: true }
  } catch (error) {
    console.error("SMS send failed:", error?.message)
    return { ok: false, error: error?.message }
  }
}
