import test from "node:test"
import assert from "node:assert/strict"
import { GALLERY_CATEGORIES } from "../utils/galleryCategories.js"
import { buildGallery, sanityImageUrl } from "../utils/gallery.js"
import galleryAlbum from "../sanity/schemas/gallery-album-schema.js"

test("the six requested categories exist, in order", () => {
  assert.deepEqual(GALLERY_CATEGORIES.map((c) => c.title), [
    "Household Moves", "Office Moves", "Staff Relocation", "Cross-Border Moves", "International Moves", "Crating Services",
  ])
  assert.equal(new Set(GALLERY_CATEGORIES.map((c) => c.id)).size, 6)
})

test("Sanity dropdown is generated from the same category list", () => {
  const field = galleryAlbum.fields.find((f) => f.name === "category")
  assert.deepEqual(field.options.list.map((o) => o.value), GALLERY_CATEGORIES.map((c) => c.id))
})

test("legacy photos are all Office Moves while Sanity is empty", () => {
  const g = buildGallery({ albums: [], legacy: ["/a.jpg", "/b.jpg", "/c.jpg"] })
  assert.equal(g.usedLegacy, true)
  assert.equal(g.categories.find((c) => c.id === "office-moves").items.length, 3)
  for (const c of g.categories.filter((c) => c.id !== "office-moves")) assert.equal(c.items.length, 0)
  assert.equal(g.total, 3)
})

test("once Sanity has photos the legacy photos are dropped (no duplicates)", () => {
  const albums = [{ _id: "a1", title: "KURA move", category: "office-moves", images: [{ _key: "k1", url: "https://cdn.sanity.io/images/x/y/a.jpg", width: 4000, height: 3000 }] }]
  const g = buildGallery({ albums, legacy: ["/a.jpg", "/b.jpg"] })
  assert.equal(g.usedLegacy, false)
  assert.equal(g.total, 1)
  assert.equal(g.categories.find((c) => c.id === "office-moves").items[0].alt, "KURA move - Office Moves")
})

test("photos land only in their own category and tabs keep the fixed order", () => {
  const img = (k) => ({ _key: k, url: `https://cdn.sanity.io/images/x/y/${k}.jpg` })
  const albums = [
    { _id: "1", title: "Villa", category: "household-moves", images: [img("h1"), img("h2")] },
    { _id: "2", title: "Crates", category: "crating-services", images: [img("c1")] },
    { _id: "3", title: "Bad", category: "not-a-category", images: [img("x1")] },
  ]
  const g = buildGallery({ albums })
  const counts = Object.fromEntries(g.categories.map((c) => [c.id, c.items.length]))
  assert.deepEqual(counts, {
    "household-moves": 2, "office-moves": 0, "staff-relocation": 0, "cross-border-moves": 0, "international-moves": 0, "crating-services": 1,
  })
  assert.equal(g.total, 3)
})

test("images without a url are skipped", () => {
  const g = buildGallery({ albums: [{ _id: "1", title: "t", category: "office-moves", images: [{ _key: "a" }, { _key: "b", url: "https://cdn.sanity.io/i.jpg" }] }] })
  assert.equal(g.total, 1)
})

test("sanityImageUrl asks the CDN for resized webp/avif", () => {
  assert.equal(sanityImageUrl("https://cdn.sanity.io/i.jpg", 500), "https://cdn.sanity.io/i.jpg?w=500&auto=format&q=75")
  assert.equal(sanityImageUrl("", 500), "")
})
