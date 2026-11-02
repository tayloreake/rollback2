// Server-only Zoho CRM sync (Sanity Security §2).
// Writes website quotes to the Zoho Leads module — never to Sanity production.
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
  // A non-2xx response can carry an HTML/empty body — r.json() would throw a
  // SyntaxError and mask the real API error. Surface the status + body instead.
  const text = await r.text()
  let parsed = null
  try { parsed = text ? JSON.parse(text) : null } catch { /* non-JSON body */ }

  if (!r.ok) {
    const detail = parsed?.message || parsed?.error?.message || text.slice(0, 200) || r.statusText
    throw new Error(`Zoho ${method} ${path} → HTTP ${r.status}: ${detail}`)
  }

  // Zoho's search endpoint returns HTTP 204 with an EMPTY body when nothing
  // matches. r.json() throws "Unexpected end of JSON input" on that, which is
  // what silently dropped every new quote (the throw aborted before the
  // create). Treat it as a valid "no matches" result.
  if (!parsed) return { data: [] }
  return parsed
}

// Zoho's documented search form for the standard Leads module.
// The `?email=` shorthand only reliably works on standard modules (Leads/Contacts).
const leadSearch = async (email) => {
  const criteria = encodeURIComponent(`(Email:equals:${email})`)
  const found = await api(`/Leads/search?criteria=${criteria}`)
  const hit = found?.data?.[0]
  return hit?.id || null
}

export async function syncQuoteToZoho(quote = {}, attribution = {}) {
  if (!zohoConfigured()) {
    return { skipped: true }
  }
  try {
    const email = String(quote.email || "").trim()
    // Split firstName / lastName — both are required for Zoho Leads.
    const firstName = String(quote.firstName || "").trim().slice(0, 80)
    const lastName = String(quote.lastName || "").trim().slice(0, 80)
    const displayName = [firstName, lastName].filter(Boolean).join(" ") || "Website Lead"
    // Dedupe is best-effort: a search failure must NEVER block the write
    // (this is what silently dropped every quote — the throw aborted before
    // the create). Fall through to a plain create instead.
    let recordId = null
    if (email) {
      try {
        recordId = await leadSearch(email)
      } catch (e) {
        console.warn("Zoho lead dedupe search failed (creating anyway):", e?.message)
      }
    }
    const record = {
      First_Name: firstName || undefined,
      Last_Name: lastName || undefined,
      Name: displayName,
      Email: email || undefined,
      Phone: String(quote.phoneNumber || "").slice(0, 30) || undefined,
      How_did_you_hear_about_us: String(quote.referrals || quote.ref || "Website").slice(0, 100),
      Move_Types: String(quote.moveType || "").slice(0, 100) || undefined,
      Origin_Address_Street_Address: String(quote.location || "").slice(0, 255) || undefined,
      Destination_Address_Street_Address: String(quote.destination || "").slice(0, 255) || undefined,
      Property_Size: String(quote.bedrooms || "").slice(0, 100) || undefined,
      Proposed_Move_Date: String(quote.moveDate || "").slice(0, 50) || undefined,
      GCLID: String(attribution.gclid || "").slice(0, 100) || undefined,
    }
    if (recordId) {
      // duplicate_check_fields makes the upsert idempotent on Email.
      await api("/Leads/upsert?duplicate_check_fields=Email", "POST", {
        data: [{ ...record, id: recordId }],
      })
    } else {
      const created = await api("/Leads", "POST", { data: [record] })
      recordId = created?.data?.[0]?.details?.id || null
      if (!recordId) throw new Error(created?.data?.[0]?.message || "Lead create returned no id")
    }
    return { ok: true, leadId: recordId }
  } catch (e) {
    return { ok: false, error: e?.message || "Zoho sync failed" }
  }
}

// Generic non-quote inquiry (contact / feedback / job application) → Zoho Leads
// module, distinguished by How_did_you_hear_about_us.
export async function syncInquiryToZoho({ name, email, phone, source, notes } = {}) {
  if (!zohoConfigured()) {
    return { skipped: true }
  }
  try {
    const record = {
      First_Name: String(name || "Website Inquiry").slice(0, 80),
      Last_Name: undefined,
      Name: String(name || "Website Inquiry").slice(0, 100),
      Email: String(email || "").trim() || undefined,
      Phone: String(phone || "").slice(0, 30) || undefined,
      How_did_you_hear_about_us: String(source || "Website").slice(0, 100),
    }
    const created = await api("/Leads", "POST", { data: [record] })
    const id = created?.data?.[0]?.details?.id || null
    if (!id) throw new Error(created?.data?.[0]?.message || "Inquiry create returned no id")
    return { ok: true, leadId: id }
  } catch (e) {
    return { ok: false, error: e?.message || "Zoho sync failed" }
  }
}
