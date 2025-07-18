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
                }
            ],
        },

    ],
}
