import test from "node:test"
import assert from "node:assert/strict"
import { validateQuoteData, buildQuoteMessage } from "../utils/leadNotify.js"

const base = () => ({
  firstName: "Wanjiru", lastName: "Kamau", email: "wanjiru@example.com", phoneNumber: "0712345678",
  moveType: "Residential", bedrooms: "2", moveDate: "2026-12-01", location: "Kilimani", destination: "Karen",
})

test("genuine quote passes and phone is normalised", () => {
  const q = base()
  assert.deepEqual(validateQuoteData(q), { ok: true })
  assert.equal(q.phoneNumber, "+254712345678")
})

test("compact legitimate addresses are not rejected", () => {
  for (const [from, to] of [["Kilimani", "Karen"], ["Ngong Rd", "LR209/1234"], ["Hse 4 Kileleshwa", "Apt B12"], ["Syokimau", "Nyali, Mombasa"]]) {
    const q = { ...base(), location: from, destination: to }
    assert.equal(validateQuoteData(q).ok, true, `${from} -> ${to}`)
  }
})

test("random-token bot submission is rejected as spam", () => {
  const q = { ...base(), firstName: "kXjPqLmNoPrStUv", lastName: "ZxCvBnMqWrTyUiOp", location: "HfKdLsPqWmZxNcVb", destination: "bcdfghjklmnpqrst" }
  const r = validateQuoteData(q)
  assert.equal(r.ok, false)
  assert.equal(r.spam, true)
})

test("token-like destination alone is rejected", () => {
  const r = validateQuoteData({ ...base(), destination: "aB3dE9fGh1JkLm2N" })
  assert.equal(r.ok, false)
  assert.ok(r.reasons.includes("destination"))
})

test("invalid email and phone are rejected", () => {
  assert.equal(validateQuoteData({ ...base(), email: "not-an-email" }).ok, false)
  assert.equal(validateQuoteData({ ...base(), phoneNumber: "abc" }).ok, false)
})

test("SMS/email message is built from validated fields only", () => {
  const q = base()
  validateQuoteData(q)
  const m = buildQuoteMessage(q)
  assert.match(m, /Name: Wanjiru Kamau/)
  assert.match(m, /Phone Number: \+254712345678/)
  assert.match(m, /From: Kilimani/)
  assert.match(m, /To: Karen/)
})

test("free-text fields are clamped", () => {
  const q = { ...base(), location: "Karen " + "x ".repeat(400) }
  validateQuoteData(q)
  assert.ok(q.location.length <= 255)
})
