import { createClient, groq } from "next-sanity"
import clientConfig from "./config/client-config"

export async function getLandingPageData() {
  return createClient(clientConfig).fetch(
    groq`
    *[_type == "landingPage"] {
        ...,}
      `
  )
}
export async function getAboutPageData() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "aboutPage"]{
        ...,
      }`
  )
}
export async function getServicesPageData() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "servicesPage"]{
        ...,
      }`
  )
}

export async function getBlogs() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "blogs"]{
        ...,
        title,
        content[]{
          ...,
          _type == "image" => {
            ...,
            asset->{
              _id,
              url
            }
          }
        }
      }`
  )
}
export async function getBlog(slug) {
  return createClient(clientConfig).fetch(`
  *[_type=="blogs" && slug.current == '${slug}'][0]
`)
}
export async function getBlogsByCategory(key) {
  return createClient(clientConfig).fetch(`
  *[_type=="blogs" && '${key}' in blogCategories[]->_ref]
`)
}
export async function getCategories() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "categories"]{
        ...,
      }`
  )
}

export async function getClientCategories() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "clientcategory"]{
        ...,
      }`
  )
}
export async function getClientLogos() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "clientlogo"]{
        ...,
        logoCategories[]->{
          category,
          key
        }
      }`
  )
}

export async function getClientReviews() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "newreview"]{
        ...,
        
      }`
  )
}
export async function getSiteLogos() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "siteLogos"]{
        ...,
        
      }`
  )
}
export async function getLandingServices() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "landingService"]{
        ...,
        
      }`
  )
}
export async function getLandingAbout() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "landingAbout"]{
        ...,
        
      }`
  )
}
export async function getServicesData() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "service" && !(_id in path('drafts.**'))]{
        ...,
        
      }`
  )
}
export async function getAboutData() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "about"]{
        ...,
      }`
  )
}

export async function getThankYouMessageData() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "thankYouMessage"][0]{
        ...,
      }`
  )
}
export async function getTags() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "tags"]{
        ...,
      }`
  )
}
export async function getBlacklistedIps() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "blacklistedips"]{
        ...,
      }`
  )
}

// Function to get case study blog posts (matching any blogs that could be case studies)
export async function getCaseStudyBlogs(limit = 5) {
  return createClient(clientConfig).fetch(
    groq`*[_type == "blogs" && (
      blogTitle match "*case study*" ||
      blogTitle match "*Case Study*" ||
      blogTitle match "*move*" ||
      blogTitle match "*Move*" ||
      blogTitle match "*relocation*" ||
      blogTitle match "*Relocation*" ||
      blogTitle match "*to*" ||
      "case study" in blogCategories[]->category ||
      "Case Study" in blogCategories[]->category ||
      "case studies" in blogCategories[]->category ||
      "Case Studies" in blogCategories[]->category ||
      "moving case study" in blogCategories[]->category ||
      "international move" in blogCategories[]->category ||
      "relocation" in blogCategories[]->category ||
      "moving" in blogCategories[]->category ||
      "international" in blogCategories[]->category
    )] | order(date desc) [0...${limit}] {
      _id,
      blogTitle,
      slug,
      blogExcerpt,
      date,
      blogCategories[]->{
        category
      }
    }`
  )
}

// Fallback function to get recent blog posts if no case studies found
export async function getRecentBlogs(limit = 5) {
  return createClient(clientConfig).fetch(
    groq`*[_type == "blogs"] | order(date desc) [0...${limit}] {
      _id,
      blogTitle,
      slug,
      blogExcerpt,
      date,
      blogCategories[]->{
        category
      }
    }`
  )
}

export async function createQuote(
  firstName,
  email,
  phoneNumber,
  location,
  destination,
  moveType,
  bedrooms,
  moveDate,
  referrals,
  ipAddress = null,
  ipDetails = null,
  geolocation = null,
  recaptchaScore = null,
  emailSent = false,
  smsSent = false
) {
  try {
    const quoteData = {
      _type: "quote",
      firstName,
      email,
      phoneNumber,
      location,
      destination,
      moveType,
      bedrooms,
      moveDate,
      refferals: referrals,
      submittedAt: new Date().toISOString(),
      submissionStatus: "pending",
      emailSent,
      smsSent,
    };

    // Add IP tracking data if provided
    if (ipAddress) {
      quoteData.ipAddress = ipAddress;
    }
    if (ipDetails) {
      quoteData.ipDetails = ipDetails;
    }
    if (geolocation) {
      quoteData.geolocation = geolocation;
    }
    if (recaptchaScore !== null) {
      quoteData.recaptchaScore = recaptchaScore;
    }

    return createClient(clientConfig).create(quoteData);
  } catch (error) {
    console.error("Error creating quote in Sanity:", error);
    throw new Error("Failed to create quote");
  }
}

export async function createReview(sentiment, review, name, email) {
  const client = createClient(clientConfig)

  return client.create({
    _type: "review",
    name,
    email,
    sentiment,
    review,
    createdAt: new Date().toISOString(),
  })
}
