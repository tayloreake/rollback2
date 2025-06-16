export default {
    name: "clientcategory",
    title: "Client Categories",
    type: "document",
    fields: [
        {
            name: "category",
            title: "Category",
            type: "string",
        },
        {
            name: "key",
            title: "key",
            type: "string",
            require: true
        },
    ],
}
