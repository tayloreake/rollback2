// Server-only Zoho CRM sync (Sanity Security §2).
// Writes website quotes to the Zoho Leads module — never to Sanity production.
// Env required: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN,
// optional ZOHO_DC ("com" | "eu" | "in", default "com").
// recaptchaScore is intentionally never sent. Failures returned, never thrown.

import { deriveLeadSource, derivePlatform } from "./attribution"

const DC = {
  com: { accounts: "https://accounts.zoho.com", api: "https://www.zohoapis.com" },
  eu: { accounts: "https://accounts.zoho.eu", api: "https://www.zohoapis.eu" },
  in: { accounts: "https://accounts.zoho.in", api: "https://www.zohoapis.in" },
}

let cachedToken = null
let cachedExp = 0

const base = () => DC[process.env.ZOHO_DC] || DC.com

const REQUIRED_ENV = ["ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN"]

const missingZohoEnv = () => REQUIRED_ENV.filter((k) => !process.env[k])

export const zohoConfigured = () => missingZohoEnv().length === 0

// A missing runtime variable used to make every form silently succeed while
// no lead reached the CRM. Never let that happen quietly again: the server log
// must say exactly which variable is missing (names only, never values).
function warnNotConfigured(scope) {
  const missing = missingZohoEnv()
  if (!missing.length) return
  console.error(
    `[zoho] ${scope}: CRM sync SKIPPED — missing runtime env ${missing.join(", ")}. ` +
      `The visitor was handled, but NO lead was written to Zoho. ` +
      `Set these variables in the deployment (Vercel → Project → Settings → Environment Variables) and redeploy.`
  )
}

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
const ATTRIBUTION_FIELDS = [
  "Campaign_ID",
  "Campaign_Name",
  "Advert_ID",
  "Advert_Name",
  "AdGroup_Name",
  "Click_Type",
  "Device_Type",
  "Ad_Network",
  "Ad_Account_Name",
  "Platform",
  "Keyword",
  "Form_Name",
  "Form_ID",
  "Page_Name",
  "UTM_Source",
  "UTM_Medium",
  "UTM_Campaign",
  "UTM_Term",
  "UTM_Content",
  "GCLID",
  "Google_Click_ID",
  "FB_Click_ID",
  "Referrer_URL",
  "Lead_Source",
]
// Fields that identify the lead itself. Zoho's Leads module mandates
// Last_Name; everything else is optional and may be dropped, so a CRM schema
// mismatch can never cost us a lead.
const CORE_FIELDS = new Set(["First_Name", "Last_Name", "Email", "Phone"])
// Least critical first: the order we sacrifice optional fields when Zoho
// rejects the record without naming the field. Keep the Zoho `$gclid` property
// and Google_Click_ID until last because Google Ads attribution depends on them.
const SACRIFICE_ORDER = [
  "Description",
  // Lead_Source is the coarse channel; Platform carries the granular source
  // (Google Ads vs Google Organic vs Facebook Organic). If Zoho rejects a new
  // picklist value, drop the coarse field first so the granular one survives.
  "Lead_Source",
  "Form_ID",
  "Form_Name",
  "Page_Name",
  "Referrer_URL",
  "UTM_Content",
  "UTM_Term",
  "UTM_Medium",
  "UTM_Campaign",
  "UTM_Source",
  "Ad_Account_Name",
  "Platform",
  "Advert_Name",
  "AdGroup_Name",
  "Click_Type",
  "Device_Type",
  "Ad_Network",
  "Keyword",
  "Campaign_Name",
  // The legacy custom `GCLID` field is accepted by this org's API but stored
  // as null. Zoho's Google Ads integration reads the special `$gclid` API
  // property; preserve it and the durable custom field as long as possible.
  "GCLID",
  "How_did_you_hear_about_us",
  "Property_Size",
  "Move_Types",
  "Destination_Address_Street_Address",
  "Origin_Address_Street_Address",
  "Proposed_Move_Date",
  "Advert_ID",
  "Campaign_ID",
  "FB_Click_ID",
  "$gclid",
  "Google_Click_ID",
  "Lead_Status",
]
const isDroppable = (name) => !CORE_FIELDS.has(name)

const clean = (value, max = 100) => {
  const s = String(value || "").trim()
  return s ? s.slice(0, max) : undefined
}

// Split a display name into Zoho's First_Name / Last_Name pair.
// Zoho Leads mandates Last_Name but not First_Name, so a single token becomes
// Last_Name (mirrors splitFullName in utils/leadNotify.js).
const splitName = (raw, max = 80) => {
  const parts = String(raw || "").trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return { firstName: "", lastName: "" }
  if (parts.length === 1) return { firstName: "", lastName: parts[0].slice(0, max) }
  return {
    firstName: parts[0].slice(0, max),
    lastName: parts.slice(1).join(" ").slice(0, max),
  }
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
      // Never sacrifice a core field (name/phone) to make a write pass.
      let name = offendingField(err)
      if (name && !isDroppable(name)) throw err
      if (!name || current[name] === undefined) {
        name = SACRIFICE_ORDER.find((k) => current[k] !== undefined && isDroppable(k))
      }
      // Last resort: drop any remaining optional field so a future CRM schema
      // change cannot block the lead entirely.
      if (!name) name = Object.keys(current).find((k) => k !== "id" && isDroppable(k))
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

// Every attribution value a website lead carries into CRM. Fields are
// optional extras: a schema mismatch drops only the offending field.
const attributionRecord = (attribution = {}, rawReferral = "", form = {}) => {
  const utmContent = String(attribution.utm_content || "").trim()
  // For Meta, utm_content is usually the ad id/name; store a numeric value in
  // Advert_ID as well as the human-readable Advert_Name.
  const advertId =
    attribution.ad_id ||
    attribution.creative ||
    (/^\d+$/.test(utmContent) ? utmContent : "")
  const clickId =
    attribution.gclid ||
    attribution.gbraid ||
    attribution.wbraid ||
    attribution.dclid ||
    ""
  const referrer = String(attribution.referrer || "").trim()
  const externalReferrer = referrer && !/taylorea\.com/i.test(referrer) ? referrer : ""
  const platform = derivePlatform(attribution)
  return {
    // The actual ad/campaign identity. Google Ads ValueTrack params
    // ({campaignid}, {creative}, {keyword}) and Meta dynamic params both land
    // in these fields.
    Campaign_ID: clean(attribution.campaign_id || attribution.campaignid || attribution.utm_id, 255),
    Campaign_Name: clean(attribution.campaign_name || attribution.utm_campaign || attribution.campaign, 255),
    Advert_ID: clean(advertId, 255),
    Advert_Name: clean(attribution.ad_name || utmContent, 255),
    AdGroup_Name: clean(attribution.adgroup_name || attribution.ad_group_name, 255),
    Click_Type: clean(attribution.click_type, 100),
    Device_Type: clean(attribution.device, 100),
    Ad_Network: clean(attribution.network, 100),
    // Ad_Account_Name is only meaningful for paid platforms; Platform always
    // carries the granular source (including organic/direct/referral).
    Ad_Account_Name: clean(/(^| )Ads$/.test(platform) ? platform : "", 255),
    Platform: clean(platform, 255),
    Keyword: clean(attribution.keyword || attribution.utm_term, 250),
    // Which form produced the lead and where it was submitted.
    Form_Name: clean(form.name, 255),
    Form_ID: clean(form.id, 255),
    Page_Name: clean(attribution.landing_page, 255),
    // Standard UTMs.
    UTM_Source: clean(attribution.utm_source, 100),
    UTM_Medium: clean(attribution.utm_medium, 100),
    UTM_Campaign: clean(attribution.utm_campaign, 255),
    UTM_Term: clean(attribution.utm_term, 255),
    UTM_Content: clean(attribution.utm_content, 255),
    // Click ids used for offline conversion matching. GCLID is the legacy
    // custom field (Zoho stores it null); `$gclid` feeds the Zoho Google Ads
    // integration, while Google_Click_ID is our durable custom copy.
    GCLID: clean(attribution.gclid, 150),
    "$gclid": clean(attribution.gclid, 255),
    Google_Click_ID: clean(clickId, 255),
    FB_Click_ID: clean(attribution.fbclid, 255),
    Referrer_URL: clean(externalReferrer, 255),
    // Coarse channel (playbook T3) plus the granular Platform above.
    Lead_Source: clean(deriveLeadSource(attribution, rawReferral), 100),
  }
}

export async function syncQuoteToZoho(quote = {}, attribution = {}) {
  if (!zohoConfigured()) {
    warnNotConfigured("syncQuoteToZoho")
    return { skipped: true, reason: "not_configured", missing: missingZohoEnv() }
  }
  try {
    const email = String(quote.email || "").trim()
    // Split firstName / lastName. Zoho Leads mandates Last_Name but not
    // First_Name, so a single-name submission still becomes a valid lead.
    let firstName = String(quote.firstName || "").trim().slice(0, 80)
    let lastName = String(quote.lastName || "").trim().slice(0, 80)
    if (!lastName && firstName) {
      const split = splitName(firstName)
      firstName = split.firstName
      lastName = split.lastName
    }
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
    // Every field below exists on this org's Leads module. Attribution fields
    // are still treated as optional extras by writeLead(), so a future CRM
    // schema change drops one field instead of the whole lead.
    const record = {
      First_Name: firstName || undefined,
      Last_Name: lastName || firstName || "Website Lead",
      Email: email || undefined,
      Phone: String(quote.phoneNumber || "").slice(0, 30) || undefined,
      How_did_you_hear_about_us: String(quote.referrals || quote.ref || "Website").slice(0, 100),
      Move_Types: String(quote.moveType || "").slice(0, 100) || undefined,
      Origin_Address_Street_Address: String(quote.location || "").slice(0, 255) || undefined,
      Destination_Address_Street_Address: String(quote.destination || "").slice(0, 255) || undefined,
      Property_Size: String(quote.bedrooms || "").slice(0, 100) || undefined,
      Proposed_Move_Date: String(quote.moveDate || "").slice(0, 50) || undefined,
      // Zoho leaves this null on API-created leads, which hides them from
      // status-filtered views ("My Open Leads" etc.). Set the standard
      // starting status explicitly.
      Lead_Status: "Not Contacted",
      // T7 — campaign + ad attribution (playbook §4 field mapping)
      ...attributionRecord(attribution, quote.referrals || quote.ref || "", {
        name: "Quote Form",
        id: "quote",
      }),
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
export async function syncInquiryToZoho({ name, email, phone, source, notes, gclid, attribution = {} } = {}) {
  if (!zohoConfigured()) {
    warnNotConfigured("syncInquiryToZoho")
    return { skipped: true, reason: "not_configured", missing: missingZohoEnv() }
  }
  try {
    // attribution = utils/attribution cookie (UTMs, campaign_id, landing, referrer).
    // Optional so existing callers (reviews, newsletter) keep working; explicit gclid/siq args win.
    const att = attribution || {}
    const g = gclid || att.gclid || ""
    const full = String(name || "").trim()
    const split = splitName(full)
    const formName = String(source || "Website Inquiry").slice(0, 255)
    const formId = formName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "inquiry"
    // Every field below exists on this org's Leads module. Description is the
    // standard notes field; attribution extras are dropped individually if a
    // future schema change rejects one.
    const record = {
      First_Name: split.firstName || undefined,
      // Zoho Leads mandates Last_Name.
      Last_Name: split.lastName || full.slice(0, 80) || "Website Inquiry",
      Email: String(email || "").trim() || undefined,
      Phone: String(phone || "").slice(0, 30) || undefined,
      How_did_you_hear_about_us: String(source || "Website").slice(0, 100),
      Description: String(notes || "").slice(0, 500) || undefined,
      // Without a status, API-created leads are hidden by status-filtered views.
      Lead_Status: "Not Contacted",
      ...attributionRecord({ ...att, ...(g ? { gclid: g } : {}) }, source || "", {
        name: formName,
        id: formId,
      }),
    }
    const { id, dropped } = await writeLead(record, null)
    return { ok: true, leadId: id, droppedAttribution: dropped }
  } catch (e) {
    return { ok: false, error: e?.message || "Zoho sync failed" }
  }
}

// Read-only production diagnostic: proves the deployed environment can mint a
// token AND read the Leads module. Deliberately never writes a record, so it is
// safe to call at any time. Exposed via /api/zoho-health.
export async function zohoHealth() {
  const missing = missingZohoEnv()
  const dc = process.env.ZOHO_DC || "com"
  if (missing.length) return { ok: false, configured: false, dc, missing }

  const signal =
    typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
      ? AbortSignal.timeout(10000)
      : undefined

  try {
    const token = await getAccessToken()
    const r = await fetch(`${base().api}/crm/v8/Leads?fields=Last_Name&per_page=1`, {
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
      signal,
    })
    const text = await r.text()
    let parsed = null
    try { parsed = text ? JSON.parse(text) : null } catch { /* non-JSON body */ }
    if (!r.ok) {
      return {
        ok: false,
        configured: true,
        dc,
        token: true,
        leads: false,
        status: r.status,
        code: parsed?.code || null,
        message: String(parsed?.message || text.slice(0, 200) || r.statusText).slice(0, 300),
      }
    }
    return { ok: true, configured: true, dc, token: true, leads: true, status: r.status }
  } catch (e) {
    return {
      ok: false,
      configured: true,
      dc,
      token: false,
      leads: false,
      message: String(e?.message || e).slice(0, 300),
    }
  }
}
