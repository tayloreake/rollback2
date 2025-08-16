import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import landingPage from "./sanity/schemas/landingpage-schema"
import aboutPage from "./sanity/schemas/aboutpage-schema"
import about from "./sanity/schemas/about-schema"
import category from "./sanity/schemas/category-schema"
import tag from "./sanity/schemas/tag-schema"
import blog from "./sanity/schemas/blog-schema"
import servicespage from "./sanity/schemas/servicespage-schema"
import quote from "./sanity/schemas/quote_req-schema"
import review from "./sanity/schemas/review-schema"
import clientreview from "./sanity/schemas/new-review-schema"
import clientlogo from "./sanity/schemas/client-logos-schema"
import clientcategory from "./sanity/schemas/client-categories-schema"
import service from "./sanity/schemas/services-schema"
import landingAbout from "./sanity/schemas/landing-about-schema"
import landingService from "./sanity/schemas/landing-services-schema"
import siteLogos from "./sanity/schemas/site-logos-schema";
import thankYouMessage from "./sanity/schemas/thankyou-schema";
import blacklistedip from "./sanity/schemas/blacklisted-schema";
const config = defineConfig({
  projectId: "bsg3746e",
  dataset: "production",
  title: "Taylor Website",
  apiVersion: new Date().toISOString().split('T')[0],
  basePath: "/admin",
  token:
    "skOIZWPqgTE6cFwT6u3RQ3r9f1eHfJ7CC1l29wlRsK0YyO21iUCuiZNuezGwIfNv7SHWq1vIxuYidCJJ06Xm140oeKv4Cp5zPaWc5ybkvJVczRsFH4mISePmqhDNqqiuOb3qhIRstZOeWfp2VVD7bg7xQlIovICLVHEKNNFoBQxEBM3u5fDH",
  plugins: [deskTool()],
  schema: {
    types: [service, landingPage, aboutPage, servicespage, category, tag, blog, quote, review, clientcategory, clientlogo, clientreview, about, landingAbout, landingService, siteLogos, thankYouMessage, blacklistedip],
  },
})

export default config
