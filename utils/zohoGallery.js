// Server-only Zoho Gallery reader (photo management lives in Zoho CRM's
// Website_Gallery section, managed by Marketing — attach the photo file to
// the record; Category should match a site gallery category name).
// Env: same ZOHO_* as lead sync. All functions degrade to [] when unconfigured.
import { zohoConfigured } from "./zoho"

const base = () => {
  const dc = process.env.ZOHO_DC || "com"
  return {
    com: "https://www.zohoapis.com",
    eu: "https://www.zohoapis.eu",
    in: "https://www.zohoapis.in",
  }[dc]
}

let cachedToken = null
let cachedExp = 0

async function accessToken() {
  if (cachedToken && Date.now() < cachedExp) return cachedToken
  const accounts = base().replace("www.zohoapis", "accounts.zoho")
  const p = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    grant_type: "refresh_token",
  })
  const r = await fetch(`${accounts}/oauth/v2/token?${p}`, { method: "POST" })
  const j = await r.json()
  if (!j?.access_token) throw new Error("Zoho token refresh failed")
  cachedToken = j.access_token
  cachedExp = Date.now() + 50 * 60 * 1000
  return cachedToken
}

const apiGet = async (path) => {
  const token = await accessToken()
  const r = await fetch(`${base()}/crm/v8${path}`, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  })
  return { status: r.status, json: await r.json().catch(() => ({})), headers: r.headers, raw: r }
}

// Visible gallery photos, newest first. Each entry carries its record id so
// the page can render it through /api/gallery-photo (token stays server-side).
export async function getGalleryPhotos() {
  if (!zohoConfigured()) return []
  try {
    const photos = []
    let page = 1
    for (;;) {
      const token = await accessToken()
      const r = await fetch(
        `${base()}/crm/v8/Website_Gallery?per_page=100&page=${page}&fields=Name,Category,Sort_Order,Visible,Created_Time`,
        { headers: { Authorization: `Zoho-oauthtoken ${token}` } }
      )
      const j = await r.json().catch(() => ({}))
      for (const x of j?.data || []) {
        if (x.Visible === false) continue
        photos.push({
          id: x.id,
          title: x.Name || "Gallery photo",
          category: x.Category || "General Moving",
          order: Number(x.Sort_Order) || 0,
          created: x.Created_Time || "",
        })
      }
      if (!j?.info?.more_records) break
      page++
      if (page > 10) break
    }
    // Verify each has at least one attachment (cheap: checked lazily by proxy instead)
    return photos.sort((a, b) => a.order - b.order || (a.created < b.created ? 1 : -1))
  } catch (e) {
    console.error("Zoho gallery read failed:", e?.message)
    return []
  }
}

export { apiGet, accessToken, base as zohoApiBase }
