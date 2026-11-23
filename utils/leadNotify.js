// Shared server-side lead transports (Sanity Security §7/§8).
// Used by /api/submitQuote (full orchestration) and kept available to the
// legacy /api/sendEmail + /api/sendSms routes (contact form).
// Nothing here touches the public Sanity production dataset.
import nodemailer from "nodemailer"
import AfricaTalking from "africastalking"
import config from "../africastalking.config.js"
import { assessQuote } from "./spamGuard.js"

export async function verifyRecaptcha(token) {
  try {
    // Env values pasted into Vercel often carry a trailing newline; trim it.
    const secret = String(process.env.RECAPTCHA_SECRET_KEY || "").trim()
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: String(token || "") }).toString(),
      signal: typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(10000) : undefined,
    })
    const data = await response.json()
    return {
      success: Boolean(data.success),
      score: typeof data.score === "number" ? data.score : null,
      action: data.action || null,
      hostname: data.hostname || null,
      challengeTs: data.challenge_ts || null,
    }
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

// Split a display name into Zoho's First_Name / Last_Name pair.
// Zoho Leads mandates Last_Name but not First_Name, so a single token becomes
// Last_Name. Exported so the Zoho writer applies the exact same rule.
export function splitFullName(raw, max = 80) {
  const parts = String(raw || "").trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return { firstName: "", lastName: "" }
  if (parts.length === 1) return { firstName: "", lastName: parts[0].slice(0, max) }
  return {
    firstName: parts[0].slice(0, max),
    lastName: parts.slice(1).join(" ").slice(0, max),
  }
}

// Server-side validation mirrors the client (intl phone + real names).
// Normalizes in place. Returns { ok } or { ok: false, error }.
// Accepts either firstName + lastName or one "Full Name" string: the website
// quote forms only collected a full name, and Zoho's Leads create requires a
// Last_Name, so we split here instead of rejecting an otherwise valid lead.
export function validateQuoteData(quoteData) {
  if (!quoteData || typeof quoteData !== "object") return { ok: false, error: "Missing quote data" }
  const rawPhone = String(quoteData.phoneNumber || "").trim()
  const phoneDigits = rawPhone.replace(/\D/g, "")
  const phoneOk = /^\+?\d[\d\s-]{7,15}$/.test(rawPhone) && phoneDigits.length >= 7 && phoneDigits.length <= 15
  if (!phoneOk) return { ok: false, error: "Invalid phone number" }

  let firstName = String(quoteData.firstName || "").trim()
  let lastName = String(quoteData.lastName || "").trim()
  if (!lastName && firstName) {
    const split = splitFullName(firstName)
    firstName = split.firstName
    lastName = split.lastName
  }
  const nameRe = /^[\p{L}\p{M}' .-]{1,80}$/u
  if (!lastName || !nameRe.test(lastName)) return { ok: false, error: "Invalid name" }
  if (firstName && !nameRe.test(firstName)) return { ok: false, error: "Invalid name" }

  if (typeof quoteData.email === "string" && quoteData.email.trim()) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quoteData.email.trim())) return { ok: false, error: "Invalid email" }
  }

  quoteData.phoneNumber = normalizePhone(quoteData.phoneNumber)
  quoteData.firstName = firstName.slice(0, 80)
  quoteData.lastName = lastName.slice(0, 80)
  if (typeof quoteData.email === "string") quoteData.email = quoteData.email.trim().slice(0, 120)
  // Clamp free-text fields so the SAME bounded values feed CRM, SMS and email.
  for (const [k, max] of [["location", 255], ["destination", 255], ["moveType", 100], ["bedrooms", 100], ["moveDate", 50], ["referrals", 100], ["ref", 100]]) {
    if (quoteData[k] !== undefined) quoteData[k] = String(quoteData[k] ?? "").trim().slice(0, max)
  }

  const spam = assessQuote(quoteData)
  if (!spam.ok) return { ok: false, error: "Submission could not be accepted", spam: true, reasons: spam.reasons }
  return { ok: true }
}

// ONE message builder for SMS + sales email, derived from the validated quote
// data (never from a client-supplied free-text message), so CRM, SMS and email
// can never disagree.
export function buildQuoteMessage(q = {}) {
  return [
    "New Move Request:",
    `Name: ${q.firstName || ""} ${q.lastName || ""}`.trim(),
    `Email: ${q.email || ""}`,
    `Phone Number: ${q.phoneNumber || ""}`,
    `Move Type: ${q.moveType || ""}`,
    `Bedrooms: ${q.bedrooms || ""}`,
    `Move Date: ${q.moveDate || ""}`,
    `From: ${q.location || ""}`,
    `To: ${q.destination || ""}`,
    `How did you hear about us: ${q.referrals || q.ref || ""}`,
  ].join("\n")
}

export function formatAttributionBlock(attribution = {}) {
  return [
    "--- Attribution ---",
    `utm: ${(attribution.utm_source || "")}/${(attribution.utm_medium || "")}/${(attribution.utm_campaign || "")}`,
    `campaign_id: ${attribution.campaign_id || ""}`,
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
