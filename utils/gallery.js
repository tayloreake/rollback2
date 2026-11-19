import { GALLERY_CATEGORIES } from "./galleryCategories.js"

// Optimised Sanity CDN URL (Sanity resizes + serves WebP/AVIF on the fly).
export const sanityImageUrl = (url, width = 600, quality = 75) =>
  url ? `${url}?w=${width}&auto=format&q=${quality}` : ""

// Build the gallery view model.
//  albums: Sanity `galleryAlbum` documents (see getGalleryAlbums)
//  legacy: images shipped in /public/assets/gallery (all are office moves).
// Legacy images are only used until Sanity has photos, so the page is never empty
// during the migration and never shows duplicates afterwards.
export function buildGallery({ albums = [], legacy = [] } = {}) {
  const byId = new Map(GALLERY_CATEGORIES.map((c) => [c.id, { ...c, items: [] }]))
  let sanityCount = 0

  for (const album of albums || []) {
    const cat = byId.get(album?.category)
    if (!cat) continue
    for (const img of album.images || []) {
      if (!img?.url) continue
      sanityCount++
      cat.items.push({
        key: img._key || `${album._id}-${cat.items.length}`,
        kind: "sanity",
        src: img.url,
        width: img.width || 4,
        height: img.height || 3,
        lqip: img.lqip || "",
        alt: img.alt || [album.title, cat.title].filter(Boolean).join(" - "),
        caption: img.caption || "",
        category: cat.id,
      })
    }
  }

  let usedLegacy = false
  if (sanityCount === 0 && legacy.length) {
    usedLegacy = true
    const office = byId.get("office-moves")
    legacy.forEach((src, i) => {
      office.items.push({
        key: `legacy-${i}`,
        kind: "legacy",
        src,
        alt: `Office move ${i + 1}`,
        caption: "",
        category: "office-moves",
      })
    })
  }

  const categories = [...byId.values()]
  const all = categories.flatMap((c) => c.items)
  return { categories, all, total: all.length, usedLegacy }
}
