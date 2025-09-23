import React from 'react';
import { getClientCategories, getClientLogos, getClientReviews, getLandingAbout, getLandingPageData, getLandingServices, getSiteLogos } from "../sanity/sanity-utils"
import imageUrlBuilder from "@sanity/image-url"
import client from "../sanity/config/client-config"
import getPageMetadata from "../SEO/seo"
import Head from 'next/head'
import { useEffect, useState } from "react"
import { 
  FaUsers,
  FaTruck,
  FaBoxes,
  FaGlobe,
  FaHome,
  FaCogs,
  FaAward,
  FaShieldAlt,
  FaClock,
  FaHandsHelping,
  FaStar,
  FaCalendar,
  FaWarehouse,
  FaBuilding,
  FaShip,
  FaUserTie,
  FaGem
} from 'react-icons/fa';
import QuoteModal from '../components/Quote/QuoteModal';
import { useRouter } from 'next/router';

// Enhanced Home Components
import { EnhancedHero } from '../components/modern/AnimatedHero';
import { LightswindClientsSection } from '../components/modern/LightswindClientsSection';
import { 
  ModernButton, 
  FeatureCard, 
  TestimonialCard 
} from '../components/modern/ModernComponents';
import MovingTestimonials from '../components/modern/MovingTestimonials';
import { 
  ScrollReveal, 
  StaggerContainer, 
  StaggerItem 
} from '../components/modern/PageTransitions';

export default function Home({ landingPage, reviews, clients, clientCategories, siteLogos, landingAbout, landingServices }) {
  const builder = imageUrlBuilder(client)
  const [reviewsData, setReviewsData] = useState(reviews || [])
  const clientReviews = reviews || []
  const data = landingPage[0]
  const router = useRouter()
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState(null)
  
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

  // Enhanced Home Functions
  const handleGetQuote = () => {
    // Find and click the quote modal button
    const quoteButton = document.querySelector('.quote-modal-trigger');
    if (quoteButton) {
      quoteButton.click();
    }
  };

  const handleLearnMore = () => {
    router.push('/About');
  };

  // Newsletter handlers (client-side only placeholder)
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      // Placeholder success without backend wiring
      setNewsletterStatus({ type: 'success', message: "Thanks for subscribing! You'll hear from us soon." })
      setNewsletterEmail('')
      // If you later add an API route, you can post like this:
      // await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: newsletterEmail }) })
    } catch (err) {
      setNewsletterStatus({ type: 'error', message: 'Something went wrong. Please try again.' })
    }
  };
  const handleNewsletterEmailChange = (e) => setNewsletterEmail(e.target.value);

  // Get SEO metadata
  const seoData = getPageMetadata("home", {
    location: 'Nairobi',
    customTitle: 'Taylor Movers - Your Trusted Professional House, office & International movers.',
    customDescription: 'Looking for reliable moving companies in Kenya? Taylor Movers Nairobi offers safe, affordable, stress-free relocations locally & abroad since 2008.',
    includeLocalBusiness: true,
    includeService: false
  })

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:type" content={seoData.openGraph.type} />
      </Head>

      {/* Enhanced Hero Section with Rocket Animation */}
      <EnhancedHero
        subtitle="Professional Moving Services"
        title="Trusted Professional Movers"
        description="We specialize in local and international relocations with modern approach and exceptional quality. Let us make your next move extraordinary!"
        primaryButtonText="Get Free Quote"
        secondaryButtonText="Learn More"
        onPrimaryClick={handleGetQuote}
        onSecondaryClick={handleLearnMore}
        clientCount={40000}
        stats={[
          { icon: <FaUsers />, number: 40000, label: "successful moves", suffix: "+" },
          { icon: <FaGlobe />, number: 38, label: "Destination Countries we have moved clients.", suffix: "" },
          { icon: <FaCalendar />, number: 17, label: "Years - Established in 2008", suffix: "+" },
          { icon: <FaStar />, number: 4.9, label: "Rating Google Reviews / 4,000+ Reviews", suffix: "/5" }
        ]}
      />

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                Our Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive moving solutions tailored to your specific needs
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaHome />}
              title="Household & Long-Distance Moves"
              description="Whether you're moving across town or across counties, we make your relocation seamless. Our team handles your belongings with care and ensures every mile of your move is stress-free."
              backgroundImage="/assets/featured/house.jpg"
              href="/services/residential-moving"
              delay={0.1}
            />
            <FeatureCard
              icon={<FaBuilding />}
              title="Office Moves"
              description="Relocating your office doesn't have to disrupt business. We specialize in moving workstations, IT equipment, and furniture quickly and securely—so your team can get back to work faster."
              backgroundImage="/assets/featured/corporate.jpg"
              href="/services/office-relocation"
              delay={0.2}
            />
            <FeatureCard
              icon={<FaShip />}
              title="International Moves"
              description="Planning a move abroad? From customs clearance to safe shipping and delivery, we handle the details that make international relocation smooth and worry-free."
              backgroundImage="/assets/featured/warehouse.jpg"
              href="/services/international-moving"
              delay={0.3}
            />
            <FeatureCard
              icon={<FaUserTie />}
              title="Corporate Staff Relocation"
              description="Support your employees with reliable relocation solutions. From moving households to settling-in assistance, we make staff transitions easier—for them and for your business."
              backgroundImage="/assets/gallery/images/KURA-15.jpg"
              href="/services/consolidated-moves"
              delay={0.4}
            />
            <FeatureCard
              icon={<FaWarehouse />}
              title="Warehousing and Storage"
              description="Whether you need short-term storage during a move or long-term warehousing for your business, we provide secure, flexible, and professionally managed facilities with 24/7 security and climate control."
              backgroundImage="/assets/gallery/images/KURA-25.jpg"
              href="/services/storage-services"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Lightswind 3D Scroll Trigger Clients Section */}
      <LightswindClientsSection
        title="Trusted by Industry Leaders"
        subtitle="Over the years, Taylor Movers Kenya has proudly partnered with leading corporations, NGOs, government institutions, and families. Here are some of the organizations that have trusted us with their moves."
      />

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-[#FF5000] via-[#FF6B35] to-[#FF8A50] text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Choose Taylor?
              </h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                We combine years of experience with modern technology to deliver exceptional moving services
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <StaggerItem>
              <div className="glass-card p-8 text-center rounded-2xl">
                <div className="text-5xl mb-6">🌍</div>
                <h3 className="text-2xl font-bold mb-4">Global Standards, Local Expertise</h3>
                <p className="opacity-90">
                  As proud members of the International Association of Movers (IAM), we’re part of a trusted worldwide network. This means every move—whether within Nairobi or across borders—meets international best practices.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="glass-card p-8 text-center rounded-2xl">
                <div className="text-5xl mb-6">🛡️</div>
                <h3 className="text-2xl font-bold mb-4">Care and Protection, Guaranteed</h3>
                <p className="opacity-90">
                  From careful packing to secure transport, we treat your belongings as if they were our own. And for added assurance, every move is covered by insurance—so in the rare event of damage or loss, you can rest easy knowing you’re protected.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="glass-card p-8 text-center rounded-2xl">
                <div className="text-5xl mb-6">🧭</div>
                <h3 className="text-2xl font-bold mb-4">Tailored Moving Solutions</h3>
                <p className="opacity-90">
                  No two moves are alike. Whether you’re relocating your household, office, or moving internationally, we create a customized plan that fits your needs, timeline, and budget.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Moving Testimonials */}
      <MovingTestimonials
        title="What Our Clients Say"
        subtitle="Real experiences from our satisfied customers across Kenya and beyond"
        autoPlay={true}
        interval={5000}
      />

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5000]/20 to-[#FF8A50]/20"></div>
          <div className="animate-pulse absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Stay Connected With Taylor Movers</h2>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Be the first to receive moving tips, special offers, and updates from Kenya’s trusted moving company
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={handleNewsletterEmailChange}
                  placeholder="Enter your email"
                  className="w-full sm:w-auto flex-1 px-5 py-4 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-[#FF5000] to-[#FF8A50] hover:opacity-90 transition-opacity"
                >
                  Subscribe
                </button>
              </form>
              {newsletterStatus && (
                <div className={`mt-4 text-sm ${newsletterStatus.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                  {newsletterStatus.message}
                </div>
              )}
              <p className="mt-4 text-xs text-white/70">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Hidden QuoteModal - will be triggered by button clicks */}
      <div className="hidden">
        <QuoteModal quotebtn="orange" />
      </div>
    </>
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
