# GTM setup runbook — taylorea.com (audit §1)

Container: `GTM-W6T72F2Z` (loads once, from `pages/_document.js`).
The site pushes these dataLayer events: `page_view`, `generate_lead`,
`consent_update`, plus scroll/engagement events (`utils/gtm.js`).

## 1. Consent Mode v2 (required first)
- Admin → Container Settings → Enable consent overview.
- The site defaults everything to `denied` (see `_document.js`) and pushes
  `consent_update` with `ad_storage` / `analytics_storage` / `ad_user_data` /
  `ad_personalization` when the visitor chooses in the banner.
- No tag should fire before consent except strictly necessary ones.

## 2. GA4 — G-S2W1496B3K (GTM-OWNED — no hardcoded gtag on site)
Hardcoded gtag.js was removed from `_document.js` (it double-counted with
the GTM Google tag). GTM is now the single collector:
1. Tags → New → **Google tag** for G-S2W1496B3K on Initialization – All Pages,
   with automatic page-views on history change turned OFF.
2. Tags → New → **GA4 Event**, event name `page_view`.
   Trigger: Custom Event `page_view` (the SPA push from `useGTM`).
3. Tags → New → **GA4 Event**, event name `generate_lead`.
   Trigger: Custom Event `generate_lead`. Mark as **Key event** in GA4.
4. Verify in GA4 Realtime + DebugView (one page_view per navigation, not two).

## 3. Google Ads (existing AW-966026451)
- Tags → New → **Google Ads Conversion**, Conversion ID `AW-966026451`,
  Conversion Label `<PASTE LABEL>`, trigger Custom Event `generate_lead`.
  YES — reuse the existing "Submit lead form" conversion, don't create a new one.
- Secondary fallback trigger: Page View on `/ThankYou` (lowercase `/thank-you`
  301s there). Primary counting must stay event-based — the quote forms push
  `generate_lead` before navigating, so URL-only triggers undercount.
- Enable **Enhanced Conversions** (hashed email/phone from the lead form).
- Keep call tracking (0721 410 517) as is.

### Verify the quote funnel end-to-end
The quote form is the only conversion that must reach Zoho *and* fire the Ads
tag. After deploying, submit a test quote and check:
1. `POST /api/submitQuote` returns `"zoho":"synced"` (not `"pending"`).
2. A record appears in Zoho `Website_Quotes`.
3. GA4 DebugView shows `generate_lead`; Ads shows the conversion.

If it returns `"pending"`, read the `zohoError` field in the response — it now
carries the real Zoho error instead of failing silently.

## 4. Meta Pixel (paused until ID provided)
- Set `NEXT_PUBLIC_META_PIXEL_ID` in Vercel env, redeploy — the site then
  loads Pixel on ads-consent only, fires PageView + Lead (with event_id
  reserved for future CAPI dedupe). Alternatively add via GTM Custom HTML
  with Consent Type “Advertising”.

## 5. LinkedIn Insight (paused until Partner ID provided)
- Set `NEXT_PUBLIC_LINKEDIN_PARTNER_ID`, redeploy — loads on ads-consent.
  Alternatively add via GTM with Consent Type “Advertising”.
  Verify in Meta Events Manager + LinkedIn Campaign Manager.

## 6. Publish + submit
- GTM Preview → test quote on staging → Publish.
- Search Console: resubmit `sitemap.xml` (old casing 301s are in
  `next.config.js` redirects).

## 7. T6/T7 — attribution: hidden fields + dataLayer (IN CODE, not GTM)

Everything below ships with the site. **Do not paste the playbook's Custom
HTML block into GTM** — it re-reads URL params only (no cookie), so it would
blank the hidden fields on any page reached without `?campaign_id=...`, and
`querySelector` throws on pages that have no such inputs.

### Hidden fields (Quote form ×2 + Contact form)
`utm_source`, `utm_medium`, `utm_campaign`, `gclid`, `campaign_id` — rendered
by `components/AttributionHiddenFields.jsx`, filled from the 90-day first-touch
cookie (`utils/attribution.js`, `tm_attr`) with URL-param fallback. The server
payload uses the same source (`getFormAttribution()`), so DOM and CRM agree.

### dataLayer events pushed by the site
| Event | Fired by | Fields |
|-------|----------|--------|
| `generate_lead` | Quote + Contact submit (`gtmPushLead`) | `form_id`, `lead_source` (normalised), `referral_answer`, `campaign_id`, `gclid`, `utm_source/medium/campaign`, `user_id`, `move_type`, `bedrooms`, `value`, `currency`, `timestamp` |
| `whatsapp_click` | any `wa.me` link (`useClickTracking`) | `whatsapp_ref`, `channel`, `campaign_id` |
| `phone_click` | any `tel:` link + Navbar | `phone_number`, `campaign_id` |

**The playbook calls the lead event `lead`. This site pushes `generate_lead`**
because the GA4 key event *and* the Google Ads conversion (AW-966026451) are
already triggered off it (§2/§3 above) — adding a second `lead` event would
double-count the moment a trigger is created for it. Keep the existing
triggers; they now receive campaign attribution automatically.

`lead_source` values (playbook T3 normalisation):
`Google Ads | Meta Ads | WhatsApp | Google Business Profile | Referral | Email | Other`.

### Zoho CRM (Leads module)
`Campaign_ID`, `UTM_Source`, `UTM_Medium`, `UTM_Campaign`, `GCLID`,
`Lead_Source` are written with every website lead (quotes *and* inquiries).
If one of those fields does not exist yet in the CRM org (or is a restricted
picklist), Zoho rejects **only that field** and the write still succeeds —
check `zohoDroppedFields` in the `POST /api/submitQuote` response (must be
`[]` once the custom fields are created) and the server log line
`Zoho rejected field "..."`.

### Test plan (3 records, then delete them)
1. `taylorea.com/?campaign_id=CAM-GOOGLE-20261012-001&gclid=TEST&utmsource…` →
   submit Quote form → Zoho lead with `Campaign_ID`, `GCLID`, `Lead_Source=Google Ads`,
   and `generate_lead` in GA4 DebugView.
2. Meta link with `?campaign_id=CAM-META-20261015-002&utm_source=meta` →
   submit Contact form → `Lead_Source=Meta Ads`.
3. Any `wa.me` link → GTM Preview shows `whatsapp_click` with `whatsapp_ref`
   and `campaign_id` → submit a form → `Lead_Source=WhatsApp`.

