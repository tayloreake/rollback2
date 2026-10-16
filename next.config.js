/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable for faster dev builds
  swcMinify: true,
  
  // Image optimization
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/avif', 'image/webp'],
    // Disable optimization in dev for faster loading
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Experimental features
  experimental: {
    esmExternals: true,
  },
  
  // Webpack optimization for MUCH faster builds
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Aggressive caching for faster rebuilds
      config.cache = {
        type: 'filesystem',
        compression: 'gzip',
      }
      
      // Faster builds - disable some optimizations in dev
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      }
    }
    
    // Reduce bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  },
  
  // Enable SWC compiler for faster builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Keep MORE pages in memory for faster navigation
  onDemandEntries: {
    maxInactiveAge: 120 * 1000, // 2 minutes
    pagesBufferLength: 15, // Keep 15 pages in memory
  },
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,

  // Don't expose Next.js version (audit §5)
  poweredByHeader: false,

  // Rewrites (audit §4 P1: /server-sitemap.xml must not 404)
  async rewrites() {
    return [
      { source: '/server-sitemap.xml', destination: '/api/server-sitemap' },
    ]
  },

  // 301s for deleted/merged pages (audit §4 P1/P2).
  // NOTE: same-spelling case redirects (/About→/about etc.) live in
  // middleware.js — next.config sources match case-insensitively and would
  // self-loop (/about→/about). Only genuinely-different paths go here.
  async redirects() {
    return [
      { source: '/Quotes', destination: '/quote', permanent: true },
      { source: '/ServicesPage', destination: '/services', permanent: true },
      { source: '/services/moves', destination: '/services/long', permanent: true },
      // Legacy service slugs still indexed / linked externally.
      { source: '/services/international', destination: '/services/intl', permanent: true },
      { source: '/services/office-moving', destination: '/services/office', permanent: true },
      { source: '/services/international-moving', destination: '/services/intl', permanent: true },
      { source: '/services/office-relocation', destination: '/services/office', permanent: true },
      // Thank-you casing: file route is /ThankYou (case-sensitive on Vercel),
      // Ads + audit expect lowercase. Normalize to the real route.
      { source: '/thank-you', destination: '/ThankYou', permanent: true },
      { source: '/services/legacy-service', destination: '/services', permanent: true },
      { source: '/services/corporate-staff-relocation-simple', destination: '/services/corporate', permanent: true },
      { source: '/test', destination: '/', permanent: true },
      { source: '/hero-demo', destination: '/', permanent: true },
      { source: '/enhanced-home', destination: '/', permanent: true },
      { source: '/enhanced-home-backup', destination: '/', permanent: true },
      { source: '/index-old-backup', destination: '/', permanent: true },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.taylorea.com' }],
        destination: 'https://taylorea.com/:path*',
        permanent: true,
      },
    ]
  },

  // Security headers (audit §5 P1). CSP starts in Report-Only so GTM/Ads/Zoho
  // aren't broken; promote to enforcing after reviewing reports.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://cdn.pagesense.io https://*.zohopublic.com https://www.google.com https://www.gstatic.com https://connect.facebook.net https://snap.licdn.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://www.google-analytics.com https://www.facebook.com https://cdn.sanity.io",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://stats.g.doubleclick.net https://cdn.sanity.io https://*.sanity.io",
              "frame-src https://www.googletagmanager.com https://www.google.com https://*.zohopublic.com",
              'report-uri /api/csp-report',
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
