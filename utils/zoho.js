// Server-only Zoho CRM sync (Sanity Security §2).
// Writes website quotes to the dedicated Website_Quotes section —
// never to Leads, never to Sanity production.
// Env required: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN,
// optional ZOHO_DC ("com" | "eu" | "in", default "com").
// recaptchaScore is intentionally never sent. Failures returned, never thrown.

const DC = {
  com: { accounts: "https://accounts.zoho.com", api: "https://www.zohoapis.com" },
  eu: { accounts: "https://accounts.zoho.eu", api: "https://www.zohoapis.eu" },
  in: { accounts: "https://accounts.zoho.in", api: "https://www.zohoapis.in" },
}

let cachedToken = null
let cachedExp = 0

const base = () => DC[process.env.ZOHO_DC] || DC.com

export const zohoConfigured = () =>
  Boolean(process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_REFRESH_TOKEN)

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedExp) return cachedToken
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    grant_type: "refresh_token",
  })
  const r = await fetch(`${base().accounts}/oauth/v2/token?${params.toString()}`, { method: "POST" })
  const j = await r.json()
  if (!j?.access_token) throw new Error("Zoho token refresh failed")
  cachedToken = j.access_token
  cachedExp = Date.now() + 50 * 60 * 1000
  return cachedToken
}

const api = async (path, method = "GET", body) => {
  const token = await getAccessToken()
  const r = await fetch(`${base().api}/crm/v8${path}`, {
    method,
    headers: { Authorization: `Zoho-oauthtoken ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  return r.json()
}

export async function syncQuoteToZoho(quote = {}, attribution = {}) {
  if (!zohoConfigured()) {
    return { skipped: true }
  }
  try {
    const email = String(quote.email || "").trim()
    let recordId = null
    if (email) {
      const found = await api(`/Website_Quotes/search?email=${encodeURIComponent(email)}`)
      recordId = found?.data?.[0]?.id || null
    }
    const record = {
      Name: String(quote.firstName || "Website Lead").slice(0, 100),
      Email: email || undefined,
      Phone: String(quote.phoneNumber || "").slice(0, 30),
      Lead_Source: String(quote.referrals || quote.ref || "Website").slice(0, 100),
      Move_Type: String(quote.moveType || "").slice(0, 100) || undefined,
      Move_From: String(quote.location || "").slice(0, 255) || undefined,
      Move_To: String(quote.destination || "").slice(0, 255) || undefined,
      Property_Size: String(quote.bedrooms || "").slice(0, 100) || undefined,
      Move_Date: String(quote.moveDate || "").slice(0, 50) || undefined,
      GCLID: String(attribution.gclid || "").slice(0, 100) || undefined,
      Quote_Notes: [
        `UTM: ${(attribution.utm_source || "")}/${(attribution.utm_medium || "")}/${(attribution.utm_campaign || "")}`,
        `landing: ${attribution.landing_page || ""}`,
      ].join(" | ").slice(0, 255),
    }
    if (recordId) {
      await api("/Website_Quotes/upsert", "POST", { data: [{ ...record, id: recordId }] })
    } else {
      const created = await api("/Website_Quotes", "POST", { data: [record] })
      recordId = created?.data?.[0]?.details?.id || null
      if (!recordId) throw new Error(created?.data?.[0]?.message || "Website Quote create returned no id")
    }
    return { ok: true, leadId: recordId }
  } catch (e) {
    return { ok: false, error: e?.message || "Zoho sync failed" }
  }
}

// Generic non-quote inquiry (contact / feedback / job application) → the same
// Website Inquiries section, distinguished by Lead_Source. Fire-and-forget.
export async function syncInquiryToZoho({ name, email, phone, source, notes } = {}) {
  if (!zohoConfigured()) {
    return { skipped: true }
  }
  try {
    const record = {
      Name: String(name || "Website Inquiry").slice(0, 100),
      Email: String(email || "").trim() || undefined,
      Phone: String(phone || "").slice(0, 30) || undefined,
      Lead_Source: String(source || "Website").slice(0, 100),
      Quote_Notes: String(notes || "").slice(0, 255) || undefined,
    }
    const created = await api("/Website_Quotes", "POST", { data: [record] })
    const id = created?.data?.[0]?.details?.id || null
    if (!id) throw new Error(created?.data?.[0]?.message || "Inquiry create returned no id")
    return { ok: true, leadId: id }
  } catch (e) {
    return { ok: false, error: e?.message || "Zoho sync failed" }
  }
}
