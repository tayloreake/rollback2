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

## 2. GA4 — G-S2W1496B3K (HARDCODED — do not duplicate in GTM)
The gtag snippet lives directly in `pages/_document.js` (single collector,
consent-gated by the defaults above it). Do NOT also create a GTM Google tag
for this ID — that would double-count every pageview.
2. Tags → New → **GA4 Event**, event name `page_view`.
   Trigger: Custom Event `page_view` (the SPA push from `useGTM`).
   In the Google tag settings, turn OFF automatic page-view on history
   change to avoid doubles.
3. Tags → New → **GA4 Event**, event name `generate_lead`.
   Trigger: Custom Event `generate_lead`. Mark as **Key event** in GA4.
4. Verify in GA4 Realtime + DebugView.

## 3. Google Ads (existing AW-966026451)
- Tags → New → **Google Ads Conversion**, Conversion ID `AW-966026451`,
  Conversion Label `<PASTE LABEL>`, trigger Custom Event `generate_lead`.
- Enable **Enhanced Conversions** (hashed email/phone from the lead form).
- Keep call tracking (0721 410 517) as is.

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
