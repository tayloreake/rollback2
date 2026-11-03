# Zoho CRM Leads module — required custom fields for full attribution

Create these fields on the **Leads** module (API names must match exactly).
Missing fields are dropped silently (lead still saves); check server logs for
`Zoho rejected field "…"`.

Core (usually present):
- First_Name, Last_Name, Email, Phone
- How_did_you_hear_about_us, Lead_Status
- Description, Move_Types, Origin_Address_Street_Address,
  Destination_Address_Street_Address, Property_Size, Proposed_Move_Date

Attribution (T7) — create if missing:
- Campaign_ID (text)
- Campaign_Name (text)
- Advert_ID (text)
- Advert_Name (text)
- Ad_Account_Name (text)
- Platform (text/picklist)
- Keyword (text)
- Form_Name (text)
- Form_ID (text)
- Page_Name (text)
- UTM_Source, UTM_Medium, UTM_Campaign, UTM_Term, UTM_Content (text)
- GCLID (text) — note: API stores null; keep for compatibility
- Google_Click_ID (text) — durable field, used for offline conversions
- FB_Click_ID (text)
- Referrer_URL (text)
- Lead_Source (picklist/text)

Google Ads offline conversions env vars:
- GOOGLE_ADS_DEVELOPER_TOKEN
- GOOGLE_ADS_CLIENT_ID
- GOOGLE_ADS_CLIENT_SECRET
- GOOGLE_ADS_REFRESH_TOKEN
- GOOGLE_ADS_CUSTOMER_ID
- GOOGLE_ADS_CONVERSION_ACTION_ID
Endpoint: POST /api/google-ads-conversions { gclid, conversionDateTime?, value?, currency? }

Sentry env vars (optional):
- NEXT_PUBLIC_SENTRY_DSN (client)
- SENTRY_DSN (server)
- SENTRY_ORG, SENTRY_PROJECT (build-time source maps)
