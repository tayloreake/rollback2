import { useEffect } from "react"
import { gtmPushPhoneClick, gtmPushWhatsAppClick } from "../utils/gtm"

// T6 — delegated click tracking for every `tel:` and `wa.me` link on the site
// (Navbar, Footer, StickyMobileBar, quote forms, service pages...). One
// document-level listener beats adding an onClick to ~20 anchors, and the
// push functions de-dupe against component-level handlers.
// Fires regardless of consent — GTM decides what leaves the browser.

const CHANNEL_BY_REF = {
  WEB: "Website",
  FB: "Facebook",
  IG: "Instagram",
  GBP: "Google Business Profile",
  WA: "WhatsApp",
}

// wa.me links carry their ref either as ?ref=CODE or inside the prefilled
// text as "(ref: CODE)" — both are used across the site today.
const parseWhatsApp = (href) => {
  try {
    const url = new URL(href)
    const text = url.searchParams.get("text") || ""
    const marker = text.match(/\(?\bref\s*[:=]\s*([^)]+?)\)?\s*$/i)
    const ref = (url.searchParams.get("ref") || (marker ? marker[1] : "") || "").trim()
    const channel =
      url.searchParams.get("channel") ||
      CHANNEL_BY_REF[ref.toUpperCase()] ||
      "Website"
    return { ref, channel }
  } catch {
    return { ref: "", channel: "Website" }
  }
}

export const useClickTracking = () => {
  useEffect(() => {
    const handleClick = (e) => {
      try {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        const anchor = e.target && e.target.closest ? e.target.closest("a[href]") : null
        if (!anchor) return
        const href = anchor.getAttribute("href") || ""

        if (/^tel:/i.test(href)) {
          gtmPushPhoneClick(decodeURIComponent(href.slice(4)).trim())
          return
        }
        if (/wa\.me\//i.test(href)) {
          const { ref, channel } = parseWhatsApp(href)
          gtmPushWhatsAppClick(ref, channel)
        }
      } catch { /* no-op — tracking must never break navigation */ }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])
}

export default useClickTracking
