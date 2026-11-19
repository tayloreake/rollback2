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
- AdGroup_Name (text)
- Click_Type (text)
- Device_Type (text)
- Ad_Network (text)
- Ad_Account_Name (text)
- Platform (text/picklist)
- Keyword (text)
- Form_Name (text)
- Form_ID (text)
- Page_Name (text)
- UTM_Source, UTM_Medium, UTM_Campaign, UTM_Term, UTM_Content (text)
- GCLID (text) — legacy field; this org stores direct API writes as null
- Google_Click_ID (text) — durable field, used for offline conversions
- FB_Click_ID (text)
- Referrer_URL (text)
- Lead_Source (picklist/text)

For Zoho's Google Ads integration, the server now sends the GCLID using Zoho's
special `$gclid` API property in addition to the custom `Google_Click_ID` copy.
The `$gclid` property is an API instruction for Zoho's integration, not a Lead
field to create. The `Google Ads Information` section is managed by Zoho and
its values are read-only; Zoho matches the GCLID to Ads data after the click.
The regular custom `GCLID` field alone did not persist in this org.

The website also forwards Google ValueTrack data when present: `campaignid` /
`campaign_id`, `adgroupid` / `ad_group_id`, `adgroup_name`, `creative`, `keyword`,
`matchtype`, `click_type`, `network`, and `device`. It stores the available ad
group, click type, device type, and ad network values in the custom fields
above. The Zoho-managed Google Ads section is filled
from the `$gclid` match and may take 24–72 hours after a valid ad click.
If Zoho rejects an optional custom field, the lead is retried without that
field and its API name is logged as `Zoho rejected field ...`.

Click cost, conversion cost, export date/status, click type, device type,
network, ad group, and export failure reason come from Zoho's Google Ads
integration; the website cannot write these read-only fields directly.

Google Ads offline conversions env vars:
- GOOGLE_ADS_CLIENT_ID
- GOOGLE_ADS_CLIENT_SECRET
- GOOGLE_ADS_REFRESH_TOKEN (OAuth grant must include `https://www.googleapis.com/auth/datamanager`)
- GOOGLE_ADS_CUSTOMER_ID
- GOOGLE_ADS_CONVERSION_ACTION_ID
- GOOGLE_ADS_LOGIN_CUSTOMER_ID (optional; defaults to CUSTOMER_ID)
Endpoint: POST /api/google-ads-conversions { gclid? | gbraid? | wbraid?, conversionDateTime?, value?, currency?, orderId? }

This route uses the Google Data Manager API. The conversion action must be an
`UPLOAD_CLICKS` action, and the OAuth user must have access to the login and
operating accounts. This route is for server-side offline conversions; do not
send the same form-submit conversion to the same action already used by GTM.

Sentry env vars (optional):
- NEXT_PUBLIC_SENTRY_DSN (client)
- SENTRY_DSN (server)
- SENTRY_ORG, SENTRY_PROJECT (build-time source maps)
