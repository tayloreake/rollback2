import { getLandingPageData } from "../sanity/sanity-utils"
import imageUrlBuilder from "@sanity/image-url"
import client from "../sanity/config/client-config"
import getPageMetadata from "../SEO/seo"
import dynamic from "next/dynamic"
import About from "../components/homepage/About"
import HomeServices from "../components/homepage/HomeServices"
import HeroSection from "../components/homepage/hero-section"

const Featured = dynamic(() => import("../components/homepage/Featured"))
const Services = dynamic(() => import("../components/homepage/Services"))
const Mirage = dynamic(() => import("../components/homepage/Mirage"))
const Cta = dynamic(() => import("../components/homepage/Cta"))
const Clients = dynamic(() => import("../components/homepage/Clients"))
const Testimonials = dynamic(() =>
  import("../components/homepage/Testimonials")
)
const Reviews = dynamic(() => import("../components/Reviews/reviews"))

export default function Home({ landingPage }) {
  const builder = imageUrlBuilder(client)
  const data = landingPage[0]

  function urlFor(source) {
    return builder.image(source)
  }
  return (
    <div className=''>
      {getPageMetadata("home")}

      <HeroSection />
      {/* <Featured content={data} urlFor={urlFor} /> */}
      {/* <Services content={data} urlFor={urlFor} /> */}
      {/* <Mirage content={data} urlFor={urlFor} /> */}
      {/* <Cta content={data} /> */}
      <HomeServices />
      <About />
      <Clients content={data} urlFor={urlFor} />
      {/* <Testimonials /> */}
      {/* <Reviews /> */}
    </div>
  )
}

export async function getServerSideProps({ re, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  )
  const landingPage = await getLandingPageData()
  return {
    props: {
      landingPage,
    },
  }
}
