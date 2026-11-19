// Public client config — NEVER put an API token here.
// Client queries run against the public `production` dataset and need no token.
// Server-side mutations (API routes / getStaticProps) must use
// `process.env.SANITY_API_TOKEN` via `sanity/config/server-client.js`.
const config = {
  projectId: "bsg3746e",
  dataset: "production",
  apiVersion: "2023-06-19",
  useCdn: true, // Use CDN for faster content delivery
  perspective: 'published', // Only fetch published content
}

export default config
