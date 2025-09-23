import { Rule } from "postcss";
import { validation } from "sanity";

export default {
    name: "service",
    title: "Services",
    type: "document",
    fields: [
        {
            name: "name",
            title: "Name",
            type: "string",
            validation: Rule => Rule.required(),
        },
        {
            name: "image",
            title: "Image",
            type: "image",
            options: {
                hotspot: true,
            },
            validation: Rule => Rule.required(),
        },
        {
            name: "category",
            title: "Category",
            type: 'reference',
            to: [{ type: 'categories' }]
        },
        {
            name: "description",
            title: "Service Description",
            type: 'array',
            of: [{
                type: 'block'
            }],
            description: 'Main description of the service that appears on the individual service page'
        },
        {
            name: "videoUrl",
            title: "YouTube Video URL",
            type: 'url',
            description: 'Optional YouTube URL to embed on the service page'
        },
        {
            name: "featuresLinks",
            title: "Features Links",
            type: 'array',
            of: [{
                type: 'object',
                name: 'featureLink',
                fields: [
                    { name: 'label', title: 'Label', type: 'string' },
                    { name: 'href', title: 'URL', type: 'string' }
                ]
            }]
        },
        {
            name: "titlePos",
            title: "Title Position",
            type: "string",
            validation: Rule => Rule.required(),
        },
        {
            name: "presurvey",
            title: "Presurvey",
            type: 'array',
            of: [
                {
                    type: 'block',
                },
            ],
            validation: Rule =>
                Rule.required(),
        },

        {
            name: "quotation",
            title: "Quotation",
            type: 'array',
            of: [
                {
                    type: 'block',
                },
            ], validation: Rule => Rule.required()
        },
        {
            name: "others",
            title: "More",
            type: 'array',
            of: [
                {
                    type: 'block',
                },
            ],
            validation: Rule => Rule.required(),
        },
        {
            name: "local",
            title: "Local",
            type: 'array',
            of: [
                {
                    type: 'block',
                },
            ],
            validation: Rule => Rule.required(),
        },
        {
            name: "international",
            title: "International",
            type: 'array',
            of: [
                {
                    type: 'block',
                },
            ],
            validation: Rule => Rule.required(),
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "name",
                maxLength: 96,
            },
        },
        {
            name: "createdAt",
            title: "Created At",
            type: "datetime",
        },
    ],
}
