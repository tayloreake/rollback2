import test from "node:test"
import assert from "node:assert/strict"
import { Readable } from "node:stream"

process.env.ZOHO_CLIENT_ID = "id"
process.env.ZOHO_CLIENT_SECRET = "secret"
process.env.ZOHO_REFRESH_TOKEN = "refresh"
process.env.ZOHO_DC = "com"

const { default: handler } = await import("../pages/api/wa-click.js")

const calls = []
globalThis.fetch = async (url, init = {}) => {
  const u = String(url)
  calls.push({ url: u, body: init.body })
  if (u.includes("/oauth/v2/token")) {
    return { ok: true, status: 200, json: async () => ({ access_token: "tok" }) }
  }
  return { ok: true, status: 201, json: async () => ({ data: [{ status: "success", code: "SUCCESS", details: { id: "L1" } }] }) }
}

const run = async (payload, ip = "10.0.0.1") => {
  const raw = JSON.stringify(payload)
  const req = Object.assign(Readable.from([Buffer.from(raw)]), {
    method: "POST",
    headers: { "x-forwarded-for": ip, "content-length": String(raw.length) },
    socket: {},
  })
  let status = null
  const res = { status(c) { status = c; return this }, end() { return this } }
  await handler(req, res)
  return status
}

test("WhatsApp click is written to the Leads module (never Website_Quotes)", async () => {
  calls.length = 0
  const status = await run({ ref: "12345678", placement: "hero", page: "/quote", utm: { utm_source: "google", gclid: "G1", landing_page: "/services/home" } })
  assert.equal(status, 204)
  const write = calls.find((c) => !c.url.includes("/oauth/"))
  assert.match(write.url, /\/crm\/v6\/Leads$/)
  assert.doesNotMatch(write.url, /Website_Quotes/)
  const rec = JSON.parse(write.body).data[0]
  assert.equal(rec.Last_Name, "WhatsApp visitor 12345678")
  assert.equal(rec.Lead_Source, "Web - WhatsApp")
  assert.equal(rec.GCLID, "G1")
  assert.equal(rec.UTM_Source, "google")
  assert.equal(rec.Page_Name, "/services/home")
  assert.equal(rec.Platform, "Google Ads")
  assert.equal(rec.Google_Click_ID, "G1")
  assert.equal(rec.Form_Name, "WhatsApp Click")
})

test("WhatsApp click records its traffic source (facebook / organic / direct)", async () => {
  calls.length = 0
  await run({ ref: "22222222", placement: "footer", page: "/", referrer: "https://www.google.com/", utm: {} }, "10.0.0.3")
  let rec = JSON.parse(calls.find((c) => !c.url.includes("/oauth/")).body).data[0]
  assert.equal(rec.Platform, "Google Organic")
  assert.equal(rec.Referrer_URL, "https://www.google.com/")
  calls.length = 0
  await run({ ref: "33333333", placement: "hero", page: "/", utm: { fbclid: "FB1", utm_source: "facebook", utm_medium: "paid" } }, "10.0.0.4")
  rec = JSON.parse(calls.find((c) => !c.url.includes("/oauth/")).body).data[0]
  assert.equal(rec.Platform, "Facebook Ads")
  assert.equal(rec.FB_Click_ID, "FB1")
  calls.length = 0
  await run({ ref: "44444444", placement: "hero", page: "/quote", utm: {} }, "10.0.0.5")
  rec = JSON.parse(calls.find((c) => !c.url.includes("/oauth/")).body).data[0]
  assert.equal(rec.Platform, "Direct")
  assert.equal(rec.Page_Name, "/quote")
})

test("invalid WhatsApp ref is rejected without a CRM write", async () => {
  calls.length = 0
  const status = await run({ ref: "abc" }, "10.0.0.2")
  assert.equal(status, 400)
  assert.equal(calls.length, 0)
})
