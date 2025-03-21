export default {
  name: "review",
  title: "Reviews",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: Rule => Rule.required(),
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: Rule => Rule.required().email(),
    },
    {
      name: "sentiment",
      title: "Sentiment",
      type: "string",
      options: {
        list: [
          { title: "Very Happy", value: "very happy" },
          { title: "Happy", value: "happy" },
          { title: "Neutral", value: "neutral" },
          { title: "Unhappy", value: "unhappy" },
          { title: "Angry", value: "angry" },
        ],
      },
    },
    {
      name: "review",
      title: "Review Text",
      type: "text",
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    },
  ],
}
