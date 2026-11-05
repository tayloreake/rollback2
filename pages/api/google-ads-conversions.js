// Server-side Google Ads offline conversion upload via the Data Manager API.
// Requires an OAuth refresh token authorized for the Data Manager API scope,
// plus advertiser and conversion-action IDs. Missing config skips cleanly.
import { rateLimiter } from "./middleware/rateLimiter"

const REQUIRED = [
  "GOOGLE_ADS_CLIENT_ID",
  "GOOGLE_ADS_CLIENT_SECRET",
  "GOOGLE_ADS_REFRESH_TOKEN",
  "GOOGLE_ADS_CUSTOMER_ID",
  "GOOGLE_ADS_CONVERSION_ACTION_ID",
]

const missing = () => REQUIRED.filter((k) => !process.env[k])

async function accessToken() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
    grant_type: "refresh_token",
  })
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  })
  const j = await r.json()
  if (!j?.access_token) throw new Error("Google Data Manager token refresh failed; verify OAuth credentials and datamanager scope")
  return j.access_token
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }
  const limiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 20 })
  try {
    await limiter(req)
  } catch {
    return res.status(429).json({ success: false, message: "Too many requests" })
  }

  const { gclid, gbraid, wbraid, conversionDateTime, value, currency, orderId } = req.body || {}
  if (!gclid && !gbraid && !wbraid) {
    return res.status(400).json({ success: false, message: "gclid, gbraid, or wbraid is required" })
  }
  const occurredAt = new Date(conversionDateTime || Date.now())
  if (!Number.isFinite(occurredAt.getTime())) {
    return res.status(400).json({ success: false, message: "conversionDateTime must be a valid date" })
  }
  const miss = missing()
  if (miss.length) {
    console.warn("[google-ads] offline conversion skipped — missing env:", miss.join(", "))
    return res.status(200).json({ success: true, skipped: true, reason: "not_configured", missing: miss })
  }

  try {
    const token = await accessToken()
    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID.replace(/-/g, "")
    const loginCustomerId = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || customerId).replace(/-/g, "")
    const url = "https://datamanager.googleapis.com/v1/events:ingest"
    const googleDateTime = occurredAt.toISOString().replace(/\.\d{3}Z$/, "Z")
    const numericValue = Number(value)
    const body = {
      destinations: [
        {
          operatingAccount: { accountType: "GOOGLE_ADS", accountId: customerId },
          loginAccount: { accountType: "GOOGLE_ADS", accountId: loginCustomerId },
          productDestinationId: String(process.env.GOOGLE_ADS_CONVERSION_ACTION_ID),
        },
      ],
      encoding: "HEX",
      events: [
        {
          adIdentifiers: {
            ...(gclid ? { gclid: String(gclid).slice(0, 512) } : {}),
            ...(gbraid ? { gbraid: String(gbraid).slice(0, 512) } : {}),
            ...(wbraid ? { wbraid: String(wbraid).slice(0, 512) } : {}),
          },
          eventTimestamp: googleDateTime,
          eventSource: "WEB",
          conversionValue: Number.isFinite(numericValue) ? numericValue : 1,
          currency: String(currency || "KES").toUpperCase(),
          ...(orderId ? { transactionId: String(orderId).slice(0, 64) } : {}),
        },
      ],
    }
    const r = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    const j = await r.json()
    if (!r.ok) {
      console.error("[google-ads] upload failed:", r.status, JSON.stringify(j).slice(0, 300))
      return res.status(502).json({ success: false, error: j?.error?.message || "upload failed" })
    }
    return res.status(200).json({ success: true, result: j })
  } catch (e) {
    console.error("[google-ads] threw:", e?.message)
    return res.status(500).json({ success: false, error: e?.message })
  }
}
