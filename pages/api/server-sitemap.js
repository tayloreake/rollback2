import { createClient } from "next-sanity"
import clientConfig from "../../sanity/config/client-config"

// Serves /server-sitemap.xml (rewritten from /server-sitemap.xml in
// next.config.js) listing Sanity blog posts. Fixes the 404 in robots.txt
// and the sitemap index (audit §4 P1).
export default async function handler(req, res) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taylorea.com"
  let posts = []
  try {
    posts = await createClient(clientConfig).fetch(
      `*[_type == "blogs" && defined(slug.current) && !(_id in path('drafts.**'))]{ "slug": slug.current, _updatedAt } | order(_updatedAt desc)[0...500]`
    )
  } catch (e) {
    console.error("server-sitemap fetch failed:", e?.message)
  }
  const esc = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
  const urls = (posts || [])
    .filter((p) => p?.slug && /^[A-Za-z0-9_-]+$/.test(p.slug))
    .map(
      (p) =>
        `  <url><loc>${siteUrl}/blog/${esc(p.slug)}</loc>` +
        (p._updatedAt ? `<lastmod>${esc(p._updatedAt)}</lastmod>` : "") +
        `</url>`
    )
    .join("\n")
  res.setHeader("Content-Type", "application/xml")
  res.status(200).send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
  )
}
