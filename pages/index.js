import React from 'react';
import { getClientCategories, getClientLogos, getClientReviews, getLandingAbout, getLandingPageData, getLandingServices, getSiteLogos, getCaseStudyBlogs } from "../sanity/sanity-utils"
import imageUrlBuilder from "@sanity/image-url"
import client from "../sanity/config/client-config"
import getPageMetadata from "../SEO/seo"
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react"
import { useBatchLocalStorage } from '../hooks/useLocalStorage'
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

// Lazy load heavy components - improves initial load time
const CaseStudies = dynamic(
  () => import('../components/CaseStudies'),
  { 
    loading: () => (
      <div className="py-20 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading case studies...</div>
      </div>
    ),
    ssr: true // Still render on server for SEO
  }
);
import { useRouter } from 'next/router';
import { 
  gtmTrackButtonClick, 
  gtmTrackNewsletterSignup,
  gtmTrackServiceView 
} from '../utils/gtm';
import { useSectionTracking } from '../hooks/useGTM';

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

export default function Home({ landingPage, reviews, clients, clientCategories, siteLogos, landingAbout, landingServices, caseStudies }) {
  const builder = imageUrlBuilder(client)
  const [reviewsData, setReviewsData] = useState(reviews || [])
  const clientReviews = reviews || []
  const data = landingPage[0]
  const router = useRouter()
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState(null)
  
  // GTM Section tracking refs
  const heroSectionRef = useSectionTracking('Hero Section')
  const servicesSectionRef = useSectionTracking('Services Section')
  const whyChooseSectionRef = useSectionTracking('Why Choose Us Section')
  const testimonialsSectionRef = useSectionTracking('Testimonials Section')
  const caseStudiesSectionRef = useSectionTracking('Case Studies Section')
  const newsletterSectionRef = useSectionTracking('Newsletter Section')
  
  // Batch localStorage writes with debouncing - prevents blocking main thread
  useBatchLocalStorage({
    clientReviews: reviews,
    clients: clients,
    clientCategories: clientCategories,
    siteLogos: siteLogos,
    landingAbout: landingAbout,
    landingServices: landingServices
  }, 1500);
  
  // Dispatch site-logos event after initial mount
  useEffect(() => {
    if (typeof window !== 'undefined' && siteLogos?.length > 0) {
      // Delay event dispatch to not block initial render
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event("site-logos"));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [siteLogos])

  function urlFor(source) {
    return builder.image(source)
  }

  // Enhanced Home Functions
  const handleGetQuote = () => {
    // Track button click
    gtmTrackButtonClick('Get Free Quote', 'primary_cta', {
      section: 'Hero',
      page_path: router.asPath
    });
    
    // Find and click the quote modal button
    const quoteButton = document.querySelector('.quote-modal-trigger');
    if (quoteButton) {
      quoteButton.click();
    }
  };

  const handleLearnMore = () => {
    // Track navigation click
    gtmTrackButtonClick('Learn More', 'secondary_cta', {
      section: 'Hero',
      destination: '/About',
      page_path: router.asPath
    });
    
    router.push('/About');
  };
  
  // Track service clicks
  const handleServiceClick = (serviceName, serviceHref) => {
    gtmTrackServiceView(serviceName, serviceHref);
    gtmTrackButtonClick('View Service', 'service_card', {
      service_name: serviceName,
      destination: serviceHref,
      section: 'Services'
    });
  };

  // Newsletter handlers (client-side only placeholder)
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      // Track newsletter signup
      gtmTrackNewsletterSignup(newsletterEmail);
      
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
        <link rel="canonical" href={seoData.canonical} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:type" content={seoData.openGraph.type} />
        <meta property="og:url" content={seoData.openGraph.url} />
        <meta property="og:site_name" content={seoData.openGraph.siteName} />
        <meta property="og:locale" content={seoData.openGraph.locale} />
        <meta property="og:image" content={seoData.openGraph.image} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={seoData.twitter.card} />
        <meta name="twitter:site" content={seoData.twitter.site} />
        <meta name="twitter:title" content={seoData.twitter.title} />
        <meta name="twitter:description" content={seoData.twitter.description} />
        <meta name="twitter:image" content={seoData.twitter.image} />
        
        {/* Structured Data */}
        {seoData.structuredData && (
          <script 
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.structuredData) }}
          />
        )}
      </Head>

      {/* Enhanced Hero Section with Rocket Animation */}
      <div ref={heroSectionRef}>
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
      </div>

      {/* Services Section */}
      <section ref={servicesSectionRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
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
              href="/services/home"
              delay={0.1}
            />
            <FeatureCard
              icon={<FaBuilding />}
              title="Office Moves"
              description="Relocating your office doesn't have to disrupt business. We specialize in moving workstations, IT equipment, and furniture quickly and securely—so your team can get back to work faster."
              backgroundImage="/assets/featured/corporate.jpg"
              href="/services/office"
              delay={0.2}
            />
            <FeatureCard
              icon={<FaShip />}
              title="International Moves"
              description="Planning a move abroad? From customs clearance to safe shipping and delivery, we handle the details that make international relocation smooth and worry-free."
              backgroundImage="/assets/featured/warehouse.jpg"
              href="/services/intl"
              delay={0.3}
            />
            <FeatureCard
              icon={<FaUserTie />}
              title="Corporate Staff Relocation"
              description="Support your employees with reliable relocation solutions. From moving households to settling-in assistance, we make staff transitions easier—for them and for your business."
              backgroundImage="/assets/gallery/images/KURA-15.jpg"
              href="/services/corporate"
              delay={0.4}
            />
            <FeatureCard
              icon={<FaWarehouse />}
              title="Warehousing and Storage"
              description="Whether you need short-term storage during a move or long-term warehousing for your business, we provide secure, flexible, and professionally managed facilities with 24/7 security and climate control."
              backgroundImage="/assets/gallery/images/KURA-25.jpg"
              href="/services/storage"
              delay={0.5}
            />
            <FeatureCard
              icon={<FaGem />}
              title="Our Complete Services"
              description="Discover our full range of professional moving and relocation services. From residential moves to specialized logistics solutions, we have everything you need for a successful move."
              backgroundImage="/assets/featured/services-overview.jpg"
              href="/services"
              delay={0.6}
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
      <section ref={whyChooseSectionRef} className="py-20 bg-gradient-to-br from-[#FF5000] via-[#FF6B35] to-[#FF8A50] text-white relative overflow-hidden">
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
      <div ref={testimonialsSectionRef}>
        <MovingTestimonials
          title="What Our Clients Say"
          subtitle="Real experiences from our satisfied customers across Kenya and beyond"
          autoPlay={true}
          interval={5000}
        />
      </div>

      {/* Case Studies */}
      <div ref={caseStudiesSectionRef}>
        <CaseStudies
          title="Success Stories"
          subtitle="Real case studies of our long-distance and international moves across Kenya and beyond"
          showAll={false}
          initialCaseStudies={caseStudies}
        />
      </div>

      {/* Newsletter Section */}
      <section ref={newsletterSectionRef} className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white relative overflow-hidden">
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

// Use getStaticProps with ISR for better performance
// Pages are pre-built at build time and revalidated in background
export async function getStaticProps() {
  try {
    // Parallel data fetching - much faster than sequential
    const [landingPage, reviews, clients, siteLogos, landingServices, landingAbout, clientCategories, caseStudies] = 
      await Promise.all([
        getLandingPageData(),
        getClientReviews(),
        getClientLogos(),
        getSiteLogos(),
        getLandingServices(),
        getLandingAbout(),
        getClientCategories(),
        getCaseStudyBlogs(3)
      ]);

    return {
      props: {
        landingPage: landingPage || [],
        reviews: reviews || [],
        clients: clients || [],
        clientCategories: clientCategories || [],
        siteLogos: siteLogos || [],
        landingAbout: landingAbout || [],
        landingServices: landingServices || [],
        caseStudies: caseStudies || []
      },
      // Revalidate every hour (3600 seconds) instead of 10 seconds
      // This dramatically reduces database load and improves performance
      revalidate: 3600
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    // Return empty props on error to prevent build failure
    return {
      props: {
        landingPage: [],
        reviews: [],
        clients: [],
        clientCategories: [],
        siteLogos: [],
        landingAbout: [],
        landingServices: [],
        caseStudies: []
      },
      revalidate: 60 // Retry in 1 minute on error
    }
  }
}
