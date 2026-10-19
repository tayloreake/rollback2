import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
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
const config = defineConfig({
  projectId: "bsg3746e",
  dataset: "production",
  title: "Taylor Website",
  apiVersion: new Date().toISOString().split('T')[0],
  basePath: "/admin",
  // No token here — Studio uses logged-in user auth.
  // Server mutations must use SANITY_API_TOKEN env var (see sanity/config/server-client.js).
  plugins: [deskTool()],
  schema: {
    types: [service, landingPage, aboutPage, servicespage, category, tag, blog, review, clientcategory, clientlogo, clientreview, about, landingAbout, landingService, siteLogos, thankYouMessage, faq, job, announcement],
  },
})

export default config