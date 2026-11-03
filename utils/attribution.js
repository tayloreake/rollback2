// First-touch marketing attribution in a first-party cookie (90 days).
// Captures utm_*, ad-platform click ids, campaign/ad identifiers, landing page
// and referrer so every lead carries both its channel and the actual ad that
// produced it (audit §1 P1, playbook T7).

const COOKIE = "tm_attr"
const DAYS = 90

// Fields rendered as hidden inputs on website forms. The server payload is
// built from getFormAttribution(), so the DOM and the CRM row always agree.
// Keep in sync with components/AttributionHiddenFields.jsx.
export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "dclid",
  "fbclid",
  "msclkid",
  "ttclid",
  "twclid",
  "li_fat_id",
  "campaign_id",
  "campaign_name",
  "ad_id",
  "ad_name",
  "adset_id",
  "adset_name",
  "keyword",
  "matchtype",
  "network",
  "device",
  "landing_page",
  "referrer",
]

const COMPUTED_KEYS = new Set(["landing_page", "referrer", "platform", "first_seen", "siq_visitor_id"])

// Every URL parameter persisted on first touch. Google Ads ValueTrack
// (campaign_id/ad_id/keyword/…), Meta dynamic params and each ad platform's
// click id are all supported.
const URL_KEYS = [
  ...ATTRIBUTION_KEYS.filter((k) => !COMPUTED_KEYS.has(k)),
  "utm_id",
  "creative",
  "adgroup_id",
  "campaign",
  "placement",
]

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
    const ref = document.referrer || ""
    const incoming = {
      ...currentParams(),
      landing_page: window.location.pathname,
      // Ignore same-site referrers: they describe navigation inside the site,
      // not the channel that acquired the visitor.
      referrer: ref && !ref.includes(window.location.host) ? ref : "",
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

// Zoho SalesIQ visitor id (uvid). Not a documented getter, so fully guarded:
// empty string until the widget has loaded (it loads after consent).
export const getSalesIQVisitorId = () => {
  try {
    const vis = typeof window !== "undefined" && window.$zoho && window.$zoho.salesiq && window.$zoho.salesiq.visitor
    const id = vis && typeof vis.uniqueid === "function" ? vis.uniqueid() : ""
    return typeof id === "string" ? id.slice(0, 100) : ""
  } catch { return "" }
}

export const getAttribution = () => {
  try {
    const raw = readCookie(COOKIE)
    const base = raw ? JSON.parse(raw) : {}
    // Zoho zcga.js writes the Google Ads click id into #zc_gad; prefer it when present.
    const gad = typeof document !== "undefined" ? (document.getElementById("zc_gad")?.value || "") : ""
    const siq = getSalesIQVisitorId()
    const attr = { ...base, ...(gad ? { gclid: gad } : {}), ...(siq ? { siq_visitor_id: siq } : {}) }
    attr.platform = derivePlatform(attr)
    return attr
  } catch { return {} }
}

// What the forms put in their hidden inputs and send to the APIs: stored
// first-touch attribution with URL params filling any gap (cookie blocked /
// not yet written).
export const getFormAttribution = () => {
  const stored = getAttribution()
  const url = currentParams()
  const out = { ...stored }
  for (const k of Object.keys(url)) out[k] = stored[k] || url[k] || ""
  // Always derive from the merged first-touch + current URL values.
  out.platform = derivePlatform(out)
  return out
}

const lower = (v) => String(v || "").toLowerCase().trim()
const PAID_MEDIUM = /(cpc|ppc|paid|display|video|shopping|pmax|performance|retarget)/

const referrerHost = (value) => {
  try {
    return new URL(String(value || "")).hostname.toLowerCase()
  } catch {
    return ""
  }
}

// Granular acquisition platform. This is what answers "Google search vs
// Google Ads vs Facebook" on the CRM record.
export function derivePlatform(attribution = {}) {
  const src = lower(attribution.utm_source)
  const med = lower(attribution.utm_medium)
  const refHost = referrerHost(attribution.referrer)
  const hasGoogleClick = Boolean(
    attribution.gclid || attribution.gbraid || attribution.wbraid || attribution.dclid
  )
  const hasFbClick = Boolean(attribution.fbclid)
  const hasMsClick = Boolean(attribution.msclkid)
  const hasTtClick = Boolean(attribution.ttclid)
  const hasTwClick = Boolean(attribution.twclid)
  const hasLiClick = Boolean(attribution.li_fat_id)
  const paid = PAID_MEDIUM.test(med)
  const hasGoogleAdParam = Boolean(attribution.campaign_id || attribution.ad_id || attribution.adgroup_id)

  // Explicit paid click ids are the strongest signal.
  if (hasGoogleClick) return "Google Ads"
  if (hasFbClick) return src.includes("instagram") ? "Instagram Ads" : "Facebook Ads"
  if (hasMsClick) return "Microsoft Ads"
  if (hasTtClick) return "TikTok Ads"
  if (hasTwClick) return "X Ads"
  if (hasLiClick) return "LinkedIn Ads"

  if (src.includes("google") || src.includes("adwords")) {
    return paid || hasGoogleAdParam ? "Google Ads" : "Google Organic"
  }
  if (src.includes("facebook") || src.includes("meta")) {
    return paid ? "Facebook Ads" : "Facebook Organic"
  }
  if (src.includes("instagram")) {
    return paid ? "Instagram Ads" : "Instagram Organic"
  }
  if (src.includes("bing") || src.includes("microsoft")) {
    return paid ? "Microsoft Ads" : "Bing Organic"
  }
  if (src.includes("tiktok")) return paid ? "TikTok Ads" : "TikTok Organic"
  if (src.includes("twitter") || src === "x" || src.includes("x.com")) return paid ? "X Ads" : "X Organic"
  if (src.includes("linkedin")) return paid ? "LinkedIn Ads" : "LinkedIn Organic"
  if (src.includes("whatsapp")) return "WhatsApp"
  if (src.includes("gbp") || src.includes("google business") || src.includes("google_business")) return "Google Business Profile"
  if (src.includes("email") || med === "email") return "Email"
  if (src.includes("referral") || med === "referral") return "Referral"

  // No usable UTM: fall back to the referrer host.
  if (refHost && !refHost.endsWith("taylorea.com")) {
    if (/(^|\.)google\.[a-z.]+$/.test(refHost)) return "Google Organic"
    if (/(^|\.)bing\.com$/.test(refHost)) return "Bing Organic"
    if (/(^|\.)facebook\.com$/.test(refHost)) return "Facebook Organic"
    if (/(^|\.)instagram\.com$/.test(refHost)) return "Instagram Organic"
    if (/(^|\.)linkedin\.com$/.test(refHost)) return "LinkedIn Organic"
    if (/(^|\.)tiktok\.com$/.test(refHost)) return "TikTok Organic"
    if (/(^|\.)(twitter|x)\.com$/.test(refHost)) return "X Organic"
    return "Referral"
  }
  return "Direct"
}

// Campaign data first, the visitor's own "how did you hear about us" answer
// second. Returns the granular channel used by GTM/GA4 (and mirrored in the
// Zoho `Platform` field). Organic Google search is deliberately NOT labelled
// "Google Ads" — only a click id or paid medium proves a paid click.
export function deriveLeadSource(attribution = {}, rawReferral = "") {
  const platform = derivePlatform(attribution)
  const channel = {
    "Google Ads": "Google Ads",
    "Google Organic": "Google Organic",
    "Facebook Ads": "Meta Ads",
    "Instagram Ads": "Meta Ads",
    "Facebook Organic": "Social Media Marketing",
    "Instagram Organic": "Social Media Marketing",
    "Microsoft Ads": "Microsoft Ads",
    "Bing Organic": "Bing Organic",
    "TikTok Ads": "TikTok Ads",
    "TikTok Organic": "TikTok Organic",
    "X Ads": "X Ads",
    "X Organic": "X Organic",
    "LinkedIn Ads": "LinkedIn Ads",
    "LinkedIn Organic": "LinkedIn Organic",
    "WhatsApp": "WhatsApp",
    "Google Business Profile": "Google Business Profile",
    "Email": "Email",
    "Referral": "Referral",
    "Direct": "Websites",
  }[platform] || "Other"

  if (channel !== "Websites") return channel

  // No campaign or external referrer: use the visitor's own answer, but never
  // call an organic "Internet Search" answer a Google Ads conversion.
  const s = lower(rawReferral)
  if (!s) return "Websites"
  if (/(internet|google|search|web research)/.test(s)) return "Google Organic"
  if (/(facebook|meta|instagram|social)/.test(s)) return "Social Media Marketing"
  if (/(whatsapp|wa\.)/.test(s)) return "WhatsApp"
  if (/(referral|refferal|realtor|word of mouth)/.test(s)) return "Referral"
  if (/(previuos|previous|repeat)/.test(s)) return "Repeat Client"
  if (/(door|truck|newspaper|pamphlet)/.test(s)) return "Other"
  return "Websites"
}
