import { NextResponse } from "next/server"

// Exact-case 301s for the mixed-case → lowercase URL migration (audit §4 P2).
// These MUST live here and not in next.config.js redirects: redirect sources
// match case-insensitively, so '/About' → '/about' would also match '/about'
// itself and loop forever. JS string comparison is case-sensitive, so this
// only fires on the exact legacy casing.
const CASE_MAP = {
  "/About": "/about",
  "/Contacts": "/contact",
  "/Feedback": "/feedback",
  "/Gallery": "/gallery",
  "/Jobs": "/jobs",
  "/Privacy": "/privacy",
  "/Quote": "/quote",
  "/ServicesPage": "/services",
  "/Services": "/services",
}

export function middleware(req) {
  const { pathname, search } = req.nextUrl
  if (CASE_MAP[pathname]) {
    return NextResponse.redirect(new URL(CASE_MAP[pathname] + search, req.url), 308)
  }
  if (pathname === "/Blog" || pathname.startsWith("/Blog/")) {
    return NextResponse.redirect(
      new URL(pathname.replace("/Blog", "/blog") + search, req.url),
      308
    )
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/About", "/Contacts", "/Feedback", "/Gallery", "/Jobs", "/Privacy", "/Quote", "/ServicesPage", "/Services", "/Blog", "/Blog/:slug*"],
}
