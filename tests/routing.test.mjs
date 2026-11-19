import test from "node:test"
import assert from "node:assert/strict"

process.env.ZOHO_CLIENT_ID = "id"
process.env.ZOHO_CLIENT_SECRET = "secret"
process.env.ZOHO_REFRESH_TOKEN = "refresh"
const { syncQuoteToZoho, syncInquiryToZoho } = await import("../utils/zoho.js")

// Routing contract: quotes + contact enquiries -> Leads; contact/job/feedback/review/newsletter -> Website_Quotes.
// (WhatsApp -> Leads is covered in waClick.test.mjs.)
const paths = []
globalThis.fetch = async (url, init = {}) => {
  const u = String(url)
  if (u.includes("/oauth/")) return { ok: true, status: 200, text: async () => JSON.stringify({ access_token: "t" }), json: async () => ({ access_token: "t" }) }
  const path = u.replace(/^.*\/crm\/v8/, "")
  paths.push(`${init.method || "GET"} ${path}`)
  const body = (init.method || "GET") === "GET" ? "" : JSON.stringify({ data: [{ status: "success", code: "SUCCESS", details: { id: "X1" } }] })
  return { ok: true, status: body ? 201 : 204, text: async () => body }
}

test("quote -> Leads", async () => {
  paths.length = 0
  await syncQuoteToZoho({ firstName: "A", lastName: "Kamau", email: "a@x.com", phoneNumber: "+254700000001" }, {})
  assert.ok(paths.some((p) => /^POST \/Leads/.test(p)))
  assert.ok(!paths.some((p) => /Website_Quotes/.test(p)))
})

for (const source of ["Job Application", "Feedback", "Review"]) {
  test(`${source} -> Website_Quotes`, async () => {
    paths.length = 0
    await syncInquiryToZoho({ name: "Jane Doe", email: "j@x.com", source })
    assert.ok(paths.some((p) => /^POST \/Website_Quotes$/.test(p)), source)
    assert.ok(!paths.some((p) => /\/Leads/.test(p)), source)
  })
}

test("Newsletter -> Website_Quotes", async () => {
  paths.length = 0
  await syncInquiryToZoho({ name: "Newsletter Subscriber", email: "n@x.com", source: "Newsletter" })
  assert.ok(paths.some((p) => /^POST \/Website_Quotes$/.test(p)))
  assert.ok(!paths.some((p) => /\/Leads/.test(p)))
})

test("Contact Form -> Leads with full traffic-source attribution", async () => {
  paths.length = 0
  const bodies = []
  const orig = globalThis.fetch
  globalThis.fetch = async (url, init = {}) => {
    if (init.body && !String(url).includes("/oauth/")) bodies.push(JSON.parse(init.body))
    return orig(url, init)
  }
  await syncInquiryToZoho({
    name: "Jane Doe", email: "j@x.com", phone: "+254700000002", source: "Contact Form", notes: "need movers",
    attribution: { utm_source: "google", utm_medium: "cpc", utm_campaign: "nairobi", gclid: "G9", landing_page: "/contact", referrer: "https://www.google.com/" },
  })
  globalThis.fetch = orig
  assert.ok(paths.some((p) => /^POST \/Leads$/.test(p)))
  assert.ok(!paths.some((p) => /Website_Quotes/.test(p)))
  const lead = bodies[0].data[0]
  assert.equal(lead.First_Name, "Jane")
  assert.equal(lead.Last_Name, "Doe")
  assert.equal(lead.Platform, "Google Ads")
  assert.equal(lead.Lead_Source, "Google Ads")
  assert.equal(lead.UTM_Source, "google")
  assert.equal(lead.GCLID, "G9")
  assert.equal(lead.Google_Click_ID, "G9")
  assert.equal(lead.Page_Name, "/contact")
  assert.equal(lead.Form_Name, "Contact Form")
  assert.equal(lead.Lead_Status, "Not Contacted")
})
