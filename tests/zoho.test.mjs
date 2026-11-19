import test from "node:test"
import assert from "node:assert/strict"

process.env.ZOHO_CLIENT_ID = "id"
process.env.ZOHO_CLIENT_SECRET = "secret"
process.env.ZOHO_REFRESH_TOKEN = "refresh"
process.env.ZOHO_DC = "com"

const { syncQuoteToZoho, syncInquiryToZoho } = await import("../utils/zoho.js")

// Scriptable fetch: handlers are matched in order on "METHOD path".
let calls = []
let script = []
const json = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: "",
  text: async () => (body === undefined ? "" : JSON.stringify(body)),
  json: async () => body,
})
globalThis.fetch = async (url, init = {}) => {
  const u = String(url)
  if (u.includes("/oauth/v2/token")) return json(200, { access_token: "tok" })
  const path = u.replace(/^https:\/\/www\.zohoapis\.com\/crm\/v8/, "")
  const method = init.method || "GET"
  const body = init.body ? JSON.parse(init.body) : undefined
  calls.push({ method, path, body })
  const idx = script.findIndex((s) => s.match(method, path))
  if (idx === -1) throw new Error(`unscripted ${method} ${path}`)
  const [step] = script.splice(idx, 1)
  return json(step.status, step.body)
}
const reset = (steps) => { calls = []; script = steps }
const created = (id) => ({ status: 201, body: { data: [{ status: "success", code: "SUCCESS", details: { id } }] } })
const rec = (re) => ({ match: (m, p) => re.test(`${m} ${p}`) })
const noHit = { ...rec(/^GET .*\/search/), status: 204, body: undefined }

const QUOTE = {
  firstName: "Wanjiru", lastName: "Kamau", email: "wanjiru@example.com", phoneNumber: "+254712345678",
  moveType: "Residential", bedrooms: "2", moveDate: "2026-12-01", location: "Kilimani", destination: "Karen",
}
const ATT = { utm_source: "google", utm_medium: "cpc", utm_campaign: "nairobi", gclid: "G123", campaign_id: "99", landing_page: "/quote", referrer: "https://google.com" }

test("quote -> Leads (never Website_Quotes)", async () => {
  reset([noHit, { ...rec(/^POST \/Leads$/), ...created("L1") }])
  const r = await syncQuoteToZoho({ ...QUOTE }, ATT)
  assert.equal(r.ok, true)
  assert.equal(r.leadId, "L1")
  assert.ok(calls.every((c) => !c.path.includes("Website_Quotes")))
  const body = calls.find((c) => c.method === "POST").body.data[0]
  assert.equal(body.First_Name, "Wanjiru")
  assert.equal(body.GCLID, "G123")
  assert.equal(body.UTM_Source, "google")
})

test("inquiry -> Website_Quotes only, never Leads, attribution preserved", async () => {
  reset([{ ...rec(/^POST \/Website_Quotes$/), ...created("W1") }])
  const r = await syncInquiryToZoho({ name: "Jane Doe", email: "j@example.com", phone: "+254700000000", source: "Contact Form", notes: "hi", attribution: ATT, siq_visitor_id: "SIQ1" })
  assert.equal(r.ok, true)
  assert.equal(r.module, "Website_Quotes")
  assert.ok(calls.every((c) => !/^\/Leads/.test(c.path)))
  const b = calls[0].body.data[0]
  assert.equal(b.Name, "Jane Doe")
  assert.equal(b.Lead_Source, "Contact Form")
  assert.equal(b.GCLID, "G123")
  assert.equal(b.Campaign_ID, "99")
  assert.equal(b.UTM_Source, "google")
  assert.equal(b.UTM_Medium, "cpc")
  assert.equal(b.UTM_Campaign, "nairobi")
  assert.equal(b.Landing_Page, "/quote")
  assert.equal(b.Referrer_URL, "https://google.com")
  assert.equal(b.SalesIQ_Visitor_ID, "SIQ1")
  assert.equal(b.First_Name, undefined)
})

test("newsletter never touches Leads and never becomes a quote's first name", async () => {
  reset([noHit, { ...rec(/^POST \/Website_Quotes$/), ...created("W2") }])
  const n = await syncInquiryToZoho({ name: "Newsletter Subscriber", email: "same@example.com", source: "Newsletter" })
  assert.equal(n.module, "Website_Quotes")
  assert.ok(calls.every((c) => !/^\/Leads/.test(c.path)))
  // Same email now requests a real quote: the lead search is on Leads only,
  // finds nothing, and the created lead carries the quote's own name.
  reset([noHit, { ...rec(/^POST \/Leads$/), ...created("L2") }])
  await syncQuoteToZoho({ ...QUOTE, email: "same@example.com" }, {})
  const lead = calls.find((c) => c.method === "POST").body.data[0]
  assert.equal(lead.First_Name, "Wanjiru")
  assert.notEqual(lead.First_Name, "Newsletter")
})

test("newsletter repeat signup is idempotent", async () => {
  reset([{ ...rec(/^GET .*Website_Quotes\/search/), status: 200, body: { data: [{ id: "W9" }] } }])
  const r = await syncInquiryToZoho({ name: "Newsletter Subscriber", email: "dup@example.com", source: "Newsletter" })
  assert.equal(r.ok, true)
  assert.equal(r.duplicate, true)
  assert.equal(calls.filter((c) => c.method === "POST").length, 0)
})

test("HTTP 200 with a per-record error is a FAILURE, not success", async () => {
  reset([noHit, { ...rec(/^POST \/Leads$/), status: 200, body: { data: [{ status: "error", code: "MANDATORY_NOT_FOUND", message: "required field not found", details: { api_name: "Last_Name" } }] } }])
  const r = await syncQuoteToZoho({ ...QUOTE }, {})
  assert.equal(r.ok, false)
  assert.match(r.error, /required field not found/)
})

test("success row without an id is a failure", async () => {
  reset([noHit, { ...rec(/^POST \/Leads$/), status: 201, body: { data: [{ status: "success", code: "SUCCESS", details: {} }] } }])
  const r = await syncQuoteToZoho({ ...QUOTE }, {})
  assert.equal(r.ok, false)
})

test("DUPLICATE_DATA reuses the existing record id", async () => {
  reset([noHit, { ...rec(/^POST \/Leads$/), status: 200, body: { data: [{ status: "error", code: "DUPLICATE_DATA", message: "duplicate data", details: { id: "L77", api_name: "Email" } }] } }])
  const r = await syncQuoteToZoho({ ...QUOTE }, {})
  assert.equal(r.ok, true)
  assert.equal(r.leadId, "L77")
})

test("per-record INVALID_DATA on an optional field drops only that field and retries", async () => {
  reset([
    { ...rec(/^POST \/Website_Quotes$/), status: 200, body: { data: [{ status: "error", code: "INVALID_DATA", message: "invalid data", details: { api_name: "Landing_Page" } }] } },
    { ...rec(/^POST \/Website_Quotes$/), ...created("W3") },
  ])
  const r = await syncInquiryToZoho({ name: "Jane Doe", email: "j@example.com", source: "Review", attribution: ATT })
  assert.equal(r.ok, true)
  assert.deepEqual(r.droppedAttribution, ["Landing_Page"])
  assert.equal(calls[1].body.data[0].Landing_Page, undefined)
  assert.equal(calls[1].body.data[0].GCLID, "G123")
})

test("INVALID_DATA on a core field is NOT silently dropped", async () => {
  reset([{ ...rec(/^POST \/Website_Quotes$/), status: 200, body: { data: [{ status: "error", code: "INVALID_DATA", message: "invalid", details: { api_name: "Email" } }] } }])
  const r = await syncInquiryToZoho({ name: "Jane Doe", email: "bad", source: "Review" })
  assert.equal(r.ok, false)
})

test("existing lead update keeps first-touch attribution and status", async () => {
  reset([
    { ...rec(/^GET .*Leads\/search/), status: 200, body: { data: [{ id: "L5" }] } },
    { ...rec(/^POST \/Leads\/upsert/), status: 200, body: { data: [{ status: "success", code: "SUCCESS", details: { id: "L5" } }] } },
  ])
  const r = await syncQuoteToZoho({ ...QUOTE }, { utm_source: "direct-later-visit" })
  assert.equal(r.ok, true)
  const b = calls.find((c) => c.method === "POST").body.data[0]
  assert.equal(b.id, "L5")
  assert.equal(b.UTM_Source, undefined)
  assert.equal(b.Lead_Source, undefined)
  assert.equal(b.Lead_Status, undefined)
  assert.equal(b.Phone, "+254712345678")
})

test("HTTP 5xx and auth errors surface as failures", async () => {
  reset([noHit, { ...rec(/^POST \/Leads$/), status: 500, body: { message: "boom" } }])
  const r = await syncQuoteToZoho({ ...QUOTE }, {})
  assert.equal(r.ok, false)
})
