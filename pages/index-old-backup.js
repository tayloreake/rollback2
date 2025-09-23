import { getClientCategories, getClientLogos, getClientReviews, getLandingAbout, getLandingPageData, getLandingServices, getSiteLogos } from "../sanity/sanity-utils"
import imageUrlBuilder from "@sanity/image-url"
import client from "../sanity/config/client-config"
import getPageMetadata from "../SEO/seo"
import { useRouter } from 'next/router'
import { generateBreadcrumbs } from '../SEO/enhanced-seo'
import Head from 'next/head'
import dynamic from "next/dynamic"
import About from "../components/homepage/About"
import HomeServices from "../components/homepage/HomeServices"
import HeroSection from "../components/homepage/hero-section"
import { useEffect, useState } from "react"

const Featured = dynamic(() => import("../components/homepage/Featured"))
const Services = dynamic(() => import("../components/homepage/Services"))
const Mirage = dynamic(() => import("../components/homepage/Mirage"))
const Cta = dynamic(() => import("../components/homepage/Cta"))
const Clients = dynamic(() => import("../components/homepage/Clients"))
const Testimonials = dynamic(() =>
  import("../components/homepage/Testimonials")
)
const Reviews = dynamic(() => import("../components/Reviews/reviews"))

export default function Home({ landingPage, reviews, clients, clientCategories, siteLogos, landingAbout, landingServices }) {
  const builder = imageUrlBuilder(client)
  const router = useRouter()
  const [reviewsData, setReviewsData] = useState(reviews || [])
  const clientReviews = reviews || []
  const data = landingPage[0]
  useEffect(() => {
    if (reviews && reviews.length > 0 && typeof window !== 'undefined') {
      window.localStorage.setItem("clientReviews", JSON.stringify(reviews))
      window.localStorage.setItem("clients", JSON.stringify(clients))
      window.localStorage.setItem("clientCategories", JSON.stringify(clientCategories))
      console.log("LANDING ABOUTS  ===== :::: ", landingAbout)

    }
  }, [reviews, clients, clientCategories, landingAbout])

  useEffect(() => {
    console.log("LOCALSTORAGE SITE LOGOS:::: ", siteLogos[0])
    window.localStorage.setItem("siteLogos", JSON.stringify(siteLogos))
    window.localStorage.setItem("landingAbout", JSON.stringify(landingAbout))
    window.localStorage.setItem("landingServices", JSON.stringify(landingServices))
    // Manually dispatch an event to notify listeners in the same tab
    window.dispatchEvent(new Event("site-logos"));
    
  }, [siteLogos, landingAbout, landingServices])

  function urlFor(source) {
    return builder.image(source)
  }

  // Get SEO metadata
  const seoData = getPageMetadata("home", {
    location: 'Nairobi',
    customTitle: 'Best Professional Movers in Nairobi, Kenya | Taylor Movers 2025',
    customDescription: 'Kenya\'s #1 rated moving company serving Nairobi. ✓ 10+ years experience ✓ Licensed & insured ✓ Free quotes ✓ Same-day service. Call +254 721 410 517 today!',
    includeLocalBusiness: true,
    includeService: false
  })

  return (
    <div className=''>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:type" content={seoData.openGraph.type} />
      </Head>

      <HeroSection />
      {/* <Featured content={data} urlFor={urlFor} /> */}
      {/* <Services content={data} urlFor={urlFor} /> */}
      {/* <Mirage content={data} urlFor={urlFor} /> */}
      {/* <Cta content={data} /> */}
      <HomeServices services={landingServices} />
      <About content={landingAbout[0]} />
      <Clients content={data} urlFor={urlFor} />
      {/* <Testimonials /> */}
      {/* <Reviews /> */}
    </div>
  )
}

export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=1"
  )
  const landingPage = await getLandingPageData();
  const reviews = await getClientReviews();
  const clients = await getClientLogos();
  const siteLogos = await getSiteLogos();
  const landingServices = await getLandingServices();
  const landingAbout = await getLandingAbout();
  const clientCategories = await getClientCategories();
  return {
    props: {
      landingPage,
      reviews,
      clients,
      clientCategories,
      siteLogos,
      landingAbout,
      landingServices
    },
  }
}
