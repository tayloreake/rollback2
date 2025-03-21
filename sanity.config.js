import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import landingPage from "./sanity/schemas/landingpage-schema"
import aboutPage from "./sanity/schemas/aboutpage-schema"
import category from "./sanity/schemas/category-schema"
import tag from "./sanity/schemas/tag-schema"
import blog from "./sanity/schemas/blog-schema"
import servicespage from "./sanity/schemas/servicespage-schema"
import quote from "./sanity/schemas/quote_req-schema"
import review from "./sanity/schemas/review-schema"

const config = defineConfig({
  projectId: "yisee90y",
  dataset: "production",
  title: "Taylor Website",
  apiVersion: "2023-06-19",
  basePath: "/admin",
  plugins: [deskTool()],
  schema: {
    types: [landingPage, aboutPage, servicespage, category, tag, blog, quote, review],
  },
})

export default config
