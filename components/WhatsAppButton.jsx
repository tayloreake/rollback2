import React from "react"
import { getFormAttribution } from "../utils/attribution"

const PHONE = "254721410517"
const BASE_HREF = `https://wa.me/${PHONE}`

const createRef = () => {
  const bytes = new Uint32Array(1)
  window.crypto.getRandomValues(bytes)
  return String(10000000 + (bytes[0] % 90000000))
}

const sendClick = (payload) => {
  try {
    const body = new Blob([JSON.stringify(payload)], { type: "application/json" })
    if (navigator.sendBeacon?.("/api/wa-click", body)) return
    fetch("/api/wa-click", {
      method: "POST",
      body,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Attribution must never prevent WhatsApp from opening.
  }
}

export default function WhatsAppButton({ placement, children, ...props }) {
  const handleClick = (event) => {
    try {
      const ref = createRef()
      const message = `Hi Taylor, I'd like a quote (ref: ${ref})`
      const href = `${BASE_HREF}?text=${encodeURIComponent(message)}`
      const anchor = event.currentTarget
      anchor.href = href

      const urlParams = new URLSearchParams(window.location.search)
      const utm = {
        ...Object.fromEntries(urlParams.entries()),
        ...getFormAttribution(),
      }
      sendClick({
        ref,
        placement,
        page: window.location.pathname,
        referrer: document.referrer,
        utm,
      })

      if (window.dataLayer) {
        window.dataLayer.push({ event: "whatsapp_click", wa_ref: ref, placement })
      }
    } catch {
      // Keep the fallback href usable if tracking APIs are unavailable.
    }
  }

  return (
    <a
      {...props}
      href={BASE_HREF}
      target={props.target || "_blank"}
      rel={props.rel || "noreferrer"}
      data-wa-click-tracked="true"
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
