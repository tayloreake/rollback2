import { rateLimiter } from "./middleware/rateLimiter"

const limiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 })

// Newsletter signup (audit §5 P2): POST-only, named field, never GET.
// Capture order: (1) CRM Website Inquiries record (always works — nothing is
// ever lost), (2) Zoho Campaigns list when configured. Visitor always gets success.
import { subscribeNewsletter } from "../../utils/zohoCampaigns";
import { syncInquiryToZoho } from "../../utils/zoho";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }
  try {
    await limiter(req)
    const email = String(req.body?.email || "").trim().slice(0, 120)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" })
    }
    console.log("Newsletter signup:", email)
    // Option B (no Campaigns access on the account): every signup becomes a
    // Website Inquiries record (Lead_Source "Newsletter") — exportable to
    // Campaigns later in one bulk move.
    const crm = await syncInquiryToZoho({
      name: "Newsletter Subscriber",
      email,
      phone: "",
      source: "Newsletter",
      notes: "Website newsletter signup",
    }).catch((e) => ({ ok: false, error: e?.message }));
    if (!crm?.ok) console.warn("Newsletter CRM sync failed:", crm?.error || "unavailable");
    const sub = await subscribeNewsletter(email).catch((e) => ({ ok: false, error: e?.message }));
    if (!sub?.ok && !sub?.skipped) console.warn("Newsletter Campaigns sync failed:", sub?.error || "unavailable");
    const synced = Boolean(sub?.ok || crm?.ok);
    return res.status(200).json({ success: true, message: "Thanks for subscribing! You'll hear from us soon.", synced })
  } catch (e) {
    if (e?.message === "Too many requests") {
      return res.status(429).json({ success: false, message: "Too many requests. Please try again later." })
    }
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." })
  }
}
