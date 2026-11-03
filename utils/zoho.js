// Server-only Zoho CRM sync (Sanity Security §2).
// Writes website quotes to the Zoho Leads module — never to Sanity production.
// Env required: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN,
// optional ZOHO_DC ("com" | "eu" | "in", default "com").
// recaptchaScore is intentionally never sent. Failures returned, never thrown.

import { deriveLeadSource } from "./attribution"

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
    const err = new Error(`Zoho ${method} ${path} → HTTP ${r.status}: ${detail}`)
    // Carry Zoho's machine-readable error so a bad custom field can be
    // identified and dropped instead of failing the whole lead write.
    err.status = r.status
    err.code = parsed?.code || parsed?.error?.code || null
    err.details = parsed?.details || parsed?.error?.details || null
    throw err
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

// ---------------------------------------------------------------------------
// T7 — campaign attribution fields (playbook §4: Campaign_ID / UTM_* / GCLID)
// ---------------------------------------------------------------------------
// The playbook defines these on the Deals module; this site writes to Leads.
// They are therefore sent as OPTIONAL extras: if a field doesn't exist yet in
// this CRM org (or is a restricted picklist), Zoho rejects it and we drop
// just that field — a missing custom field must never cost a lead.
const ATTRIBUTION_FIELDS = ["Campaign_ID", "UTM_Source", "UTM_Medium", "UTM_Campaign", "Lead_Source"]
// Least critical first: this is the order we sacrifice them when Zoho rejects
// the record without naming the field. GCLID goes last — it is the one T15
// (Google Ads offline conversions) cannot work without.
const SACRIFICE_ORDER = ["Lead_Source", "UTM_Medium", "UTM_Campaign", "UTM_Source", "Campaign_ID", "GCLID"]
const DROPPABLE = new Set(["GCLID", ...ATTRIBUTION_FIELDS])

const clean = (value, max = 100) => {
  const s = String(value || "").trim()
  return s ? s.slice(0, max) : undefined
}

// Only "your field is bad" errors are recoverable by dropping a field.
// Auth, rate-limit, mandatory and validation errors must surface immediately.
const isFieldError = (err) => {
  if (err?.code === "INVALID_DATA") return true
  if (err?.status !== 400) return false
  return /invalid (data|field)|seems to be invalid|cannot be (found|matched|located)|unknown field|not a valid field/i.test(
    String(err?.message || "")
  )
}

// The api_name Zoho complained about, when it bothers to include one.
const offendingField = (err) => {
  const d = err?.details
  if (d && typeof d === "object") {
    if (typeof d.api_name === "string") return d.api_name
    if (typeof d.field === "string") return d.field
    if (Array.isArray(d.fields) && typeof d.fields[0] === "string") return d.fields[0]
  }
  return null
}

// Create (or upsert) a lead, dropping rejected attribution fields one at a
// time. Returns { id, dropped: ["Field_Name", ...] }.
async function writeLead(record, existingId) {
  let current = { ...record }
  const dropped = []
  for (let attempt = 0; attempt <= SACRIFICE_ORDER.length; attempt++) {
    try {
      if (existingId) {
        // duplicate_check_fields makes the upsert idempotent on Email.
        await api("/Leads/upsert?duplicate_check_fields=Email", "POST", {
          data: [{ ...current, id: existingId }],
        })
        return { id: existingId, dropped }
      }
      const created = await api("/Leads", "POST", { data: [current] })
      const id = created?.data?.[0]?.details?.id || null
      if (!id) throw new Error(created?.data?.[0]?.message || "Lead create returned no id")
      return { id, dropped }
    } catch (err) {
      if (!isFieldError(err)) throw err
      // Never sacrifice a core field (name/phone/move data) to make a write pass.
      let name = offendingField(err)
      if (name && !DROPPABLE.has(name)) throw err
      if (!name || current[name] === undefined) {
        name = SACRIFICE_ORDER.find((k) => current[k] !== undefined)
      }
      if (!name) throw err
      delete current[name]
      dropped.push(name)
      console.warn(
        `Zoho rejected field "${name}" (${err.code || err.status}) — retrying without it. ` +
          `Create/fix the field on the Leads module to keep campaign attribution.`
      )
    }
  }
  throw new Error("Zoho lead write failed after dropping attribution fields")
}

// The 5 attribution values every website lead carries into CRM.
const attributionRecord = (attribution = {}, rawReferral = "") => ({
  Campaign_ID: clean(attribution.campaign_id),
  UTM_Source: clean(attribution.utm_source),
  UTM_Medium: clean(attribution.utm_medium),
  UTM_Campaign: clean(attribution.utm_campaign),
  GCLID: clean(attribution.gclid),
  // Normalised channel (playbook T3): Google Ads | Meta Ads | WhatsApp | ...
  Lead_Source: clean(deriveLeadSource(attribution, rawReferral)),
})

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
      SalesIQ_Visitor_ID: String(attribution.siq_visitor_id || "").slice(0, 100) || undefined,
      UTM_Term: String(attribution.utm_term || "").slice(0, 255) || undefined,
      UTM_Content: String(attribution.utm_content || "").slice(0, 255) || undefined,
      Landing_Page: String(attribution.landing_page || "").slice(0, 255) || undefined,
      Referrer_URL: String(attribution.referrer || "").slice(0, 255) || undefined,
      // T7 — campaign attribution (playbook §4 field mapping)
      ...attributionRecord(attribution, quote.referrals || quote.ref || ""),
    }
    const { id, dropped } = await writeLead(record, recordId)
    return { ok: true, leadId: id, droppedAttribution: dropped }
  } catch (e) {
    return { ok: false, error: e?.message || "Zoho sync failed" }
  }
}

// Generic non-quote inquiry (contact / feedback / job application) → Zoho Leads
// module, distinguished by How_did_you_hear_about_us. Carries the same T7
// attribution fields as quotes when the visitor arrived from a campaign.
export async function syncInquiryToZoho({ name, email, phone, source, notes, gclid, siq_visitor_id, attribution = {} } = {}) {
  if (!zohoConfigured()) {
    return { skipped: true }
  }
  try {
    // attribution = utils/attribution cookie (UTMs, campaign_id, landing, referrer).
    // Optional so existing callers (reviews, newsletter) keep working; explicit gclid/siq args win.
    const att = attribution || {}
    const g = gclid || att.gclid || ""
    const siq = siq_visitor_id || att.siq_visitor_id || ""
    const record = {
      First_Name: String(name || "Website Inquiry").slice(0, 80),
      Last_Name: undefined,
      Name: String(name || "Website Inquiry").slice(0, 100),
      Email: String(email || "").trim() || undefined,
      Phone: String(phone || "").slice(0, 30) || undefined,
      How_did_you_hear_about_us: String(source || "Website").slice(0, 100),
      Quote_Notes: String(notes || "").slice(0, 255) || undefined,
      SalesIQ_Visitor_ID: String(siq).slice(0, 100) || undefined,
      UTM_Term: String(att.utm_term || "").slice(0, 255) || undefined,
      UTM_Content: String(att.utm_content || "").slice(0, 255) || undefined,
      Landing_Page: String(att.landing_page || "").slice(0, 255) || undefined,
      Referrer_URL: String(att.referrer || "").slice(0, 255) || undefined,
      ...attributionRecord({ ...att, ...(g ? { gclid: g } : {}) }, source || ""),
    }
    const { id, dropped } = await writeLead(record, null)
    return { ok: true, leadId: id, droppedAttribution: dropped }
  } catch (e) {
    return { ok: false, error: e?.message || "Zoho sync failed" }
  }
}
