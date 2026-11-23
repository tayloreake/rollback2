import React, { useEffect, useMemo, useState, useCallback } from "react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import PageTitle from "../components/PageTitle"
import getPageMetadata from "../SEO/seo"
import { getGalleryAlbums } from "../sanity/sanity-utils"
import { buildGallery, sanityImageUrl } from "../utils/gallery"
import Portal from "../components/Portal"

// Photos shipped with the site before the Sanity gallery existed. They are all
// office moves. They only show until the Sanity "Office Moves" album is
// populated (see scripts/import-gallery-to-sanity.mjs), then Sanity takes over.
const legacyContext = require.context("../public/assets/gallery/images", false, /\.(png|jpe?g)$/)
const LEGACY_IMAGES = legacyContext.keys().map(legacyContext)

const ALL = "all"

const Gallery = ({ albums = [] }) => {
  const router = useRouter()
  const gallery = useMemo(() => buildGallery({ albums, legacy: LEGACY_IMAGES }), [albums])
  const [active, setActive] = useState(ALL)
  const [lightbox, setLightbox] = useState(null) // index into `visible`

  // Deep-link: /gallery?category=office-moves
  useEffect(() => {
    const q = router.query?.category
    if (typeof q === "string" && gallery.categories.some((c) => c.id === q)) setActive(q)
  }, [router.query?.category, gallery.categories])

  const choose = (id) => {
    setActive(id)
    setLightbox(null)
    router.replace({ pathname: "/gallery", query: id === ALL ? {} : { category: id } }, undefined, { shallow: true, scroll: false })
  }

  const visible = useMemo(() => {
    if (active === ALL) return gallery.all
    return gallery.categories.find((c) => c.id === active)?.items || []
  }, [active, gallery])

  const activeTitle = active === ALL ? "All" : gallery.categories.find((c) => c.id === active)?.title

  const step = useCallback(
    (d) => setLightbox((i) => (i === null ? i : (i + d + visible.length) % visible.length)),
    [visible.length]
  )
  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null)
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox, step])

  const seoData = getPageMetadata("gallery", {
    customTitle: "Moving Gallery | Taylor Movers Nairobi",
    customDescription:
      "See Taylor Movers Kenya in action: household, office, staff relocation, cross-border and international moves, plus crating services, since 2008.",
  })

  const current = lightbox !== null ? visible[lightbox] : null

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <link rel="canonical" href={seoData.canonical} />
      </Head>
      <div className="w-full h-full bg-[#EDEDED] pt-8 pb-10">
        <section className="container">
          <h1 className="text-[#F05423] text-3xl font-[600] text-center">Our Moving Gallery</h1>
        </section>

        <section className="container">
          <div className="my-4 flex flex-wrap" role="tablist" aria-label="Gallery categories">
            {[{ id: ALL, title: "All" }, ...gallery.categories].map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={active === c.id}
                onClick={() => choose(c.id)}
                className={`hover:bg-[#FF5000] text-white mr-3 mb-2 btn rounded-3xl px-3 md:px-5 py-1 ${
                  active === c.id ? "bg-[#FF5000]" : "bg-[#6D6E71]"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-700">
              <p className="text-lg font-semibold mb-2">{activeTitle} photos are coming soon.</p>
              <p className="mb-4">Need this service now? We would be glad to help.</p>
              <Link href="/quote" className="inline-block bg-[#FF5000] text-white rounded-3xl px-6 py-2">
                Get a free quote
              </Link>
            </div>
          ) : (
            <div className="md:columns-5 gap-1">
              {visible.map((item, i) =>
                item.kind === "legacy" ? (
                  <button key={item.key} onClick={() => setLightbox(i)} className="block w-full mb-2 break-inside-avoid" aria-label={`Open ${item.alt}`}>
                    <Image
                      alt={item.alt}
                      src={item.src}
                      width={250}
                      height={100}
                      sizes="(max-width: 768px) 100vw, 250px"
                      className="inline-block w-full md:w-[250px] h-auto object-cover rounded-lg"
                      loading="lazy"
                    />
                  </button>
                ) : (
                  <button key={item.key} onClick={() => setLightbox(i)} className="block w-full mb-2 break-inside-avoid" aria-label={`Open ${item.alt}`}>
                    <img
                      alt={item.alt}
                      src={sanityImageUrl(item.src, 500)}
                      srcSet={`${sanityImageUrl(item.src, 320)} 320w, ${sanityImageUrl(item.src, 500)} 500w, ${sanityImageUrl(item.src, 800)} 800w`}
                      sizes="(max-width: 768px) 100vw, 250px"
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                      decoding="async"
                      style={item.lqip ? { backgroundImage: `url(${item.lqip})`, backgroundSize: "cover" } : undefined}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </button>
                )
              )}
            </div>
          )}
        </section>
      </div>

      {current && (
        <Portal>
        <div
          className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-5 text-white text-4xl leading-none" aria-label="Close" onClick={() => setLightbox(null)}>
            &times;
          </button>
          {visible.length > 1 && (
            <>
              <button className="absolute left-3 md:left-6 text-white text-5xl" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); step(-1) }}>
                &#8249;
              </button>
              <button className="absolute right-3 md:right-6 text-white text-5xl" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); step(1) }}>
                &#8250;
              </button>
            </>
          )}
          <figure className="max-w-5xl max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={current.alt}
              src={current.kind === "legacy" ? (current.src.src || current.src) : sanityImageUrl(current.src, 1800, 80)}
              className="max-h-[80vh] w-auto object-contain rounded-lg"
            />
            {current.caption && <figcaption className="text-white mt-3 text-center">{current.caption}</figcaption>}
          </figure>
        </div>
        </Portal>
      )}
    </>
  )
}

export default Gallery

export async function getStaticProps() {
  try {
    const albums = await getGalleryAlbums()
    return { props: { albums: albums || [] }, revalidate: 60 }
  } catch (e) {
    console.error("Gallery Sanity fetch failed:", e?.message)
    return { props: { albums: [] }, revalidate: 60 }
  }
}
