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
    '/500',
    '/ThankYou',
    '/test',
    '/hero-demo',
    '/enhanced-home',
    '/enhanced-home-backup',
    '/index-old-backup',
    '/Quotes',
    '/ServicesPage',
    '/services/legacy-service',
    '/services/corporate-staff-relocation-simple',
  ],

  // Additional paths to include
  additionalPaths: async (config) => {
    const result = []

    // Add service pages dynamically with shortened URLs
    const services = [
      { slug: 'home', priority: 0.9, changefreq: 'monthly' },
      { slug: 'office', priority: 0.9, changefreq: 'monthly' },
      { slug: 'corporate', priority: 0.9, changefreq: 'monthly' },
      { slug: 'intl', priority: 0.9, changefreq: 'weekly' },
      { slug: 'storage', priority: 0.8, changefreq: 'monthly' },
      { slug: 'long', priority: 0.9, changefreq: 'monthly' },
      { slug: 'special', priority: 0.8, changefreq: 'monthly' },
      { slug: 'moves', priority: 0.8, changefreq: 'monthly' }
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
    } else if (path.startsWith('/blog/')) {
      priority = 0.8
      changefreq = 'weekly'
    } else if (path === '/about' || path === '/contact') {
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
