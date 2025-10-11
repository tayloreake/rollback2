export default {
  name: "quote",
  title: "Quote submissions",
  type: "document",
  fields: [
    {
      name: "firstName",
      title: "First Name",
      type: "string",
    },
    {
      name: "email",
      title: "Email",
      type: "string",
    },
    {
      name: "phoneNumber",
      title: "Phone Number",
      type: "text",
    },
    {
      name: "location",
      title: "Current Location",
      type: "text",
    },
    {
      name: "destination",
      title: "Destnation Location",
      type: "text",
    },
    {
      name: "moveType",
      title: "Move Type",
      type: "text",
    },
    {
      name: "bedrooms",
      title: "Number of bedrooms",
      type: "text",
    },
    {
      name: "moveDate",
      title: "Move Date",
      type: "text",
    },
    {
      name: "refferals",
      title: "Refferals",
      type: "text",
    },
    // IP Tracking and Spam Detection Fields
    {
      name: "ipAddress",
      title: "IP Address",
      type: "string",
      description: "Client IP address for spam detection",
      readOnly: true,
    },
    {
      name: "ipDetails",
      title: "IP Details",
      type: "object",
      description: "Detailed IP information including proxy headers",
      fields: [
        { name: "xForwardedFor", type: "string", title: "X-Forwarded-For" },
        { name: "xRealIp", type: "string", title: "X-Real-IP" },
        { name: "userAgent", type: "text", title: "User Agent" },
        { name: "referer", type: "string", title: "Referer" },
        { name: "origin", type: "string", title: "Origin" },
      ],
    },
    {
      name: "geolocation",
      title: "Geolocation",
      type: "object",
      description: "Geolocation data if available",
      fields: [
        { name: "country", type: "string", title: "Country" },
        { name: "city", type: "string", title: "City" },
        { name: "timezone", type: "string", title: "Timezone" },
      ],
    },
    {
      name: "recaptchaScore",
      title: "reCAPTCHA Score",
      type: "number",
      description: "reCAPTCHA v3 score (0.0 to 1.0, higher is more human-like)",
      readOnly: true,
    },
    {
      name: "submissionStatus",
      title: "Submission Status",
      type: "string",
      description: "Status of the quote submission",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Verified", value: "verified" },
          { title: "Spam", value: "spam" },
          { title: "Processed", value: "processed" },
        ],
      },
      initialValue: "pending",
    },
    {
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      description: "When the quote was submitted",
      readOnly: true,
    },
    {
      name: "emailSent",
      title: "Email Sent",
      type: "boolean",
      description: "Whether email notification was sent successfully",
      initialValue: false,
    },
    {
      name: "smsSent",
      title: "SMS Sent",
      type: "boolean",
      description: "Whether SMS notification was sent successfully",
      initialValue: false,
    },
    {
      name: "notes",
      title: "Admin Notes",
      type: "text",
      description: "Internal notes about this submission",
    },
  ],
  preview: {
    select: {
      title: "firstName",
      subtitle: "email",
      status: "submissionStatus",
      ip: "ipAddress",
    },
    prepare({ title, subtitle, status, ip }) {
      return {
        title: `${title} - ${status || 'pending'}`,
        subtitle: `${subtitle} | IP: ${ip || 'unknown'}`,
      };
    },
  },
  orderings: [
    {
      title: "Submission Date (Newest)",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
    {
      title: "Submission Date (Oldest)",
      name: "submittedAtAsc",
      by: [{ field: "submittedAt", direction: "asc" }],
    },
  ],
}
