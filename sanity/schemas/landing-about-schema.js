export default {
    name: "landingAbout",
    title: "Landing ABout",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Blog Title",
            type: "string",
        },

        {
            name: "text",
            title: "Text",
            type: "array",
            of: [
                {
                    type: "block",
                },
            ]
        },
        {
            name: "aboutImage",
            title: "About Image",
            type: "object",
            fields: [
                {
                    name: "image",
                    title: "logo",
                    type: "image",

                },
                {
                    name: "alt",
                    title: "alternative text",
                    type: "string"
                }
            ],
        },

    ],
}
