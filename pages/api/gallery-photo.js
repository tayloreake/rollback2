// Streams a Zoho Website_Gallery attachment to the browser so Marketing can
// manage gallery photos inside Zoho CRM while the OAuth token stays server-side.
// Usage: /api/gallery-photo?record=<numeric id>  (first image attachment wins)
import { zohoConfigured, apiGet, accessToken, zohoApiBase } from "../../utils/zohoGallery"

export default async function handler(req, res) {
  const record = String(req.query.record || "")
  if (!/^\d{10,25}$/.test(record)) {
    return res.status(400).json({ success: false, message: "Invalid record id" })
  }
  if (!zohoConfigured()) {
    return res.status(503).json({ success: false, message: "Gallery backend not configured" })
  }
  try {
    const list = await apiGet(`/Website_Gallery/${record}/Attachments?fields=id,File_Name`)
    const files = (list.json?.data || []).filter((f) =>
      /\.(png|jpe?g|webp|gif)$/i.test(f.File_Name || "")
    )
    if (!files.length) {
      return res.status(404).json({ success: false, message: "No photo attached" })
    }
    const token = await accessToken()
    const dl = await fetch(`${zohoApiBase()}/crm/v8/Website_Gallery/${record}/Attachments/${files[0].id}`, {
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
    })
    if (!dl.ok) {
      return res.status(502).json({ success: false, message: "Photo unavailable" })
    }
    const buf = Buffer.from(await dl.arrayBuffer())
    res.setHeader("Content-Type", dl.headers.get("content-type") || "image/jpeg")
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800")
    return res.status(200).send(buf)
  } catch (e) {
    console.error("gallery-photo proxy failed:", e?.message)
    return res.status(502).json({ success: false, message: "Photo unavailable" })
  }
}
