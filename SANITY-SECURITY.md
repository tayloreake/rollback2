# Sanity security runbook — taylorea (bsg3746e / production)

Code side is done (see checklist below). Everything in this file needs a
human with Sanity + Zoho + Vercel access. Work top to bottom.

## 0. Current exposure (verified 11 Oct 2026, no login)
`GET https://bsg3746e.api.sanity.io/v2021-10-21/data/query/production?query=count(*[_type=="quote"])`
→ `{ "result": 3552 }` — every quote (name, phone, email, move date, IP)
readable by anyone. Treat as urgent under Kenya DPA 2019.

## 1. Rotate tokens (PDF §7 — do with the deploy, not before)
1. `sanity.io/manage` → project `taylorea` → API → Tokens. Revoke:
   - the token formerly in `sanity/config/client-config.js` (`skOIZW…`)
   - the token formerly in `lib/sanity.ts` (`skC2Qd…`)
   (Both are already removed from this repo; nothing in code references them.)
2. Create a **write-scoped token for the new `leads-ledger` dataset only**
   (create the dataset first, §2) → set as `SANITY_LEADS_TOKEN` (Vercel env).
3. Create a **read-only token** for content reads (future §1 end-state).
4. Redeploy immediately after revoking (Vercel redeploy).

## 2. Private ledger dataset (PDF §8)
```bash
npx sanity@latest dataset create leads-ledger --visibility private
```
Set in Vercel env: `SANITY_LEADS_DATASET=leads-ledger`, `SANITY_LEADS_TOKEN=<write-scoped token>`.
The `lead` schema is already in `sanity/schemas/lead-schema.js` and registered.
Stuck-lead query: `*[_type=="lead" && status=="received"] | order(_createdAt asc)`

## 3. Zoho CRM (PDF §2)
Vercel env: `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`, `ZOHO_DC=com`.
In Zoho CRM → Website_Quotes → Layout, the custom fields already exist with EXACT API names:
`Move_Type`, `Move_From`, `Move_To`, `Property_Size`, `Move_Date`, `GCLID`.
Mapping lives in `utils/zoho.js` (`syncQuoteToZoho`) → `Website_Quotes` (Name/Email/Phone/Lead_Source/Move_Type/Move_From/Move_To/Property_Size/Move_Date/GCLID/Quote_Notes).

## 4. Migrate quotes to Zoho, then delete from Sanity (PDF §3 — Free plan has no
private datasets, so Zoho is the system of record instead)
Run on a machine with normal internet (the sandbox here blocks node fetch):
```bash
node scripts/migrate-quotes-to-zoho.mjs --dry-run --limit 5  # validate
node scripts/migrate-quotes-to-zoho.mjs --limit 20           # smoke batch, spot-check Zoho
node scripts/migrate-quotes-to-zoho.mjs                      # full run (~1-2h, resumable)
node scripts/migrate-quotes-to-zoho.mjs --resume             # after any interrupt
```
The script dedupes by email against existing Zoho leads, maps fields per PDF §2,
throttles for rate limits, and logs to `scripts/migration-log.jsonl` (contains
emails — delete it when finished).
```bash
sanity dataset export production backup-quotes-$(date +%Y%m%d).tar.gz --types quote
# spot-check migrated leads in Zoho, then:
sanity documents delete --query '*[_type == "quote"]'
# verify (expect 0):
curl "https://bsg3746e.api.sanity.io/v2021-10-21/data/query/production?query=count(*%5B_type%3D%3D%22quote%22%5D)"
```
`blacklistedip` (3 docs) vs `blacklistedips` (21 docs): nothing in code reads
either (`rateLimiter` is in-memory), so both are dead data — confirm with whoever
built the spam flow, then delete/consolidate.

## 5. Private ACL end-state (PDF §1)
Only after the site reads content without the public dataset: set `production`
ACL to private in `sanity.io/manage` and serve reads via the read-only token
server-side (`sanity/config/server-client.js` already supports `SANITY_API_TOKEN`).

## 6. Hosted Studio (PDF §5)
```bash
npx sanity@latest deploy        # → https://taylorea.sanity.studio
npx sanity@latest schema deploy
sanity users invite             # Editors: content team; Admins: developers
```

## 7. Compliance (PDF §3.6)
Assume the 3,552 lead records are already compromised. Notification obligations
under Kenya DPA → Mmugambi + legal, not a dev task.

## Code checklist (this repo)
- [x] Tokens scrubbed (`lib/sanity.ts`, `client-config.js`, `sanity.config.js`, `.env`, docs)
- [x] `POST /api/submitQuote`: validate → ledger(`received`) → SMS/email → Zoho → patch(`synced_to_zoho`)
- [x] `createQuote` production writes disabled by default (`QUOTE_SANITY_WRITE_ENABLED`)
- [x] Both quote forms call only `/api/submitQuote`; no client Sanity imports
- [x] Zoho mapped to Leads module per PDF table (recaptcha never sent)
- [x] `lead` schema + SEO fields (`metaTitle/metaDescription/ogImage`) on service/blogs/landingService
- [x] Service field titles clarified without renaming (non-breaking)
- [ ] Human steps above (§1–§7)
