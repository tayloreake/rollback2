export default {
    name: "clientlogo",
    title: "Client Logos",
    type: "document",
    fields: [
        {
            name: "logoCategories",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [
                        {
                            type: "clientcategory",
                        },
                    ],
                },
            ],
        },
        {
            name: "clientName",
            title: "Client Name",
            type: "string",
            validation: Rule => Rule.required(),
        },
        {
            name: "clientLogo",
            title: "Client Logo",
            type: "image",
            options: {
                hotspot: true,
            },
            validation: Rule => Rule.required(),
        },
        {
            name: "alt",
            title: "Alternative Text",
            type: "text",
            options: {
                source: "blogTitle",
                maxLength: 20,
            },
            validation: Rule => Rule.required(),
        }
    ],
}