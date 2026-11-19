import test from "node:test"
import assert from "node:assert/strict"
import { derivePlatform, deriveLeadSource } from "../utils/attribution.js"

test("derivePlatform: google click id => Google Ads", () => {
  assert.equal(derivePlatform({ gclid: "abc123" }), "Google Ads")
})

test("derivePlatform: fbclid => Facebook Ads", () => {
  assert.equal(derivePlatform({ fbclid: "fb1" }), "Facebook Ads")
})

test("derivePlatform: utm source google + paid medium => Google Ads", () => {
  assert.equal(derivePlatform({ utm_source: "google", utm_medium: "cpc" }), "Google Ads")
})

test("derivePlatform: no params, no referrer => Direct", () => {
  assert.equal(derivePlatform({}), "Direct")
})

test("deriveLeadSource: Google Ads platform", () => {
  assert.equal(deriveLeadSource({ gclid: "abc" }), "Google Ads")
})

test("deriveLeadSource: direct traffic with no referral => Websites", () => {
  assert.equal(deriveLeadSource({}), "Websites")
})
