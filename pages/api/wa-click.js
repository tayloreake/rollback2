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

const saveWhatsAppLead = async ({ ref, placement, page, referrer, utm }) => {
  const zohoDomain = ZOHO_DATA_CENTERS[process.env.ZOHO_DC || "com"] || ZOHO_DATA_CENTERS.com
  const apiUrl = (process.env.ZOHO_API_URL || zohoDomain.api).replace(/\/+$/, "")
  const token = await getZohoToken()
  const fields = {
    Last_Name: `WhatsApp visitor ${ref}`,
    Lead_Source: "Web - WhatsApp",
    Lead_Status: "Unverified",
    WA_Ref: ref,
    WA_Placement: placement,
    Landing_Page: utm.landing_page || page,
    Referrer: utm.referrer || referrer,
    UTM_Source: utm.utm_source || "",
    UTM_Campaign: utm.utm_campaign || "",
    GCLID: utm.gclid || "",
    "$gclid": utm.gclid || "",
  }
  const response = await fetch(`${apiUrl}/crm/v6/Leads`, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: [fields] }),
  })
  const data = await response.json().catch(() => null)
  const row = data?.data?.[0]
  if (!response.ok || row?.status !== "success") {
    throw new Error(`Zoho WhatsApp lead create failed (${response.status}): ${row?.message || data?.message || "unknown error"}`)
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  try {
    if (Number(req.headers["content-length"] || 0) > BODY_LIMIT) return res.status(413).end()
    if (!allowRequest(requestIp(req))) return res.status(429).end()

    const raw = await readRequestBody(req)
    let payload
    try {
      payload = JSON.parse(raw || "{}")
    } catch {
      return res.status(400).end()
    }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return res.status(400).end()
    const ref = safeText(payload.ref, 8)
    if (!/^\d{8}$/.test(ref)) return res.status(400).end()

    const placement = safeText(payload.placement, 80)
    const page = safeText(payload.page, 500)
    const referrer = safeText(payload.referrer, 1000)
    const utm = sanitizeUtm(payload.utm)

    await saveWhatsAppLead({ ref, placement, page, referrer, utm })
    return res.status(204).end()
  } catch (error) {
    console.error("WhatsApp click Zoho sync failed:", error?.message || error)
    return res.status(error?.status === 413 ? 413 : 204).end()
  }
}
