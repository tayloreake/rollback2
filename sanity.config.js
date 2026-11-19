import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import landingPage from "./sanity/schemas/landingpage-schema"
import aboutPage from "./sanity/schemas/aboutpage-schema"
import about from "./sanity/schemas/about-schema"
import category from "./sanity/schemas/category-schema"
import tag from "./sanity/schemas/tag-schema"
import blog from "./sanity/schemas/blog-schema"
import servicespage from "./sanity/schemas/servicespage-schema"
import review from "./sanity/schemas/review-schema"
import clientreview from "./sanity/schemas/new-review-schema"
import clientlogo from "./sanity/schemas/client-logos-schema"
import clientcategory from "./sanity/schemas/client-categories-schema"
import service from "./sanity/schemas/services-schema"
import landingAbout from "./sanity/schemas/landing-about-schema"
import landingService from "./sanity/schemas/landing-services-schema"
import siteLogos from "./sanity/schemas/site-logos-schema";
import thankYouMessage from "./sanity/schemas/thankyou-schema";
import faq from "./sanity/schemas/faq-schema";
import job from "./sanity/schemas/job-schema";
import announcement from "./sanity/schemas/announcement-schema";
import galleryAlbum from "./sanity/schemas/gallery-album-schema";
import { GALLERY_CATEGORIES } from "./utils/galleryCategories.js";

// Studio sidebar: a "Gallery" section with one entry per category. Creating an
// album from inside a category pre-selects that category, so uploading is just:
// Gallery -> category -> + -> drag photos in -> Publish.
const structure = (S) =>
  S.list()
    .title("Website content")
    .items([
      S.listItem()
        .title("Gallery")
        .id("gallery")
        .child(
          S.list()
            .title("Gallery")
            .items([
              ...GALLERY_CATEGORIES.map((c) =>
                S.listItem()
                  .title(c.title)
                  .id(`gallery-${c.id}`)
                  .child(
                    S.documentList()
                      .title(c.title)
                      .schemaType("galleryAlbum")
                      .filter('_type == "galleryAlbum" && category == $category')
                      .params({ category: c.id })
                      .initialValueTemplates([S.initialValueTemplateItem("gallery-album-by-category", { category: c.id })])
                  )
              ),
              S.divider(),
              S.listItem().title("All albums").id("gallery-all").child(S.documentTypeList("galleryAlbum").title("All albums")),
            ])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() !== "galleryAlbum"),
    ]);
const config = defineConfig({
  projectId: "bsg3746e",
  dataset: "production",
  title: "Taylor Website",
  apiVersion: new Date().toISOString().split('T')[0],
  basePath: "/admin",
  // No token here — Studio uses logged-in user auth.
  // Server mutations must use SANITY_API_TOKEN env var (see sanity/config/server-client.js).
  plugins: [structureTool({ structure })],
  schema: {
    types: [service, landingPage, aboutPage, servicespage, category, tag, blog, review, clientcategory, clientlogo, clientreview, about, landingAbout, landingService, siteLogos, thankYouMessage, faq, job, announcement, galleryAlbum],
    templates: (prev) => [
      ...prev,
      {
        id: "gallery-album-by-category",
        title: "Gallery album",
        schemaType: "galleryAlbum",
        parameters: [{ name: "category", type: "string" }],
        value: (params) => ({ category: params.category }),
      },
    ],
  },
})

export default config