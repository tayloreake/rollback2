// Meta Conversions API (server side) for the quote "Lead" event (T15b).
// Disabled unless META_PIXEL_ID (or NEXT_PUBLIC_META_PIXEL_ID) and
// META_CAPI_ACCESS_TOKEN are set. Sends only when the visitor granted ads consent.
import crypto from "crypto"

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v23.0"

const sha256 = (v) => crypto.createHash("sha256").update(v).digest("hex")

const normEmail = (e) => (e ? sha256(String(e).trim().toLowerCase()) : null)

// E.164 digits only (no plus). Default country Kenya (254) for local numbers.
const normPhone = (p) => {
  if (!p) return null
  let d = String(p).replace(/[^\d+]/g, "")
  const plus = d.startsWith("+")
  d = d.replace(/\D/g, "")
  if (!d) return null
  if (!plus) {
    if (d.startsWith("00")) d = d.slice(2)
    else if (d.startsWith("0")) d = "254" + d.slice(1)
    else if (d.length === 9) d = "254" + d
  }
  return sha256(d)
}

const normName = (n) => (n ? sha256(String(n).trim().toLowerCase().split(/\s+/)[0]) : null)

export const isMetaCapiConfigured = () =>
  !!((process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID) && process.env.META_CAPI_ACCESS_TOKEN)

export async function sendLeadToMeta({ quoteData = {}, meta = {}, ip, userAgent }) {
  const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID
  const token = process.env.META_CAPI_ACCESS_TOKEN
  if (!pixelId || !token) return { ok: false, skipped: "not_configured" }
  if (!meta.adsConsent) return { ok: false, skipped: "no_consent" }
  if (!meta.eventId) return { ok: false, skipped: "no_event_id" }

  const fbclid = quoteData?.attribution?.fbclid
  const fbc = meta.fbc || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined)

  const user_data = {}
  const em = normEmail(quoteData.email)
  const ph = normPhone(quoteData.phoneNumber)
  const fn = normName(quoteData.firstName)
  if (em) user_data.em = [em]
  if (ph) user_data.ph = [ph]
  if (fn) user_data.fn = [fn]
  user_data.country = [sha256("ke")]
  if (ip) user_data.client_ip_address = ip
  if (userAgent) user_data.client_user_agent = userAgent
  if (meta.fbp) user_data.fbp = meta.fbp
  if (fbc) user_data.fbc = fbc

  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: meta.eventId,
        action_source: "website",
        event_source_url: meta.sourceUrl || undefined,
        user_data,
        custom_data: {
          content_category: quoteData.moveType || undefined,
          form_id: "quote",
        },
      },
    ],
  }
  if (process.env.META_CAPI_TEST_EVENT_CODE) body.test_event_code = process.env.META_CAPI_TEST_EVENT_CODE

  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 4000)
    const r = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctrl.signal }
    )
    clearTimeout(t)
    const j = await r.json().catch(() => ({}))
    if (!r.ok) return { ok: false, error: j?.error?.message || `HTTP ${r.status}` }
    return { ok: true, received: j?.events_received }
  } catch (e) {
    return { ok: false, error: e?.name === "AbortError" ? "timeout" : e?.message }
  }
}
