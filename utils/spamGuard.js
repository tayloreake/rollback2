// Server-side spam + bot heuristics for website submissions.
// Pure functions only (no I/O) so they are unit-testable and shared by every
// API route. The goal is to stop random-string bot submissions without
// rejecting compact but legitimate Kenyan addresses ("Kilimani", "Ngong Rd",
// "LR209/1234", "Hse 4 Kileleshwa").

export const MIN_RECAPTCHA_SCORE = 0.5

const VOWELS = /[aeiouyAEIOUY]/g
const LETTERS = /\p{L}/gu

// Long single token with no digits/separators that looks machine-generated:
// mixed case inside the word, very low vowel ratio, or a long consonant run.
// Anything with a space, digit or separator is NOT a token, and short words
// ("Kilimani", "Lavington", "Westlands") never qualify.
export function looksLikeToken(value) {
  const t = String(value || "").trim()
  if (t.length < 10) return false
  if (/[\s,./\-_:;#()\d]/.test(t)) {
    // Letters+digits blobs such as "a8Fk29xQpLz3" (no separators, mixed
    // letters and digits, no vowel structure) are tokens too.
    return /^[A-Za-z0-9]{12,}$/.test(t) && /\d/.test(t) && /[A-Za-z]/.test(t) && !/\s/.test(t) && vowelRatio(t) < 0.3 && /[a-z][A-Z]|[A-Z][a-z]\d|\d[A-Za-z]\d/.test(t)
  }
  const letters = t.match(LETTERS) || []
  if (!letters.length) return false
  const innerCaps = (t.slice(1).match(/\p{Lu}/gu) || []).length
  if (innerCaps >= 2 && /\p{Ll}/u.test(t)) return true
  if (vowelRatio(t) < 0.25) return true
  if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(t)) return true
  return false
}

function vowelRatio(s) {
  const letters = String(s).match(LETTERS) || []
  if (!letters.length) return 0
  return (String(s).match(VOWELS) || []).length / letters.length
}

// A name is suspicious when any word looks like a random token, or when it
// carries digits / URL / markup, or when there is no vowel at all in a long word.
export function suspiciousName(value) {
  const s = String(value || "").trim()
  if (!s) return false
  if (/[<>{}\[\]|\\@]|https?:|www\.|\.(com|net|ru|cn|xyz)\b/i.test(s)) return true
  if (/\d/.test(s)) return true
  return s.split(/\s+/).some((w) => looksLikeToken(w) || (w.length >= 8 && vowelRatio(w) < 0.2))
}

// An address is suspicious when it is a single token-like blob, contains URL or
// markup, or is empty-of-letters. Compact real places pass (short, vowel-rich,
// or containing digits/separators/spaces).
export function suspiciousAddress(value) {
  const s = String(value || "").trim()
  if (!s) return false
  if (/[<>{}]|https?:|www\./i.test(s)) return true
  if (!/\p{L}/u.test(s)) return true
  const words = s.split(/[\s,]+/).filter(Boolean)
  if (words.length === 1) return looksLikeToken(words[0])
  // Multi-word: reject only when every long word looks random.
  const long = words.filter((w) => w.length >= 10)
  return long.length > 0 && long.every(looksLikeToken)
}

// Several fields holding the same non-trivial value is a bot signature
// (name == street, origin == destination token, ...).
export function repeatedAcrossFields(values) {
  const seen = new Map()
  for (const v of values) {
    const k = String(v || "").trim().toLowerCase()
    if (k.length < 8) continue
    seen.set(k, (seen.get(k) || 0) + 1)
  }
  return [...seen.values()].some((n) => n >= 2)
}

// reCAPTCHA v3 gate. Fails CLOSED: no score, an error, or a low score blocks.
// The site renders react-google-recaptcha (v2 invisible), whose siteverify
// response carries NO score. Requiring a score would reject every real
// visitor on a v2 key, so a missing score is allowed unless the deployment
// sets RECAPTCHA_REQUIRE_SCORE=true (do that once the keys are v3). A score
// that IS present and below the threshold always blocks.
export const captchaOptions = (env = process.env) => ({
  allowNoScore: String(env.RECAPTCHA_REQUIRE_SCORE || "").toLowerCase() !== "true",
})

export function recaptchaVerdict(result, { allowNoScore = false, min = MIN_RECAPTCHA_SCORE } = {}) {
  if (!result || !result.success) return { ok: false, reason: "recaptcha_failed" }
  if (result.score === null || result.score === undefined) {
    return allowNoScore ? { ok: true } : { ok: false, reason: "recaptcha_no_score" }
  }
  if (Number(result.score) < min) return { ok: false, reason: "recaptcha_low_score" }
  return { ok: true }
}

// Honeypot + too-fast submission. `hp` must be empty; `elapsedMs` (when sent)
// must be at least 1.5s.
export function botSignals(body = {}) {
  const reasons = []
  const hp = body.website || body.hp || body.company_url || body?.quoteData?.website || body?.quoteData?.hp
  if (hp) reasons.push("honeypot")
  const elapsed = Number(body.elapsedMs ?? body?.quoteData?.elapsedMs)
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < 1500) reasons.push("too_fast")
  return reasons
}

// Full quote assessment over already-normalised fields. Returns { ok, reasons }.
export function assessQuote(q = {}) {
  const reasons = []
  if (suspiciousName(q.firstName) || suspiciousName(q.lastName)) reasons.push("name")
  if (suspiciousAddress(q.location)) reasons.push("origin")
  if (suspiciousAddress(q.destination)) reasons.push("destination")
  if (repeatedAcrossFields([q.firstName, q.lastName, q.location, q.destination])) reasons.push("repeated_fields")
  const email = String(q.email || "")
  if (email) {
    const local = email.split("@")[0] || ""
    if (looksLikeToken(local) && vowelRatio(local) < 0.3) reasons.push("email")
  }
  return { ok: reasons.length === 0, reasons }
}
