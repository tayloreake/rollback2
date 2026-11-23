import { attributionRecord } from "../../utils/zoho.js"
import { validateQuoteData, verifyRecaptcha } from "../../utils/leadNotify.js"
import { botSignals, captchaOptions, recaptchaVerdict } from "../../utils/spamGuard.js"

const BODY_LIMIT = 8 * 1024
const RATE_WINDOW_MS = 60 * 1000
const RATE_MAX = 15
const rateBuckets = new Map()
const ZOHO_DATA_CENTERS = {
  com: { accounts: "https://accounts.zoho.com", api: "https://www.zohoapis.com" },
  eu: { accounts: "https://accounts.zoho.eu", api: "https://www.zohoapis.eu" },
  in: { accounts: "https://accounts.zoho.in", api: "https://www.zohoapis.in" },
}

let cachedToken = ""
let cachedTokenExpiresAt = 0
let tokenRequest = null

export const config = {
  api: { bodyParser: false },
}

const readRequestBody = (req) => new Promise((resolve, reject) => {
  let size = 0
  let tooLarge = false
  const chunks = []
  req.on("data", (chunk) => {
    size += chunk.length
    if (size > BODY_LIMIT) {
      tooLarge = true
      return
    }
    chunks.push(chunk)
  })
  req.on("end", () => {
    if (tooLarge) return reject(Object.assign(new Error("Request body too large"), { status: 413 }))
    resolve(Buffer.concat(chunks).toString("utf8"))
  })
  req.on("error", reject)
})

const requestIp = (req) => {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim()
  return forwarded || req.socket?.remoteAddress || "unknown"
}

const allowRequest = (ip) => {
  const now = Date.now()
  const recent = (rateBuckets.get(ip) || []).filter((at) => at > now - RATE_WINDOW_MS)
  if (recent.length >= RATE_MAX) return false
  recent.push(now)
  rateBuckets.set(ip, recent)
  if (rateBuckets.size > 2000) {
    for (const [key, times] of rateBuckets) {
      if (!times.some((at) => at > now - RATE_WINDOW_MS)) rateBuckets.delete(key)
    }
  }
  return true
}

const safeText = (value, maxLength) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : ""

const sanitizeUtm = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}
  const entries = Object.entries(value).slice(0, 40)
  return Object.fromEntries(entries.map(([key, item]) => [
    safeText(key, 100), safeText(String(item ?? ""), 500),
  ]).filter(([key]) => key))
}

const getZohoToken = async () => {
  if (cachedToken && Date.now() < cachedTokenExpiresAt) return cachedToken
  if (tokenRequest) return tokenRequest

  const zohoDomain = ZOHO_DATA_CENTERS[process.env.ZOHO_DC || "com"] || ZOHO_DATA_CENTERS.com
  const accountsUrl = (process.env.ZOHO_ACCOUNTS_URL || zohoDomain.accounts).replace(/\/+$/, "")
  if (!process.env.ZOHO_CLIENT_ID || !process.env.ZOHO_CLIENT_SECRET || !process.env.ZOHO_REFRESH_TOKEN) {
    throw new Error("Zoho WhatsApp lead credentials are not configured")
  }
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: process.env.ZOHO_REFRESH_TOKEN || "",
    client_id: process.env.ZOHO_CLIENT_ID || "",
    client_secret: process.env.ZOHO_CLIENT_SECRET || "",
  })
  tokenRequest = (async () => {
    const response = await fetch(`${accountsUrl}/oauth/v2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      signal: typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(10000) : undefined,
    })
    const data = await response.json()
    if (!response.ok || !data?.access_token) {
      throw new Error(`Zoho OAuth token request failed (${response.status}): ${data?.error || "no access token"}`)
    }
    cachedToken = data.access_token
    cachedTokenExpiresAt = Date.now() + 50 * 60 * 1000
    return cachedToken
  })()
  try {
    return await tokenRequest
  } finally {
    tokenRequest = null
  }
}

const saveWhatsAppLead = async ({ ref, placement, page, referrer, utm, quote }) => {
  const zohoDomain = ZOHO_DATA_CENTERS[process.env.ZOHO_DC || "com"] || ZOHO_DATA_CENTERS.com
  const apiUrl = (process.env.ZOHO_API_URL || zohoDomain.api).replace(/\/+$/, "")
  const token = await getZohoToken()
  // Routing rule: quote forms AND WhatsApp inquiries go to the Leads module;
  // every other website interaction goes to Website_Quotes (Website Inquiries).
  // WA ref/placement have no Leads columns (Zoho ignored them), so they ride in
  // Description. Field names below all exist on the Leads module.
  // Same attribution mapping as quote leads, so WhatsApp traffic is traceable
  // to its channel: Platform (e.g. Google Ads / Facebook Ads / Google Organic /
  // Direct), UTMs, campaign/ad ids, click ids, landing page and referrer.
  // Lead_Source keeps the team's "Web - WhatsApp" convention.
  const attribution = {
    ...utm,
    landing_page: utm.landing_page || page,
    referrer: utm.referrer || referrer,
  }
  const fields = {
    ...attributionRecord(attribution, "", { name: "WhatsApp Enquiry", id: "whatsapp" }),
    First_Name: quote.firstName || undefined,
    Last_Name: quote.lastName || quote.firstName || "Website Lead",
    Email: quote.email,
    Phone: quote.phoneNumber,
    Move_Types: quote.moveType,
    Origin_Address_Street_Address: quote.location,
    Destination_Address_Street_Address: quote.destination,
    Property_Size: quote.bedrooms,
    Proposed_Move_Date: quote.moveDate,
    Lead_Source: "Web - WhatsApp",
    Lead_Status: "Unverified",
    Description: `WA_Ref ${ref} | ${placement} | WhatsApp consent: yes | ${new Date().toISOString()}`.slice(0, 500),
  }
  // Zoho rejects nothing for undefined values; drop them from the payload.
  for (const k of Object.keys(fields)) if (fields[k] === undefined || fields[k] === "") delete fields[k]
  const response = await fetch(`${apiUrl}/crm/v6/Leads`, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: [fields] }),
    signal: typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(10000) : undefined,
  })
  const data = await response.json().catch(() => null)
  const row = data?.data?.[0]
  const leadId = String(row?.details?.id || "").trim()
  if (!response.ok || row?.status !== "success" || !leadId) {
    const reason = row?.status === "success" && !leadId
      ? "Zoho did not return a Lead ID"
      : row?.message || data?.message || "unknown error"
    throw new Error(`Zoho WhatsApp lead create failed (${response.status}): ${reason}`)
  }
  return leadId
}

const jsonError = (res, status, message) => res.status(status).json({ success: false, message })

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  try {
    if (Number(req.headers["content-length"] || 0) > BODY_LIMIT) return jsonError(res, 413, "Request is too large")
    if (!allowRequest(requestIp(req))) return jsonError(res, 429, "Too many requests. Please try again later.")

    const raw = await readRequestBody(req)
    let payload
    try {
      payload = JSON.parse(raw || "{}")
    } catch {
      return jsonError(res, 400, "Invalid request")
    }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return jsonError(res, 400, "Invalid request")
    const ref = safeText(payload.ref, 8)
    if (!/^\d{8}$/.test(ref)) return jsonError(res, 400, "Invalid enquiry reference")
    if (payload.whatsappConsent !== true) return jsonError(res, 400, "WhatsApp contact permission is required")

    const placement = safeText(payload.placement, 80)
    const page = safeText(payload.page, 500)
    const referrer = safeText(payload.referrer, 1000)
    const utm = sanitizeUtm(payload.utm)
    if (!payload.quoteData || typeof payload.quoteData !== "object" || Array.isArray(payload.quoteData)) {
      return jsonError(res, 400, "Please provide your contact and move details")
    }

    const quote = { ...payload.quoteData }
    if (!safeText(quote.email, 120)) return jsonError(res, 400, "Please provide an email address")
    const valid = validateQuoteData(quote)
    if (!valid.ok) return jsonError(res, 400, valid.error || "Please check your details")
    const phoneDigits = String(quote.phoneNumber || "").replace(/\D/g, "")
    if (phoneDigits.length < 7 || phoneDigits.length > 15) return jsonError(res, 400, "Invalid phone number")
    if (String(quote.location || "").length < 3 || String(quote.destination || "").length < 3 || !quote.moveType || !quote.bedrooms) {
      return jsonError(res, 400, "Please provide your move details")
    }
    const date = String(quote.moveDate || "")
    const parsedDate = new Date(`${date}T00:00:00.000Z`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
      return jsonError(res, 400, "Please provide a valid move date")
    }

    const recaptchaToken = safeText(payload.recaptchaToken, 4096)
    if (!recaptchaToken) return jsonError(res, 400, "Please verify that you are human")
    const recaptchaResult = await verifyRecaptcha(recaptchaToken)
    const verdict = recaptchaVerdict(recaptchaResult, captchaOptions())
    if (!verdict.ok) return jsonError(res, 400, "Human verification failed. Please try again.")

    const signals = botSignals(payload)
    if (signals.length) return jsonError(res, 400, "Please try again")

    await saveWhatsAppLead({ ref, placement, page, referrer, utm, quote })
    return res.status(201).json({ success: true, ref })
  } catch (error) {
    if (error?.status === 413) return jsonError(res, 413, "Request is too large")
    if (error?.status === 429 || error?.message === "Too many requests") {
      return jsonError(res, 429, "Too many requests. Please try again later.")
    }
    console.error("WhatsApp lead save failed:", error?.message || error)
    return jsonError(res, 502, "We couldn't save your enquiry. Please try again; WhatsApp has not opened.")
  }
}
