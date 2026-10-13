// Leads-ledger schema (Sanity Security §8) — lives in the NEW PRIVATE
// `leads-ledger` dataset, never in public `production`.
export default {
  name: "lead",
  title: "Lead",
  type: "document",
  fields: [
    { name: "status", title: "Status", type: "string", initialValue: "received", options: { list: ["received", "synced_to_zoho"] } },
    { name: "zohoLeadId", title: "Zoho Lead ID", type: "string" },
    { name: "syncError", title: "Sync Error", type: "text" },
    { name: "firstName", title: "First Name", type: "string" },
    { name: "email", title: "Email", type: "string" },
    { name: "phoneNumber", title: "Phone Number", type: "string" },
    { name: "location", title: "Moving From", type: "string" },
    { name: "destination", title: "Moving To", type: "string" },
    { name: "moveType", title: "Move Type", type: "string" },
    { name: "bedrooms", title: "Property Size", type: "string" },
    { name: "moveDate", title: "Move Date", type: "string" },
    { name: "referrals", title: "Referrals", type: "string" },
    { name: "attribution", title: "Attribution", type: "object", fields: [
      { name: "utm_source", type: "string", title: "UTM Source" },
      { name: "utm_medium", type: "string", title: "UTM Medium" },
      { name: "utm_campaign", type: "string", title: "UTM Campaign" },
      { name: "gclid", type: "string", title: "GCLID" },
      { name: "landing_page", type: "string", title: "Landing Page" },
      { name: "referrer", type: "string", title: "Referrer" },
    ]},
    { name: "ipAddress", title: "IP Address", type: "string", readOnly: true },
    { name: "recaptchaScore", title: "reCAPTCHA Score", type: "number", readOnly: true },
    { name: "emailSent", title: "Email Sent", type: "boolean" },
    { name: "smsSent", title: "SMS Sent", type: "boolean" },
    { name: "submittedAt", title: "Submitted At", type: "datetime", readOnly: true },
  ],
}
