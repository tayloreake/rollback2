// Server-only Zoho Campaigns sync for newsletter signups.
// Needs its own OAuth scope (ZohoCampaigns.contact.CREATE) — the CRM token
// does NOT carry it (verified: INVALID_OAUTHSCOPE).
// Env: ZOHO_CAMPAIGNS_REFRESH_TOKEN, ZOHO_CAMPAIGNS_LISTKEY,
// optional ZOHO_DC (com|eu|in). Unconfigured → { skipped: true }.
import { zohoConfigured } from "./zoho"

const CAMPAIGNS = {
  com: { accounts: "https://accounts.zoho.com", api: "https://campaigns.zoho.com" },
  eu: { accounts: "https://accounts.zoho.eu", api: "https://campaigns.zoho.eu" },
  in: { accounts: "https://accounts.zoho.in", api: "https://campaigns.zoho.in" },
}

let cached = null
let exp = 0

export const campaignsConfigured = () =>
  Boolean(process.env.ZOHO_CAMPAIGNS_REFRESH_TOKEN && process.env.ZOHO_CAMPAIGNS_LISTKEY)

async function token() {
  if (cached && Date.now() < exp) return cached
  const dc = process.env.ZOHO_DC || "com"
  // NOTE: the Campaigns refresh token belongs to its own OAuth client —
  // refresh with the Campaigns client id/secret, not the CRM ones.
  const p = new URLSearchParams({
    refresh_token: process.env.ZOHO_CAMPAIGNS_REFRESH_TOKEN,
    client_id: process.env.ZOHO_CAMPAIGNS_CLIENT_ID || process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CAMPAIGNS_CLIENT_SECRET || process.env.ZOHO_CLIENT_SECRET,
    grant_type: "refresh_token",
  })
  const r = await fetch(`${CAMPAIGNS[dc].accounts}/oauth/v2/token?${p}`, { method: "POST" })
  const j = await r.json()
  if (!j?.access_token) throw new Error("Campaigns token refresh failed")
  cached = j.access_token
  exp = Date.now() + 50 * 60 * 1000
  return cached
}

export async function subscribeNewsletter(email) {
  if (!campaignsConfigured()) return { skipped: true }
  try {
    const dc = process.env.ZOHO_DC || "com"
    const at = await token()
    // v1.1 expects the colon format: {First Name:x,Contact Email:y}
    const info = `{Contact Email:${email}}`
    const form = new URLSearchParams({
      resfmt: "JSON",
      listkey: process.env.ZOHO_CAMPAIGNS_LISTKEY,
      contactinfo: info,
    })
    const r = await fetch(`${CAMPAIGNS[dc].api}/api/v1.1/json/listsubscribe?${form.toString()}`, {
      method: "POST",
      headers: { Authorization: `Zoho-oauthtoken ${at}` },
    })
    const j = await r.json().catch(() => ({}))
    if (j.status === "error") throw new Error(j.message || "Campaigns subscribe failed")
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e?.message }
  }
}

export { zohoConfigured }
