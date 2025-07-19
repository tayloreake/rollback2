export default {
    name: "newreview",
    title: "New Reviews",
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
            name: "title",
            title: "Title",
            type: "string",
            validation: Rule => Rule.required(),
        },
        {
            name: "rating",
            title: "Rating",
            type: "number",
            validation: Rule =>
                Rule.min(1)         // ✅ Greater than or equal to 1
                    .max(5)       // ✅ Less than or equal to 5
                    .error('Rating must be between 1 and 5')
                    .required(),
        },

        {
            name: "review",
            title: "Review Text",
            type: "text",
        },
        {
            name: "logo",
            title: "dp",
            type: "image",
            options: {
                hotspot: true,
            },
            validation: Rule => Rule.required(),
        },
        {
            name: "imageAlt",
            title: "Logo Alternative Text",
            type: "string",
            options: {
                source: "title",
                maxLength: 20,
            },
        },
        {
            name: "createdAt",
            title: "Created At",
            type: "datetime",
        },
    ],
}
