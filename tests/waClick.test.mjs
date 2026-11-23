import test from "node:test"
import assert from "node:assert/strict"
import { Readable } from "node:stream"

process.env.ZOHO_CLIENT_ID = "id"
process.env.ZOHO_CLIENT_SECRET = "secret"
process.env.ZOHO_REFRESH_TOKEN = "refresh"
process.env.ZOHO_DC = "com"
process.env.RECAPTCHA_SECRET_KEY = "captcha-secret"

const { default: handler } = await import("../pages/api/wa-click.js")

const calls = []
let crmResponse = { ok: true, status: 201, json: async () => ({ data: [{ status: "success", code: "SUCCESS", details: { id: "L1" } }] }) }
globalThis.fetch = async (url, init = {}) => {
  const u = String(url)
  calls.push({ url: u, body: init.body })
  if (u.includes("recaptcha/api/siteverify")) {
    return { ok: true, status: 200, json: async () => ({ success: true, hostname: "taylorea.com", challenge_ts: new Date().toISOString() }) }
  }
  if (u.includes("/oauth/v2/token")) {
    return { ok: true, status: 200, json: async () => ({ access_token: "tok" }) }
  }
  return crmResponse
}

const validPayload = (overrides = {}) => ({
  ref: "12345678",
  placement: "hero",
  page: "/quote",
  referrer: "https://www.google.com/",
  utm: { utm_source: "google", gclid: "G1", landing_page: "/services/home" },
  recaptchaToken: "captcha-token",
  website: "",
  elapsedMs: 2500,
  whatsappConsent: true,
  quoteData: {
    firstName: "Amina",
    lastName: "Kamau",
    email: "amina@example.com",
    phoneNumber: "+254 712 345 678",
    location: "Westlands",
    destination: "Karen",
    moveType: "Local House Move",
    bedrooms: "2 Bedrooms",
    moveDate: "2099-12-31",
  },
  ...overrides,
})

const run = async (payload, ip = "10.0.0.1") => {
  const raw = JSON.stringify(payload)
  const req = Object.assign(Readable.from([Buffer.from(raw)]), {
    method: "POST",
    headers: { "x-forwarded-for": ip, "content-length": String(raw.length) },
    socket: {},
  })
  let status = null
  let body = null
  const res = {
    status(code) { status = code; return this },
    json(value) { body = value; return this },
    end() { return this },
  }
  await handler(req, res)
  return { status, body }
}

test("WhatsApp enquiry saves full customer and move details to Leads before opening chat", async () => {
  calls.length = 0
  crmResponse = { ok: true, status: 201, json: async () => ({ data: [{ status: "success", code: "SUCCESS", details: { id: "L1" } }] }) }
  const result = await run(validPayload())
  assert.equal(result.status, 201)
  assert.deepEqual(result.body, { success: true, ref: "12345678" })
  const write = calls.find((call) => /\/crm\/v6\/Leads$/.test(call.url))
  assert.ok(write)
  const record = JSON.parse(write.body).data[0]
  assert.equal(record.First_Name, "Amina")
  assert.equal(record.Last_Name, "Kamau")
  assert.equal(record.Email, "amina@example.com")
  assert.equal(record.Phone, "+254712345678")
  assert.equal(record.Move_Types, "Local House Move")
  assert.equal(record.Origin_Address_Street_Address, "Westlands")
  assert.equal(record.Destination_Address_Street_Address, "Karen")
  assert.equal(record.Property_Size, "2 Bedrooms")
  assert.equal(record.Proposed_Move_Date, "2099-12-31")
  assert.equal(record.Lead_Source, "Web - WhatsApp")
  assert.equal(record.Form_Name, "WhatsApp Enquiry")
  assert.equal(record.Form_ID, "whatsapp")
  assert.match(record.Description, /WA_Ref 12345678/)
  assert.match(record.Description, /WhatsApp consent: yes/)
  assert.equal(record.Google_Click_ID, "G1")
  assert.equal(record.Page_Name, "/services/home")
})

test("missing contact details are rejected without a CRM write", async () => {
  calls.length = 0
  const result = await run(validPayload({ quoteData: undefined }))
  assert.equal(result.status, 400)
  assert.equal(calls.some((call) => /\/crm\/v6\/Leads$/.test(call.url)), false)
})

test("missing email is rejected because WhatsApp intake collects all three contact details", async () => {
  calls.length = 0
  const result = await run(validPayload({ quoteData: { ...validPayload().quoteData, email: "" } }))
  assert.equal(result.status, 400)
  assert.equal(calls.some((call) => /\/crm\/v6\/Leads$/.test(call.url)), false)
})

test("malformed and overlength phone numbers are rejected before CRM save", async () => {
  for (const [i, phoneNumber] of ["1-------2", "+1234567890123456"].entries()) {
    calls.length = 0
    const result = await run(validPayload({ quoteData: { ...validPayload().quoteData, phoneNumber } }), `10.0.0.${7 + i}`)
    assert.equal(result.status, 400, phoneNumber)
    assert.equal(calls.some((call) => /\/crm\/v6\/Leads$/.test(call.url)), false)
  }
})

test("same origin and destination is accepted for a local move", async () => {
  calls.length = 0
  const result = await run(validPayload({ quoteData: { ...validPayload().quoteData, location: "Westlands", destination: "Westlands" } }), "10.0.0.8")
  assert.equal(result.status, 201)
  const write = calls.find((call) => /\/crm\/v6\/Leads$/.test(call.url))
  assert.ok(write)
  const record = JSON.parse(write.body).data[0]
  assert.equal(record.Origin_Address_Street_Address, "Westlands")
  assert.equal(record.Destination_Address_Street_Address, "Westlands")
})

test("WhatsApp consent is required before CRM save", async () => {
  calls.length = 0
  const result = await run(validPayload({ whatsappConsent: false }))
  assert.equal(result.status, 400)
  assert.equal(calls.some((call) => /\/crm\/v6\/Leads$/.test(call.url)), false)
})

test("invalid reCAPTCHA is rejected without a CRM write", async () => {
  calls.length = 0
  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, init = {}) => {
    if (String(url).includes("recaptcha/api/siteverify")) {
      return { ok: true, status: 200, json: async () => ({ success: false, hostname: "taylorea.com" }) }
    }
    return originalFetch(url, init)
  }
  const result = await run(validPayload(), "10.0.0.5")
  globalThis.fetch = originalFetch
  assert.equal(result.status, 400)
  assert.equal(calls.some((call) => /\/crm\/v6\/Leads$/.test(call.url)), false)
})

test("invalid WhatsApp reference is rejected without a CRM write", async () => {
  calls.length = 0
  const result = await run(validPayload({ ref: "abc" }), "10.0.0.2")
  assert.equal(result.status, 400)
  assert.equal(calls.some((call) => /\/crm\/v6\/Leads$/.test(call.url)), false)
})

test("Zoho failure is surfaced so the client does not open WhatsApp before CRM save", async () => {
  calls.length = 0
  crmResponse = { ok: false, status: 503, json: async () => ({ message: "CRM unavailable" }) }
  const result = await run(validPayload(), "10.0.0.6")
  assert.equal(result.status, 502)
  assert.equal(result.body.success, false)
  assert.equal(calls.some((call) => /\/crm\/v6\/Leads$/.test(call.url)), true)
  crmResponse = { ok: true, status: 201, json: async () => ({ data: [{ status: "success", code: "SUCCESS", details: { id: "L1" } }] }) }
})
