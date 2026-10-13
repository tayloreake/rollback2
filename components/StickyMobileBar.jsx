// Sticky mobile action bar (audit §3 P2): WhatsApp (with ref for
// attribution) + Call + Quote. Mobile only, above consent banner space.
const WA_LINK =
  "https://wa.me/254721410517?text=Hi%20Taylor%2C%20I%27d%20like%20a%20quote%20(ref%3A%20WEB)"

const StickyMobileBar = () => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 z-[9980] bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]">
    <div className="grid grid-cols-3 divide-x divide-slate-200">
      <a
        href={WA_LINK}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-1.5 py-3.5 min-h-[56px] text-[13px] font-bold text-[#1FA855]"
        aria-label="Chat to Taylor Movers on WhatsApp"
      >
        WhatsApp
      </a>
      <a
        href="tel:+254721410517"
        className="flex items-center justify-center gap-1.5 py-3.5 min-h-[56px] text-[13px] font-bold text-[#0B1B33]"
        aria-label="Call Taylor Movers now"
      >
        Call Now
      </a>
      <a
        href="/quote"
        className="flex items-center justify-center gap-1.5 py-3.5 min-h-[56px] text-[13px] font-bold text-white bg-[#FF5000]"
        aria-label="Get a free moving quote"
      >
        Free Quote
      </a>
    </div>
  </div>
)

export default StickyMobileBar
