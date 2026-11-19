import test from "node:test"
import assert from "node:assert/strict"
import {
  looksLikeToken, suspiciousName, suspiciousAddress, assessQuote,
  recaptchaVerdict, botSignals, repeatedAcrossFields,
} from "../utils/spamGuard.js"

const REAL_ADDRESSES = [
  "Kilimani", "Lavington", "Westlands", "Ngong Rd", "Rosslyn Riviera", "Karen",
  "Hse 4 Kileleshwa", "LR209/1234", "Apt B12", "Kitengela", "Runda Mhasibu",
  "Syokimau", "Nyali, Mombasa", "Thika Road Mall", "Mwiki", "Nyeri",
]
for (const a of REAL_ADDRESSES) {
  test(`address accepted: ${a}`, () => assert.equal(suspiciousAddress(a), false))
}

const BOT_TOKENS = [
  "kXjPqLmNoPrStUv", "ZxCvBnMqWrTyUiOp", "qwrtpsdfghjklzx", "aB3dE9fGh1JkLm2N",
  "XyZaBcDeFgHiJkLm", "bcdfghjklmnpqrst", "HfKdLsPqWmZxNcVb",
]
for (const t of BOT_TOKENS) {
  test(`token-like address rejected: ${t}`, () => assert.equal(suspiciousAddress(t), true))
  test(`token-like name rejected: ${t}`, () => assert.equal(suspiciousName(t), true))
}

test("real names accepted", () => {
  for (const n of ["Wanjiru", "Aaron Charles", "Mwangi Kamau", "Njeri O'Connor", "Mary-Jane Achieng", "Hildegard Schwarzenegger"]) {
    assert.equal(suspiciousName(n), false, n)
  }
})

test("names with markup, urls or digits rejected", () => {
  for (const n of ["<b>x</b>", "visit http://spam.xyz", "John123", "buy@now"]) assert.equal(suspiciousName(n), true, n)
})

test("looksLikeToken ignores short and separated strings", () => {
  assert.equal(looksLikeToken("Kilimani"), false)
  assert.equal(looksLikeToken("LR209/1234"), false)
  assert.equal(looksLikeToken("Ngong Road Estate"), false)
})

test("assessQuote: genuine quote passes", () => {
  const r = assessQuote({ firstName: "Wanjiru", lastName: "Kamau", email: "wanjiru.kamau@gmail.com", location: "Kilimani", destination: "Karen" })
  assert.deepEqual(r, { ok: true, reasons: [] })
})

test("assessQuote: bot submission flagged", () => {
  const r = assessQuote({ firstName: "kXjPqLmNoPrStUv", lastName: "ZxCvBnMqWrTyUiOp", email: "qwrtpsdfghjklzxcv@gmail.com", location: "HfKdLsPqWmZxNcVb", destination: "HfKdLsPqWmZxNcVb" })
  assert.equal(r.ok, false)
  assert.ok(r.reasons.includes("repeated_fields"))
  assert.ok(r.reasons.includes("origin"))
})

test("assessQuote: same value in name and street flagged", () => {
  assert.equal(assessQuote({ firstName: "Kimberley", lastName: "Kimberley", location: "Karen", destination: "Kilimani" }).ok, false)
})

test("recaptcha: fails closed", () => {
  assert.equal(recaptchaVerdict(null).ok, false)
  assert.equal(recaptchaVerdict({ success: false }).ok, false)
  assert.equal(recaptchaVerdict({ success: true, score: null }).ok, false)
  assert.equal(recaptchaVerdict({ success: true, score: 0.3 }).reason, "recaptcha_low_score")
  assert.equal(recaptchaVerdict({ success: true, score: 0.5 }).ok, true)
  assert.equal(recaptchaVerdict({ success: true, score: null }, { allowNoScore: true }).ok, true)
})

test("botSignals: honeypot and too-fast", () => {
  assert.deepEqual(botSignals({}), [])
  assert.deepEqual(botSignals({ website: "http://x" }), ["honeypot"])
  assert.deepEqual(botSignals({ elapsedMs: 800 }), ["too_fast"])
  assert.deepEqual(botSignals({ elapsedMs: 9000 }), [])
})

test("repeatedAcrossFields ignores short repeats", () => {
  assert.equal(repeatedAcrossFields(["Karen", "Karen"]), false)
})
