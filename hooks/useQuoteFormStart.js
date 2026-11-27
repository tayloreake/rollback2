import { useRef } from "react"
import { gtmTrackEvent } from "../utils/gtm"

export default function useQuoteFormStart(placement) {
  const started = useRef(false)

  return ({ target }) => {
    if (started.current || !target.matches("input:not([type=hidden]), select, textarea")) return
    if (target.name === "website") return // Ignore the honeypot.

    started.current = true
    gtmTrackEvent({ event: "quote_form_start", form_id: "quote", placement })
  }
}
