export default {
    name: "siteLogos",
    title: "Site Logos",
    type: "document",
    fields: [

        {
            name: "headerLogo",
            title: "Header logo",
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
        {
            name: "footerLogo",
            title: "Footer logo",
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
