/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  
  // Webpack optimization for faster builds
  webpack: (config, { dev }) => {
    if (dev) {
      // Faster incremental builds
      config.cache = {
        type: 'filesystem',
      }
    }
    return config
  },
  
  // Enable SWC compiler for faster builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Keep more pages in memory for faster navigation
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 1 minute
    pagesBufferLength: 8, // Keep 8 pages in memory
  },
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
