import test from "node:test"
import assert from "node:assert/strict"
import { withTimeout } from "../utils/withTimeout.js"

test("withTimeout returns a completed operation result", async () => {
  assert.equal(await withTimeout(() => Promise.resolve("token"), 100, "timed out"), "token")
})

test("withTimeout rejects an operation that never settles", async () => {
  await assert.rejects(
    withTimeout(() => new Promise(() => {}), 5, "Human verification timed out"),
    /Human verification timed out/
  )
})

test("withTimeout propagates operation errors", async () => {
  await assert.rejects(
    withTimeout(() => Promise.reject(new Error("reCAPTCHA failed")), 100, "timed out"),
    /reCAPTCHA failed/
  )
})
