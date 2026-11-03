// Server-side Google Ads offline conversion upload (groundwork).
// Requires env: GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CLIENT_ID,
// GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_CUSTOMER_ID,
// GOOGLE_ADS_CONVERSION_ACTION_ID. If any are missing, the endpoint returns
// { skipped: true } so callers never fail a lead because of Ads.
import { rateLimiter } from "./middleware/rateLimiter"

const REQUIRED = [
  "GOOGLE_ADS_DEVELOPER_TOKEN",
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
  if (!j?.access_token) throw new Error("Google Ads token refresh failed")
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

  const { gclid, conversionDateTime, value, currency } = req.body || {}
  if (!gclid) {
    return res.status(400).json({ success: false, message: "gclid is required" })
  }
  const miss = missing()
  if (miss.length) {
    console.warn("[google-ads] offline conversion skipped — missing env:", miss.join(", "))
    return res.status(200).json({ success: true, skipped: true, reason: "not_configured", missing: miss })
  }

  try {
    const token = await accessToken()
    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID.replace(/-/g, "")
    const url = `https://googleads.googleapis.com/v16/customers/${customerId}:uploadClickConversions`
    const body = {
      conversions: [
        {
          gclid,
          conversionAction: `customers/${customerId}/conversionActions/${process.env.GOOGLE_ADS_CONVERSION_ACTION_ID}`,
          conversionDateTime: conversionDateTime || new Date().toISOString().replace("T", " ").slice(0, 19) + "+00:00",
          conversionValue: value ? Number(value) : 1,
          currencyCode: currency || "KES",
        },
      ],
      partialFailure: true,
    }
    const r = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
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
