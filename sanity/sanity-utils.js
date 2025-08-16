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

export async function createQuote(
  firstName,
  email,
  phoneNumber,
  location,
  destination,
  moveType,
  bedrooms,
  moveDate,
  referrals
) {
  try {
    return createClient(clientConfig).create({
      _type: "quote",

      firstName,
      email,
      phoneNumber,
      location,
      destination,
      moveType,
      bedrooms,
      moveDate,
      referrals
    })
  } catch (error) {
    console.log(error)
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
