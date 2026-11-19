#!/usr/bin/env node
// One-off migration: upload the photos shipped in /public/assets/gallery/images
// (all office moves) into Sanity as ONE album in the "Office Moves" category.
//
//   SANITY_API_TOKEN=<Editor token> node scripts/import-gallery-to-sanity.mjs --dry-run
//   SANITY_API_TOKEN=<Editor token> node scripts/import-gallery-to-sanity.mjs
//
// Safe to re-run: the album has a fixed id (createOrReplace) and Sanity
// de-duplicates identical files, so nothing is uploaded twice.
// Options: --dir <path>  --category <id>  --title "<album name>"  --concurrency <n>
import fs from "node:fs"
import path from "node:path"
import { createClient } from "@sanity/client"

const args = process.argv.slice(2)
const flag = (name) => args.includes(`--${name}`)
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}

const dir = path.resolve(opt("dir", "public/assets/gallery/images"))
const category = opt("category", "office-moves")
const title = opt("title", "Office Moves - archive photos")
const concurrency = Number(opt("concurrency", "4"))
const dryRun = flag("dry-run")
const docId = `galleryAlbum-${category}-archive`

const VALID = ["household-moves", "office-moves", "staff-relocation", "cross-border-moves", "international-moves", "crating-services"]
if (!VALID.includes(category)) {
  console.error(`Unknown category "${category}". Use one of: ${VALID.join(", ")}`)
  process.exit(1)
}

const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort(natural)
const totalMb = files.reduce((n, f) => n + fs.statSync(path.join(dir, f)).size, 0) / 1048576
console.log(`${files.length} photos (${totalMb.toFixed(0)} MB) from ${dir} -> category "${category}", album "${title}"`)

if (dryRun) {
  console.log("Dry run: first 5 =", files.slice(0, 5).join(", "))
  process.exit(0)
}

const token = process.env.SANITY_API_TOKEN
if (!token) {
  console.error("SANITY_API_TOKEN is required (Sanity -> API -> Tokens -> Editor).")
  process.exit(1)
}
const client = createClient({ projectId: "bsg3746e", dataset: "production", apiVersion: "2023-06-19", token, useCdn: false })

const withRetry = async (fn, tries = 4) => {
  for (let i = 1; ; i++) {
    try { return await fn() } catch (e) {
      if (i >= tries) throw e
      await new Promise((r) => setTimeout(r, 1000 * i * i))
    }
  }
}

const results = new Array(files.length)
let next = 0
let done = 0
const worker = async () => {
  while (next < files.length) {
    const idx = next++
    const file = files[idx]
    const asset = await withRetry(() =>
      client.assets.upload("image", fs.createReadStream(path.join(dir, file)), { filename: file })
    )
    results[idx] = { _type: "image", _key: `img${String(idx + 1).padStart(4, "0")}`, asset: { _type: "reference", _ref: asset._id } }
    done++
    if (done % 10 === 0 || done === files.length) console.log(`  uploaded ${done}/${files.length}`)
  }
}
await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker))

await client.createOrReplace({ _id: docId, _type: "galleryAlbum", title, category, images: results })
console.log(`Done. Published album ${docId} with ${results.length} photos in "${category}".`)
