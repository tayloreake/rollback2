export default {
  name: "faq",
  title: "FAQs",
  type: "document",
  fields: [
    { name: "question", title: "Question", type: "string", validation: Rule => Rule.required() },
    { name: "answer", title: "Answer", type: "text", validation: Rule => Rule.required() },
    { name: "order", title: "Display Order", type: "number", initialValue: 0 },
  ],
  orderings: [{ title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
}
