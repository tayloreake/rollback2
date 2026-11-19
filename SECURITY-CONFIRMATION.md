# API security confirmation — `/api/sendEmail` + `/api/sendSms`

Requested line-item sign-off (website fixes, due Fri 17 Oct). Verified against
the code as committed; re-verify with `grep` if this file drifts from source.

## 1. `/api/sendEmail` ignores any client-supplied `to` — CONFIRMED

`pages/api/sendEmail.js`:
- Client `to` is passed through `pickRecipients()` (lines ~22–27), which keeps
  ONLY addresses in the hardcoded `ALLOWED_TO` set (lines ~15–20):
  `sales@taylorea.com`, `hradmin@taylorea.com`, `marykc@taylorea.com`,
  `stephaniem@taylorea.com`.
- Anything else (including attacker addresses, multiple recipients, empty or
  missing values) falls back to `["sales@taylorea.com"]` (line ~63). There is
  no code path that sends mail to an unlisted address → **no open relay**.
- `subject` is sanitized: CR/LF stripped, capped at 120 chars (header-injection
  safe). The visitor `confirmTo` copy uses a fixed template and a validated
  email shape only — no attacker-controlled body or recipient list.

## 2. `/api/sendSms` is rate-limited — CONFIRMED

`pages/api/sendSms.js`:
- `rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 })` (lines ~7–10), enforced
  per IP via `await limiter(req)` (line ~24) → HTTP 429 beyond 5 calls/15 min.
- reCAPTCHA token required and server-verified before any send.
- The SMS destination is hardcoded server-side (`+254721410517` in
  `utils/leadNotify.js`); any client-supplied `to` is ignored entirely, so SMS
  credit cannot be redirected.

## Residual notes
- Both routes still depend on `GMAIL_*` / AfricaTalking credentials in env;
  a leaked Gmail app password would allow sending outside this code — rotate
  if ever suspected.
- Rate limits are in-memory per serverless instance (fine for abuse-friction,
  not a distributed guarantee). Upgrade to Upstash/Redis limits if SMS abuse
  is ever observed.
