import { GALLERY_CATEGORIES } from "../../utils/galleryCategories.js"

// Gallery photos are grouped in "albums". An album = a category + a bunch of
// photos. To add photos: Studio -> Gallery -> pick a category -> New album ->
// drag & drop as many photos as you like onto the Photos box -> Publish.
export default {
  name: "galleryAlbum",
  title: "Gallery Album",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Album name",
      description: "For your reference and used in photo descriptions, e.g. \"KURA head office move 2025\".",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    },
    {
      name: "category",
      title: "Category",
      description: "Which gallery tab these photos appear under.",
      type: "string",
      options: {
        list: GALLERY_CATEGORIES.map((c) => ({ title: c.title, value: c.id })),
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "images",
      title: "Photos",
      description: "Drag and drop many photos at once. Drag to reorder. Descriptions are optional.",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", title: "Description (for accessibility and SEO)", type: "string" },
            { name: "caption", title: "Caption (shown when the photo is opened)", type: "string" },
          ],
        },
      ],
      options: { layout: "grid", sortable: true },
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "order",
      title: "Album order (optional)",
      description: "Lower numbers appear first within a category. Leave empty for newest first.",
      type: "number",
    },
  ],
  preview: {
    select: { title: "title", category: "category", media: "images.0" },
    prepare: ({ title, category, media }) => ({
      title,
      subtitle: GALLERY_CATEGORIES.find((c) => c.id === category)?.title || "No category",
      media,
    }),
  },
  orderings: [
    { title: "Newest first", name: "newest", by: [{ field: "_createdAt", direction: "desc" }] },
    { title: "Album order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
}
