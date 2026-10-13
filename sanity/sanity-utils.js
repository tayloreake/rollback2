import { createClient, groq } from "next-sanity"
import imageUrlBuilder from "@sanity/image-url"
import clientConfig from "./config/client-config"
import serverConfig from "./config/server-client"

// Reads use the public tokenless client.
// Writes (createQuote/createReview) must use the server token when available.
const getWriteClient = () => {
  const token = process.env.SANITY_API_TOKEN || process.env.NEXT_SANITY_API_TOKEN
  if (token && !token.startsWith("REVOKED")) return createClient({ ...serverConfig, token })
  return createClient(clientConfig)
}

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
    groq`*[_type == "blogs" && !(_id in path('drafts.**')) && defined(slug.current)]{
        _id,
        blogTitle,
        blogExcerpt,
        blogImage,
        date,
        slug,
        author->{
          authorName,
          authorImage
        },
        blogCategories[]->{
          category
        },
        blogTags[]->{
          tag
        },
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
      } | order(date desc)`
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
    groq`*[_type == "newreview" && (!defined(approved) || approved == true)]{
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

// CMS SEO override for a service page (Sanity `service` doc metaTitle /
// metaDescription / ogImage, falling back to hardcoded values when empty).
// Matches the doc whose slug equals the page's service key, with aliases for
// legacy slug differences (e.g. office-relocation → office-moves).
// Also returns the doc's rich-text `content` for CMS-driven body sections.
const SERVICE_SLUG_ALIASES = {
  "office-relocation": "office-moves",
  "residential-moving": "residential-moves",
  "international-moving": "international-moves",
  "storage-services": "warehousing-and-storage",
}

export async function getServiceSEO(serviceKey) {
  try {
    const all = await getServicesData()
    const slugs = [serviceKey, SERVICE_SLUG_ALIASES[serviceKey]].filter(Boolean)
    const match = (all || []).find((s) => s?.slug?.current && slugs.includes(s.slug.current))
    if (!match) return null
    let ogImageUrl = null
    try {
      const src = match.ogImage || match.image
      if (src) ogImageUrl = imageUrlBuilder(clientConfig).image(src).url()
    } catch {}
    const content = match.local || match.international || match.others ? {
      overview: match.local || null,
      whyChooseUs: match.international || null,
      process: [...(match.others || []), ...(match.presurvey || [])] || null,
      name: match.name || null,
    } : null
    if (!match.metaTitle && !match.metaDescription && !ogImageUrl && !content) return null
    return {
      metaTitle: match.metaTitle || null,
      metaDescription: match.metaDescription || null,
      ogImageUrl,
      content,
    }
  } catch { return null }
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

// CMS-managed content (non-PII — safe on the public dataset)
export async function getFaqs() {
  try {
    return createClient(clientConfig).fetch(
      groq`*[_type == "faq"] | order(order asc) { _id, question, answer }`
    )
  } catch { return [] }
}

export async function getJobs() {
  try {
    return createClient(clientConfig).fetch(
      groq`*[_type == "job" && isOpen != false] | order(order asc) { _id, title, department, location, type, description, requirements }`
    )
  } catch { return [] }
}

export async function getAnnouncement() {
  try {
    return createClient(clientConfig).fetch(
      groq`*[_type == "announcement" && isActive == true][0] { message, link }`
    )
  } catch { return null }
}

// Function to get case study blog posts filtered by "Case Studies" category
export async function getCaseStudyBlogs(limit = 5) {
  try {
    const allBlogs = await createClient(clientConfig).fetch(
      groq`*[_type == "blogs" && defined(blogTitle) && !(_id in path('drafts.**'))] | order(date desc) {
        _id,
        blogTitle,
        slug,
        blogExcerpt,
        blogImage,
        date,
        author->{
          authorName,
          authorImage
        },
        blogCategories[]->{
          category
        }
      }`
    );
    
    // Filter blogs that have "Case Studies" category
    const caseStudyBlogs = allBlogs.filter(blog => {
      return blog.blogCategories?.some(cat => 
        cat.category?.toLowerCase().includes('case stud')
      );
    });
    
    return caseStudyBlogs.slice(0, limit);
  } catch (error) {
    console.error('Error fetching case study blogs:', error);
    return [];
  }
}

// Fallback function to get recent blog posts if no case studies found
export async function getRecentBlogs(limit = 5) {
  try {
    return createClient(clientConfig).fetch(
      groq`*[_type == "blogs" && defined(blogTitle)] | order(date desc) [0...${limit}] {
        _id,
        blogTitle,
        slug,
        blogExcerpt,
        date
      }`
    )
  } catch (error) {
    console.error('Error fetching recent blogs:', error);
    return [];
  }
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
  // Sanity Security §2: production quote writes are DISABLED by default.
  // Set QUOTE_SANITY_WRITE_ENABLED=true only as a temporary fallback, and
  // NEVER to the public production dataset (use a private dataset instead).
  if (process.env.QUOTE_SANITY_WRITE_ENABLED !== "true") {
    console.warn("createQuote blocked: production quote writes are disabled (see Sanity Security §2)")
    return null
  }
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

    return getWriteClient().create(quoteData);
  } catch (error) {
    console.error("Error creating quote in Sanity:", error);
    throw new Error("Failed to create quote");
  }
}

export async function createReview(sentiment, review, name, email) {
  const client = getWriteClient()

  return client.create({
    _type: "review",
    name,
    email,
    sentiment,
    review,
    createdAt: new Date().toISOString(),
  })
}
