export default {
    name: "landingService",
    title: "Landing Service",
    type: "document",
    fields: [

        {
            name: "serviceText",
            title: "Service Text",
            type: "string",

        },
        {
            name: "title",
            title: "Title",
            type: "string",

        },
        {
            name: "serviceImage",
            title: "Service Image",
            type: "object",
            fields: [
                {
                    name: "image",
                    title: "preview image",
                    type: "image",

                },
                {
                    name: "alt",
                    title: "alternative text",
                    type: "string"
                },
            ],
        },
        {
            name: "metaTitle",
            title: "SEO Meta Title (optional — falls back to title)",
            type: "string",
            validation: Rule => Rule.max(60),
        },
        {
            name: "metaDescription",
            title: "SEO Meta Description (optional — falls back to excerpt)",
            type: "text",
            validation: Rule => Rule.max(160),
        },
        {
            name: "ogImage",
            title: "Social Share Image (optional — falls back to service image)",
            type: "image",
            options: { hotspot: true },
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
        }

    ],
}
