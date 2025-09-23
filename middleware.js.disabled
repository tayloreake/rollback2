// middleware.js
import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

// Create an Edge-compatible Sanity client
const sanity = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: new Date().toISOString().split('T')[0],
    token: process.env.NEXT_SANITY_API_TOKEN,
    useCdn: false,
})

export async function middleware(req) {
    const ip =
        req.ip ||
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('remote-addr')

    // Fetch the blacklisted IPs from Sanity
    const blacklistedIps = await sanity.fetch(`*[_type == "blacklistedips"].ip`)


    if (blacklistedIps.includes(ip)) {
        return new NextResponse('Access Denied.', { status: 403 })
    }

    return NextResponse.next()
}

// Apply middleware to all routes
export const config = {
    matcher: '/:path*',
}
