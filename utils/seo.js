// SEO utility functions for dynamic page metadata generation
import { generateOptimizedTitle, generateOptimizedDescription, generateEnhancedKeywords, generateFAQData, generateBreadcrumbs } from '../SEO/enhanced-seo'

/**
 * Generate complete page metadata for Next.js pages
 * @param {string} pageName - The page identifier (home, about, services, etc.)
 * @param {Object} options - Configuration options for metadata generation
 * @returns {Object} Complete metadata object for Next.js
 */
export const getPageMetadata = (pageName, options = {}) => {
  const {
    location = 'Nairobi',
    service = null,
    customTitle = null,
    customDescription = null,
    customKeywords = [],
    ogImage = null,
    includeLocalBusiness = true,
    includeService = true
  } = options

  // Generate optimized content
  const title = customTitle || generateOptimizedTitle(pageName, location, service)
  const description = customDescription || generateOptimizedDescription(pageName, location, service)
  const keywords = customKeywords.length > 0 ? customKeywords : generateEnhancedKeywords(pageName, location, service)

  return {
    title,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title,
      description,
      image: ogImage || '/images/taylor-movers-og.jpg',
      url: typeof window !== 'undefined' ? window.location.href : '',
      siteName: 'Taylor Movers Kenya',
      type: 'website',
      locale: 'en_KE'
    },
    twitter: {
      card: 'summary_large_image',
      site: '@taylormovers',
      title,
      description,
      image: ogImage || '/images/taylor-movers-twitter.jpg'
    }
  }
}

/**
 * Generate base metadata for any page
 */
export const generateBaseMetadata = (title, description, path = '', options = {}) => {
  const siteName = 'Taylor Movers Kenya'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://taylormovers.co.ke'
  const fullUrl = `${baseUrl}${path}`

  return {
    title: `${title} | ${siteName}`,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: fullUrl,
      siteName,
      locale: 'en_KE',
      type: 'website',
      ...options.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteName}`,
      description,
      ...options.twitter,
    },
    robots: {
      index: true,
      follow: true,
      ...options.robots,
    },
    ...options,
  }
}

/**
 * Generate service-specific metadata
 */
export const generateServiceMetadata = (service, location = 'Nairobi') => {
  return getPageMetadata('services', {
    location,
    service,
    includeService: true,
    includeLocalBusiness: false
  })
}

/**
 * Get structured data for local business
 */
export const getLocalBusinessStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    "name": "Taylor Movers Kenya",
    "image": "https://taylormovers.co.ke/images/logo.png",
    "telephone": "+254721410517",
    "email": "info@taylorea.com",
    "url": "https://taylormovers.co.ke",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Nairobi",
      "addressLocality": "Nairobi",
      "addressRegion": "Nairobi County",
      "addressCountry": "KE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -1.2921,
      "longitude": 36.8219
    },
    "openingHours": "Mo-Sa 08:00-18:00",
    "priceRange": "$$",
    "serviceArea": {
      "@type": "State",
      "name": "Kenya"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Moving Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Household Moving",
            "description": "Professional household moving services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Office Moving",
            "description": "Office and corporate relocation services"
          }
        }
      ]
    }
  }
}

export default getPageMetadata