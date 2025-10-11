import React, { useState } from 'react'
import Image from 'next/image'
import getPageMetadata from '../../SEO/seo'
import Head from 'next/head'
import Jumbotron from '../../components/jumbotron'
import QuoteModal from '../../components/Quote/QuoteModal'
import NewsletterSection from '../../components/NewsletterSection'
import { 
  BsCheckCircle, 
  BsShield, 
  BsHouse, 
  BsClock, 
  BsGear,
  BsTruck,
  BsBoxSeam,
  BsClipboardCheck,
  BsTools,
  BsStar
} from 'react-icons/bs'
import { 
  FaHome, 
  FaHandshake, 
  FaLightbulb, 
  FaTachometerAlt,
  FaClipboardList,
  FaBoxOpen,
  FaRoute
} from 'react-icons/fa'
import { MdSecurity, MdSpeed } from 'react-icons/md'

const ResidentialMoving = () => {

  const whyChooseUs = [
    {
      icon: <MdSecurity className="text-[#FF5000] text-4xl" />,
      title: "Trustworthy",
      description: "With over a decade of proven experience, we've built a reputation as one of Kenya's most reliable moving companies. Our vetted team, transparent pricing, and comprehensive insurance give you peace of mind that your possessions are in safe hands from start to finish."
    },
    {
      icon: <FaLightbulb className="text-[#FF5000] text-4xl" />,
      title: "Innovative", 
      description: "We use smart logistics, modern equipment, and digital inventory systems to simplify your move. From specialized handling of fragile items to real-time tracking, our innovative approach makes relocation seamless and stress-free."
    },
    {
      icon: <MdSpeed className="text-[#FF5000] text-4xl" />,
      title: "Efficient",
      description: "Every move is carefully planned and executed with precision. From optimized routes to expert packing and quick setup, we ensure timely, budget-friendly relocations with minimal disruption to your home or business."
    }
  ]

  const preparationSteps = [
    {
      step: "1",
      title: "Initial Contact & Scope Definition",
      description: "Discuss household size, move distance, dates, and special requirements such as fragile items, pets, or storage needs.",
      icon: <FaClipboardList className="text-[#FF5000] text-2xl" />
    },
    {
      step: "2", 
      title: "Site Visit & Survey",
      description: "A consultant visits your home to assess belongings and property logistics for a precise, transparent quote.",
      icon: <BsHouse className="text-[#FF5000] text-2xl" />
    },
    {
      step: "3",
      title: "Confirmation & Scheduling",
      description: "A dedicated Team Leader is assigned, and a detailed moving timeline is shared.",
      icon: <BsClipboardCheck className="text-[#FF5000] text-2xl" />
    },
    {
      step: "4",
      title: "Packing Guidance",
      description: "Choose DIY packing with checklists or professional packing assistance.",
      icon: <BsBoxSeam className="text-[#FF5000] text-2xl" />
    },
    {
      step: "5",
      title: "Final Move Confirmation",
      description: "All details are verified before moving day.",
      icon: <BsCheckCircle className="text-[#FF5000] text-2xl" />
    }
  ]

  const movingDaySteps = [
    {
      step: "1",
      title: "Pre-Move Briefing",
      description: "Team reviews the schedule and expectations with you.",
      icon: <FaClipboardList className="text-[#FF5000] text-2xl" />
    },
    {
      step: "2",
      title: "Home Protection & Packing", 
      description: "Floors and furniture are protected; items are packed and labeled by room.",
      icon: <BsShield className="text-[#FF5000] text-2xl" />
    },
    {
      step: "3",
      title: "Furniture Disassembly & Special Handling",
      description: "Large or fragile items are carefully disassembled and secured.",
      icon: <BsTools className="text-[#FF5000] text-2xl" />
    },
    {
      step: "4",
      title: "Loading, Transportation & Unloading",
      description: "Inventory is tracked; items are transported safely, whether across Nairobi or long-distance to another county.",
      icon: <BsTruck className="text-[#FF5000] text-2xl" />
    },
    {
      step: "5",
      title: "Reassembly & Optional Unpacking",
      description: "Furniture is reassembled, and boxes unpacked if requested.",
      icon: <BsGear className="text-[#FF5000] text-2xl" />
    },
    {
      step: "6",
      title: "Debris Removal & Final Walk-Through",
      description: "Packing materials are removed, and a final check ensures satisfaction.",
      icon: <BsCheckCircle className="text-[#FF5000] text-2xl" />
    },
    {
      step: "7",
      title: "Post-Move Support",
      description: "Follow-up services address any additional needs after the move.",
      icon: <BsStar className="text-[#FF5000] text-2xl" />
    }
  ]

  const serviceFeatures = [
    "Local Nairobi moves",
    "Long-distance county relocations", 
    "International residential moving",
    "Professional packing services",
    "Furniture assembly/disassembly",
    "Storage solutions (short & long-term)",
    "Fragile item handling",
    "Real-time tracking",
    "Comprehensive insurance",
    "24/7 customer support"
  ]

  // Coverage areas
  const coverageAreas = [
    { city: "Nairobi", description: "Complete residential moving services in all Nairobi neighborhoods" },
    { city: "Mombasa", description: "Professional home moving to and from Kenya's coastal city" },
    { city: "Kisumu", description: "Reliable residential relocations in Western Kenya" },
    { city: "Nakuru", description: "Expert home moving services in the Rift Valley" },
    { city: "Eldoret", description: "Trusted residential movers serving North Rift region" },
    { city: "All Kenya", description: "Inter-county residential moves across the country" }
  ]

  // Get SEO metadata
  const seoData = getPageMetadata("residential-moving", {
    location: 'Kenya',
    service: 'residential-moving',
    customTitle: 'Residential Moving Services Kenya | Nairobi, Mombasa | Taylor Movers',
    customDescription: 'Professional residential moving services in Kenya - Nairobi, Mombasa, Kisumu & nationwide. ✓ 40,000+ successful moves ✓ Full insurance ✓ Expert team. Call +254 721 410 517!',
    includeService: true,
    includeLocalBusiness: false
  })

  return (
    <div className="w-full">
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
      
      {/* Spacer for fixed navbar */}
      <div className="h-[100px] md:h-[80px]"></div>

      <Jumbotron 
        image="residential-moving-nairobi.png" 
        text="Trusted Residential Moving Services" 
        alt="Taylor Movers Kenya professional team handling residential moving services in Nairobi"
      />

      {/* Hero Section */}
      <div className="container my-16">
        <div className="row items-center">
          <div className="col-md-6">
            <h1 className="text-4xl font-bold text-[#FF5000] mb-4">
              Residential Moving Services in Kenya
            </h1>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Taylor Movers Kenya provides professional residential moving services across Kenya, including Nairobi, 
              Mombasa, Kisumu, Eldoret, Nakuru, and all major towns. Whether you're moving within Nairobi, relocating 
              to Mombasa, or moving between counties, our experienced team handles every aspect of your residential 
              move—from careful packing and secure transportation to safe unpacking and setup in your new home. 
              With over 40,000 successful residential moves across Kenya, we're the trusted choice for homeowners 
              and families nationwide.
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <BsCheckCircle className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">Over 40,000 successful residential moves</span>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <BsShield className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">Comprehensive insurance coverage</span>
            </div>
            <div className="flex items-center space-x-4 mb-8">
              <BsClock className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">Over a decade of proven experience</span>
            </div>
            <QuoteModal quotebtn="orange" />
          </div>
          <div className="col-md-6">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#FF5000] to-[#FF8A50] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <Image
                  src="/assets/services/servicepage photos/Household Moves.jpg"
                  alt="Professional residential moving team from Taylor Movers Kenya"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Taylor Movers Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#FF5000] mb-4">
              Why Choose Taylor Movers?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three core principles that make us Kenya's most trusted residential moving company
            </p>
          </div>
          <div className="row">
            {whyChooseUs.map((reason, index) => (
              <div key={index} className="col-lg-4 mb-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 h-full">
                  <div className="text-center mb-6">{reason.icon}</div>
                  <h3 className="font-bold text-2xl mb-4 text-center text-gray-800">{reason.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Features Grid */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#FF5000] mb-4">
            Complete Residential Moving Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From local Nairobi moves to international relocations, we offer comprehensive services
          </p>
        </div>
        <div className="row">
          {serviceFeatures.map((feature, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-[#FF5000]/5 transition-colors">
                <BsCheckCircle className="text-[#FF5000] text-xl flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Moving Process Section */}
      <div className="bg-gradient-to-r from-[#FF5000] to-[#FF8A50] py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Residential Moving Process
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              A systematic approach ensuring every residential move is executed flawlessly
            </p>
          </div>

          {/* Preparation & Planning */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-white mb-12 text-center">
              1. Preparation & Planning
            </h3>
            <div className="row">
              {preparationSteps.map((step, index) => (
                <div key={index} className="col-lg-4 col-md-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="bg-white/20 p-3 rounded-full mr-4">
                        {step.icon}
                      </div>
                      <div className="bg-white text-[#FF5000] w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                    </div>
                    <h4 className="font-bold text-lg text-white mb-3">{step.title}</h4>
                    <p className="text-white/90 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Moving Day Execution */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-12 text-center">
              2. Moving Day Execution
            </h3>
            <div className="row">
              {movingDaySteps.map((step, index) => (
                <div key={index} className="col-lg-4 col-md-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="bg-white/20 p-3 rounded-full mr-4">
                        {step.icon}
                      </div>
                      <div className="bg-white text-[#FF5000] w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                    </div>
                    <h4 className="font-bold text-lg text-white mb-3">{step.title}</h4>
                    <p className="text-white/90 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Areas Section */}
      <div className="bg-gray-50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#FF5000] mb-4">
              Residential Moving Services Across Kenya
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Taylor Movers Kenya serves all major cities and towns throughout Kenya with professional residential moving services
            </p>
          </div>
          <div className="row">
            {coverageAreas.map((area, index) => (
              <div key={index} className="col-md-6 col-lg-4 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow h-full">
                  <div className="flex items-center mb-3">
                    <BsHouse className="text-[#FF5000] text-2xl mr-3" />
                    <h3 className="font-bold text-xl text-gray-800">{area.city}</h3>
                  </div>
                  <p className="text-gray-600">{area.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  )
}

export default ResidentialMoving
