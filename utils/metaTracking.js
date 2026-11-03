// Client helpers for Meta Pixel + Conversions API deduplication (T15b).
// One eventId is created per quote submission and used in three places:
// the browser pixel (via the dataLayer push), the server CAPI call, and the
// request body. Meta dedupes on event_name + event_id.

const getCookie = (name) => {
  try {
    const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"))
    return m ? decodeURIComponent(m[1]) : ""
  } catch {
    return ""
  }
}

export const newEventId = () => {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return `lead-${crypto.randomUUID()}`
  } catch {}
  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const hasAdsConsent = () => {
  try {
    const raw = localStorage.getItem("tm-consent-v1")
    return !!(raw && JSON.parse(raw)?.ads)
  } catch {
    return false
  }
}

// Sent with the quote request. The server sends to CAPI only if adsConsent is true.
export const getMetaContext = (eventId) => ({
  eventId,
  adsConsent: hasAdsConsent(),
  fbp: getCookie("_fbp"),
  fbc: getCookie("_fbc"),
  sourceUrl: typeof window !== "undefined" ? window.location.href : "",
})
