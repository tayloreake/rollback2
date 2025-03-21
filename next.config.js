/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["cdn.sanity.io"],
  },
  experimental: {
    esmExternals: "loose", // Allows CJS modules to be imported
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.c?js$/,
      resolve: { fullySpecified: false },
    });
    return config;
  },
}

module.exports = nextConfig
