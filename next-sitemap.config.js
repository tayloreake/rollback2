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
    '/thank-you',
    '/services/moves',
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
  // NOTE: service pages (office, intl, long, etc.) exist as files in
  // pages/services/ and are auto-discovered — do NOT re-list them here
  // (that duplicates every service URL in the sitemap). Only list routes
  // next-sitemap cannot discover (none currently).
  additionalPaths: async (config) => {
    return []
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

    // NOTE: no lastmod here — stamping every URL with "now" on each build
    // makes Google recrawl everything pointlessly. next-sitemap omits
    // lastmod when autoLastmod is false (set below); server-sitemap.xml
    // carries real _updatedAt per blog post.
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: undefined,
    }
  },
  autoLastmod: false,

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
