import React, { useRef, useState, useEffect } from "react"

// Zero-dependency snap carousel replacing react-slick (jQuery-era).
// Horizontal snap row + arrow buttons + dots. No autoplay (user-driven).
const SnapSlider = ({ children, className = "", slideClassName = "min-w-[85%] sm:min-w-[60%] snap-center" }) => {
  const ref = useRef(null)
  const [page, setPage] = useState(0)
  const kids = React.Children.toArray(children).filter(Boolean)

  const scrollTo = (i) => {
    const el = ref.current
    if (!el) return
    const n = Math.max(0, Math.min(i, kids.length - 1))
    el.scrollTo({ left: el.clientWidth * n, behavior: "smooth" })
    setPage(n)
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let t = null
    const onScroll = () => {
      clearTimeout(t)
      t = setTimeout(() => setPage(Math.round(el.scrollLeft / Math.max(1, el.clientWidth))), 120)
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      el.removeEventListener("scroll", onScroll)
      clearTimeout(t)
    }
  }, [])

  return (
    <div className={className}>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
      >
        {kids.map((k, i) => (
          <div key={i} className={`${slideClassName} snap-always`}>{k}</div>
        ))}
      </div>
      {kids.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            type="button"
            onClick={() => scrollTo(page - 1)}
            aria-label="Previous slide"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            ‹
          </button>
          <div className="flex gap-2">
            {kids.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-3 rounded-full transition-all ${i === page ? "w-6 bg-[#FF5000]" : "w-3 bg-slate-300"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollTo(page + 1)}
            aria-label="Next slide"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}

export default SnapSlider
