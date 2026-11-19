import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Tokenless public client — urlFor() builds image URLs and needs no token.
// NEVER put an API token in this file: it ships in the browser bundle
// (audit: Sanity Security §7 — a write token lived here).
export const client = createClient({
    projectId: "bsg3746e",
    dataset: "production",
    apiVersion: "2023-06-19",
    useCdn: true, // Use CDN for faster content delivery
    perspective: 'published', // Only fetch published content
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
    return builder.image(source)
}