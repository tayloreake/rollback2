import { useEffect, useState } from "react"

// Site-wide announcement bar fed by Sanity (`announcement` type).
// Client-fetched (non-PII content, safe on public dataset); renders nothing
// when no active announcement exists. Marketing toggles it in Studio.
const AnnouncementBar = () => {
  const [item, setItem] = useState(null)

  useEffect(() => {
    let live = true
    import("../sanity/sanity-utils")
      .then(({ getAnnouncement }) => getAnnouncement())
      .then((a) => { if (live && a?.message) setItem(a) })
      .catch(() => {})
    return () => { live = false }
  }, [])

  if (!item) return null
  const inner = <span className="text-[13px] font-semibold">{item.message}</span>
  return (
    <div className="bg-[#0B1B33] text-white text-center px-4 py-2 relative z-[55]">
      {item.link ? <a href={item.link} className="underline underline-offset-2">{inner}</a> : inner}
    </div>
  )
}

export default AnnouncementBar
