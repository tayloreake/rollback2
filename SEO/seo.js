// Simple SEO metadata generator
const getPageMetadata = (pageName, options = {}) => {
  const {
    location = 'Nairobi',
    service = null,
    customTitle = null,
    customDescription = null,
    customKeywords = []
  } = options

  // Generate basic metadata
  const title = customTitle || `${pageName} - Taylor Movers ${location}`
  const description = customDescription || `Professional moving services in ${location}. Taylor Movers provides reliable and efficient moving solutions.`
  const keywords = customKeywords.length > 0 ? customKeywords : ['moving services', 'relocation', location.toLowerCase(), 'professional movers']

  return {
    title,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title,
      description,
      type: 'website'
    }
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
