export default {
  name: "blogs",
  title: "Blogs",
  type: "document",
  fields: [
    {
      name: "blogCategories",
      type: "array",
      of: [
        {
          type: "reference",
          to: [
            {
              type: "categories",
            },
          ],
        },
      ],
    },
    {
      name: "blogTags",
      type: "array",
      of: [
        {
          type: "reference",
          to: [
            {
              type: "tags",
            },
          ],
        },
      ],
    },
    {
      name: "author",
      title: "Author",
      type: "object",
      fields: [
        {
          name: "authorName",
          title: "Author Name",
          type: "string",
        },
        {
          name: "authorImage",
          title: "Author Image",
          type: "image",
        },
      ],
    },
    {
      name: "date",
      title: "Date",
      type: "datetime",
    },
    {
      name: "blogTitle",
      title: "Blog Title",
      type: "string",
    },

    {
      name: "blogImage",
      title: "Blog Image",
      type: "image",
    },
    {
      name: "blogExcerpt",
      title: "Excerpt",
      type: "text",
      min: 100,
      max: 400,
    },
    {
      name: "blogText",
      title: "Blog Text",
      type: "array",
      of: [
        {
          type: "block",
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              description: 'Important for accessibility and SEO.'
            }
          ]
        }
      ],
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "blogTitle",
        maxLength: 96,
      },
    },
  ],
}
