export default {
    name: "thankYouMessage",
    title: "Thank You Message",
    type: "document",
    fields: [
        {
            name: "message",
            title: "Message",
            type: "array",
            of: [
                {
                    type: "block",
                },
            ]
        },
    ],
}
