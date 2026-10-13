import { useEffect } from "react"

// Consent-gated Meta Pixel + LinkedIn Insight (audit §1 P1).
// Loads only after the visitor grants ads consent in ConsentBanner AND the
// corresponding env ID is set. Empty env = disabled (current default).
// Lead events hook into the existing `generate_lead` dataLayer push.
const META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || ""
const LINKEDIN_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || ""

const loadMeta = () => {
  if (!META_ID || window.fbq) return
  /* eslint-disable */
  !(function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq("init", META_ID)
  window.fbq("track", "PageView")
}

const loadLinkedIn = () => {
  if (!LINKEDIN_ID || window.lintrk) return
  window._linkedin_partner_id = LINKEDIN_ID
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []
  window._linkedin_data_partner_ids.push(LINKEDIN_ID)
  const s = document.createElement("script")
  s.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js"
  s.async = true
  document.head.appendChild(s)
}

const ConsentGatedTags = () => {
  useEffect(() => {
    if (!META_ID && !LINKEDIN_ID) return
    const onConsent = () => {
      try {
        const raw = localStorage.getItem("tm-consent-v1")
        const c = raw ? JSON.parse(raw) : null
        if (c?.ads) {
          loadMeta()
          loadLinkedIn()
          window.dataLayer = window.dataLayer || []
          // Forward generate_lead to Meta (event_id reserved for future CAPI dedupe)
          const push = window.dataLayer.push.bind(window.dataLayer)
          window.dataLayer.push = (e) => {
            try {
              if (e?.event === "generate_lead" && window.fbq) {
                window.fbq("track", "Lead", {}, { eventID: `lead-${Date.now()}` })
              }
            } catch {}
            return push(e)
          }
        }
      } catch { /* no-op */ }
    }
    onConsent()
    window.addEventListener("tm-consent", onConsent)
    return () => window.removeEventListener("tm-consent", onConsent)
  }, [])
  return null
}

export default ConsentGatedTags
