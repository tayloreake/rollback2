// First-touch marketing attribution in a first-party cookie (90 days).
// Captures utm_*, gclid, fbclid, campaign_id, landing page and referrer
// so every lead carries its channel (audit §1 P1).

const COOKIE = "tm_attr"
const DAYS = 90

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

export const initAttribution = () => {
  if (typeof window === "undefined") return
  try {
    if (readCookie(COOKIE)) return // first touch wins
    const q = new URLSearchParams(window.location.search)
    const get = (k) => q.get(k) || ""
    const attr = {
      utm_source: get("utm_source"),
      utm_medium: get("utm_medium"),
      utm_campaign: get("utm_campaign"),
      utm_term: get("utm_term"),
      utm_content: get("utm_content"),
      gclid: get("gclid"),
      fbclid: get("fbclid"),
      campaign_id: get("campaign_id"),
      landing_page: window.location.pathname,
      referrer: document.referrer || "",
      first_seen: new Date().toISOString(),
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
    return { ...base, ...(gad ? { gclid: gad } : {}), ...(siq ? { siq_visitor_id: siq } : {}) }
  } catch { return {} }
}
