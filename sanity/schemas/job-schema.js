export default {
  name: "job",
  title: "Job Openings",
  type: "document",
  fields: [
    { name: "title", title: "Job Title", type: "string", validation: Rule => Rule.required() },
    { name: "department", title: "Department", type: "string" },
    { name: "location", title: "Location", type: "string", initialValue: "Nairobi, Kenya" },
    { name: "type", title: "Employment Type", type: "string", options: { list: ["Full-time", "Part-time", "Contract"] } },
    { name: "description", title: "Description", type: "text" },
    { name: "requirements", title: "Requirements", type: "array", of: [{ type: "string" }] },
    { name: "isOpen", title: "Accepting Applications", type: "boolean", initialValue: true },
    { name: "order", title: "Display Order", type: "number", initialValue: 0 },
  ],
  orderings: [{ title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
}
