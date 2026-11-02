// First-touch marketing attribution in a first-party cookie (90 days).
// Captures utm_*, gclid, fbclid, campaign_id, landing page and referrer
// so every lead carries its channel (audit §1 P1, playbook T7).

const COOKIE = "tm_attr"
const DAYS = 90

// The 5 fields every lead must carry into Zoho CRM (playbook T7).
// Keep in sync with components/AttributionHiddenFields.jsx.
export const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "gclid", "campaign_id"]

const URL_KEYS = [...ATTRIBUTION_KEYS, "utm_term", "utm_content", "fbclid"]

const readCookie = (name) => {
  if (typeof document === "undefined") return null
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
  return m ? decodeURIComponent(m[2]) : null
}

const writeCookie = (name, value) => {
  if (typeof document === "undefined") return
  const d = new Date()
  d.setDate(d.getDate() + DAYS)
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/; SameSite=Lax`
}

// Current URL query params as a flat object ("" when absent).
const currentParams = () => {
  const out = {}
  if (typeof window === "undefined") return out
  try {
    const q = new URLSearchParams(window.location.search)
    for (const k of URL_KEYS) out[k] = q.get(k) || ""
  } catch { /* no-op */ }
  return out
}

const readStored = () => {
  try {
    const raw = readCookie(COOKIE)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch { return {} }
}

export const initAttribution = () => {
  if (typeof window === "undefined") return
  try {
    const existing = readStored()
    const incoming = {
      ...currentParams(),
      landing_page: window.location.pathname,
      referrer: document.referrer || "",
      first_seen: new Date().toISOString(),
    }
    // First NON-EMPTY touch wins per field. A visitor who lands organically
    // (no params) must not lock the cookie to empty forever — otherwise the
    // later ad click carrying ?campaign_id=... would be ignored and the lead
    // ships unattributed (this is what the playbook test plan hits).
    const attr = {}
    for (const k of new Set([...Object.keys(existing), ...Object.keys(incoming)])) {
      attr[k] = existing[k] || incoming[k] || ""
    }
    writeCookie(COOKIE, JSON.stringify(attr))
  } catch { /* no-op */ }
}

export const getAttribution = () => {
  try {
    const raw = readCookie(COOKIE)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

// What the forms put in their hidden inputs: stored first-touch attribution
// with URL params filling any gap (cookie blocked / not yet written).
export const getFormAttribution = () => {
  const stored = getAttribution()
  const url = currentParams()
  const out = { ...stored }
  for (const k of Object.keys(url)) out[k] = stored[k] || url[k] || ""
  return out
}

// Campaign data first, the visitor's own "how did you hear about us" answer
// second, normalised to the Growth OS channel set (playbook T3):
// Google Ads | Meta Ads | WhatsApp | Google Business Profile | Referral | Email | Other
export function deriveLeadSource(attribution = {}, rawReferral = "") {
  const src = String(attribution.utm_source || "").toLowerCase()
  const medium = String(attribution.utm_medium || "").toLowerCase()
  const hasGclid = Boolean(attribution.gclid)
  const hasFbclid = Boolean(attribution.fbclid)

  if (src.includes("whatsapp")) return "WhatsApp"
  if (src.includes("meta") || src.includes("facebook") || src.includes("instagram") || hasFbclid) return "Meta Ads"
  if (src.includes("gbp") || src.includes("google business")) return "Google Business Profile"
  if (src.includes("google") || hasGclid) return "Google Ads"
  if (src.includes("email") || medium === "email") return "Email"
  if (src.includes("referral")) return "Referral"

  const s = String(rawReferral || "").trim().toLowerCase()
  if (!s) return "Other"
  if (s.includes("web") || s.includes("google") || s.includes("research") || s.includes("search")) return "Google Ads"
  if (s.includes("fb") || s.includes("facebook") || s.includes("meta") || s.includes("social")) return "Meta Ads"
  if (s.includes("whatsapp") || s.includes("wa.")) return "WhatsApp"
  if (s.includes("referral") || s.includes("realtor")) return "Referral"
  return "Other"
}
