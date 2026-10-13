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

export const getAttribution = () => {
  try {
    const raw = readCookie(COOKIE)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}
