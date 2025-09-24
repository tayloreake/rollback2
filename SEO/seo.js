// Comprehensive SEO metadata generator
const getPageMetadata = (pageName, options = {}) => {
  const {
    location = 'Nairobi',
    service = null,
    customTitle = null,
    customDescription = null,
    customKeywords = [],
    includeLocalBusiness = false,
    includeService = false
  } = options

  // Generate basic metadata
  const title = customTitle || `${pageName} - Taylor Movers ${location}`
  const description = customDescription || `Professional moving services in ${location}. Taylor Movers provides reliable and efficient moving solutions.`
  const keywords = customKeywords.length > 0 ? customKeywords : [
    'moving services', 'relocation', location.toLowerCase(), 'professional movers',
    'kenya movers', 'nairobi moving company', 'taylor movers'
  ]
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taylorea.com'
  const currentPath = service ? `/services/${service}` : (pageName === 'home' ? '/' : `/${pageName}`)
  const canonicalUrl = `${siteUrl}${currentPath}`

  return {
    title,
    description,
    keywords: keywords.join(', '),
    canonical: canonicalUrl,
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Taylor Movers Kenya',
      locale: 'en_US',
      image: `${siteUrl}/assets/General/logo.png`
    },
    twitter: {
      card: 'summary_large_image',
      site: '@taylormoverske',
      title,
      description,
      image: `${siteUrl}/assets/General/logo.png`
    },
    structuredData: includeLocalBusiness ? generateLocalBusinessData() : (includeService ? generateServiceData(service, location) : null)
  }
}

// Generate Local Business structured data
const generateLocalBusinessData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'MovingCompany',
    name: 'Taylor Movers Kenya',
    alternateName: 'Taylor Movers',
    url: 'https://taylorea.com',
    logo: 'https://taylorea.com/assets/General/logo.png',
    description: 'Professional moving and relocation services in Kenya since 2008. Residential, office, and international moves with full insurance coverage.',
    foundingDate: '2008',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Nazarene Complex Suite 1, Central Church of the Nazarene',
      addressLocality: 'Nairobi',
      addressCountry: 'Kenya'
    },
    telephone: '+254721410517',
    email: 'info@taylorea.com',
    priceRange: '$$',
    serviceArea: {
      '@type': 'Country',
      name: 'Kenya'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Moving Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Residential Moving',
            description: 'Professional home moving services'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Office Relocation',
            description: 'Business moving and office relocation services'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'International Moving',
            description: 'Global relocation and international moving services'
          }
        }
      ]
    }
  }
}

// Generate Service structured data
const generateServiceData = (service, location) => {
  const serviceNames = {
    'residential-moving': 'Residential Moving Services',
    'office-relocation': 'Office Relocation Services', 
    'international-moving': 'International Moving Services',
    'storage-services': 'Storage and Warehousing Services',
    'corporate-staff-relocation': 'Corporate Staff Relocation Services',
    'long-distance-moving': 'Long Distance Moving Services',
    'specialized-services': 'Specialized Moving Services',
    'consolidated-moves': 'Consolidated Moving Services'
  }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceNames[service] || `${service} Services`,
    provider: {
      '@type': 'MovingCompany',
      name: 'Taylor Movers Kenya',
      telephone: '+254721410517',
      url: 'https://taylorea.com'
    },
    areaServed: {
      '@type': 'Country',
      name: 'Kenya'
    },
    availableLanguage: 'English'
  }
}

// Base metadata generator function
export const generateBaseMetadata = (title, description, path = '', options = {}) => {
  const siteName = 'Taylor Movers';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://taylormovers.co.ke';
  const fullUrl = `${baseUrl}${path}`;

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
      locale: 'en_US',
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
  };
};

// Blog post metadata generator
export const generateBlogMetadata = (post, options = {}) => {
  const metadata = generateBaseMetadata(
    post.title,
    post.excerpt || post.description,
    `/blog/${post.slug}`,
    {
      openGraph: {
        type: 'article',
        publishedTime: post.date,
        authors: [post.author],
        ...options.openGraph,
      },
      ...options,
    }
  );
  return metadata;
};

// Enhanced service page metadata generator
export const generateServicesPageMetadata = (serviceKeys, options = {}) => {
  const { location = 'Nairobi', service = null } = options
  
  return getPageMetadata('services', {
    location,
    service,
    customTitle: service ? `${service} Services - Taylor Movers ${location}` : null,
    customDescription: service ? `Professional ${service} services in ${location}. Taylor Movers provides reliable moving solutions.` : null
  })
}

// Enhanced page metadata for specific service pages
export const generateServicePageSEO = (slug, location = 'Nairobi') => {
  return getPageMetadata('services', {
    location,
    service: slug
  })
}

export default getPageMetadata
