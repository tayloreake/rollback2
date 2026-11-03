import { zohoHealth } from "../../utils/zoho"

// Read-only deployment check: does the running environment have the Zoho
// credentials, can it mint a token, and can it read the Leads module?
// It never creates or changes a record.
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }

  // Optional shared secret so a public deployment doesn't advertise its CRM
  // plumbing. When the variable is absent the probe stays available (read-only).
  const expected = process.env.ZOHO_HEALTH_KEY
  if (expected && req.query?.key !== expected) {
    return res.status(401).json({ success: false, message: "Unauthorized" })
  }

  res.setHeader("Cache-Control", "no-store, max-age=0")
  const result = await zohoHealth()
  return res.status(result.ok ? 200 : 503).json({
    ...result,
    checkedAt: new Date().toISOString(),
  })
}
