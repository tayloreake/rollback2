import { createClient } from "next-sanity"

// Server-only Sanity client. Uses SANITY_API_TOKEN (never NEXT_PUBLIC_).
// Import this ONLY from API routes / getStaticProps / getServerSideProps.
const serverConfig = {
  projectId: "bsg3746e",
  dataset: "production",
  apiVersion: "2023-06-19",
  token: process.env.SANITY_API_TOKEN || process.env.NEXT_SANITY_API_TOKEN,
  useCdn: false,
  perspective: 'published',
}

export const getServerClient = () => createClient(serverConfig)
export default serverConfig
