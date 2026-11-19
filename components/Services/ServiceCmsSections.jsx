import React from "react"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "../portable-text"

// CMS-driven body sections for service pages (Sanity `service` doc rich text).
// Renders nothing when the page has no matching CMS doc — the hardcoded page
// content always stays as the fallback. Field labels were clarified in the
// schema (overview / whyChooseUs / process); legacy field names are mapped
// in getServiceSEO so this component stays clean.
const Block = ({ title, blocks }) => {
  if (!blocks?.length) return null
  return (
    <div className="mb-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">{title}</h2>
      <div className="prose max-w-none text-gray-700 leading-relaxed">
        <PortableText value={blocks} components={portableTextComponents} />
      </div>
    </div>
  )
}

const ServiceCmsSections = ({ content }) => {
  if (!content) return null
  const { overview, whyChooseUs, process, name } = content
  if (!overview?.length && !whyChooseUs?.length && !process?.length) return null
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-10">
        {name && (
          <p className="text-[11px] font-bold tracking-widest uppercase text-[#FF5000] mb-6">
            About {name} — from our editors
          </p>
        )}
        <Block title="Overview" blocks={overview} />
        <Block title="Why choose Taylor Movers" blocks={whyChooseUs} />
        <Block title="Our process" blocks={process} />
      </div>
    </section>
  )
}

export default ServiceCmsSections
