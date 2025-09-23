/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://taylorea.com",
  generateRobotsTxt: true,

  // Exclude certain paths
  exclude: [
    '/admin/**',
    '/api/**',
    '/_next/**',
    '/404',
    '/500'
  ],

  // Additional paths to include
  additionalPaths: async (config) => {
    const result = []

    // Add service pages dynamically
    const services = [
      { slug: 'household-moving', priority: 0.9, changefreq: 'monthly' },
      { slug: 'office-relocation', priority: 0.9, changefreq: 'monthly' },
      { slug: 'corporate-relocation', priority: 0.8, changefreq: 'monthly' },
      { slug: 'warehousing-storage', priority: 0.8, changefreq: 'monthly' },
      { slug: 'international-moving', priority: 0.9, changefreq: 'weekly' }
    ]

    services.forEach(service => {
      result.push({
        loc: `/services/${service.slug}`,
        changefreq: service.changefreq,
        priority: service.priority,
        lastmod: new Date().toISOString()
      })
    })

    return result
  },

  // Transform function for dynamic content
  transform: async (config, path) => {
    // Custom priority and changefreq based on path
    let priority = 0.7
    let changefreq = 'weekly'

    if (path === '/') {
      priority = 1.0
      changefreq = 'daily'
    } else if (path.startsWith('/services/')) {
      priority = 0.9
      changefreq = 'monthly'
    } else if (path.startsWith('/Blog/')) {
      priority = 0.8
      changefreq = 'weekly'
    } else if (path === '/About' || path === '/Contacts') {
      priority = 0.8
      changefreq = 'monthly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },

  // Robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/']
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/']
      }
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://taylorea.com"}/server-sitemap.xml`
    ]
  }
}
