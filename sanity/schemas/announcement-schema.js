export default {
  name: "announcement",
  title: "Announcements",
  type: "document",
  fields: [
    { name: "message", title: "Message", type: "string", validation: Rule => Rule.required().max(140) },
    { name: "link", title: "Link URL (optional)", type: "string" },
    { name: "isActive", title: "Active", type: "boolean", initialValue: true },
  ],
}
