import { useEffect, useState } from "react"

const KEY = "tm-consent-v1"

// Compact Consent Mode v2 banner (audit §1 P1, Kenya DPA 2019).
// Defaults are denied in _document.js before GTM loads; this banner records
// the visitor choice and pushes it to the dataLayer for GTM Consent Mode.
const loadChoice = () => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export const pushConsent = (choice) => {
  if (typeof window === "undefined") return
  const granted = (v) => (v ? "granted" : "denied")
  window.dataLayer = window.dataLayer || []
  const update = {
    event: "consent_update",
    ad_storage: granted(choice.ads),
    ad_user_data: granted(choice.ads),
    ad_personalization: granted(choice.ads),
    analytics_storage: granted(choice.analytics),
  }
  window.dataLayer.push(update)
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: granted(choice.ads),
      ad_user_data: granted(choice.ads),
      ad_personalization: granted(choice.ads),
      analytics_storage: granted(choice.analytics),
    })
  }
}

const ConsentBanner = () => {
  const [visible, setVisible] = useState(false)
  const [settings, setSettings] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [ads, setAds] = useState(false)

  useEffect(() => {
    if (!loadChoice()) {
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  const save = (choice) => {
    try { localStorage.setItem(KEY, JSON.stringify({ ...choice, at: Date.now() })) } catch {}
    pushConsent(choice)
    try { window.dispatchEvent(new Event("tm-consent")) } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9990] px-3 pb-3 sm:px-6 sm:pb-4" role="dialog" aria-label="Cookie consent">
      <div className="mx-auto max-w-3xl bg-[#0B1B33] text-white rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-5">
        <p className="text-sm text-slate-200">
          We use cookies to measure visits and improve our moving services. Choose what you allow — see our{' '}
          <a href="/privacy" className="underline font-semibold">Privacy Policy</a>.
        </p>
        {settings && (
          <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
            <label className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2 cursor-pointer">
              <span>Analytics (GA4)</span>
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="w-5 h-5 accent-[#FF5000]" />
            </label>
            <label className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2 cursor-pointer">
              <span>Ads & remarketing</span>
              <input type="checkbox" checked={ads} onChange={(e) => setAds(e.target.checked)} className="w-5 h-5 accent-[#FF5000]" />
            </label>
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => save({ analytics: true, ads: true })} className="px-4 py-2.5 min-h-[44px] rounded-lg bg-[#FF5000] font-semibold text-sm hover:bg-[#D94300]">Accept all</button>
          <button type="button" onClick={() => save({ analytics: false, ads: false })} className="px-4 py-2.5 min-h-[44px] rounded-lg bg-white/15 font-semibold text-sm hover:bg-white/25">Reject all</button>
          {settings
            ? <button type="button" onClick={() => save({ analytics, ads })} className="px-4 py-2.5 min-h-[44px] rounded-lg bg-white text-[#0B1B33] font-semibold text-sm">Save choices</button>
            : <button type="button" onClick={() => setSettings(true)} className="px-4 py-2.5 min-h-[44px] rounded-lg border border-white/25 font-semibold text-sm">Settings</button>}
        </div>
      </div>
    </div>
  )
}

export default ConsentBanner
