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
  BsGlobe, 
  BsClock, 
  BsGear,
  BsTruck,
  BsBoxSeam,
  BsClipboardCheck,
  BsTools,
  BsStar,
  BsAirplane,
  BsShip,
  BsMap
} from 'react-icons/bs'
import { 
  FaGlobeAmericas, 
  FaHandshake, 
  FaRoute,
  FaClipboardList,
  FaBoxOpen,
  FaPlane,
  FaShip,
  FaCar,
  FaPassport,
  FaFileContract,
  FaWarehouse,
  FaUsers,
  FaTruck
} from 'react-icons/fa'
import { MdSecurity, MdSupport, MdSpeed, MdTrackChanges } from 'react-icons/md'
import { RiGlobalLine, RiShieldCheckFill, RiCustomerService2Fill } from 'react-icons/ri'

const InternationalMoving = () => {

  const whyChooseUs = [
    {
      icon: <RiShieldCheckFill className="text-[#FF5000] text-4xl" />,
      title: "Trusted & Experienced",
      description: "Over a decade of experience with international standards ensures your belongings are handled safely and securely throughout the entire global relocation process."
    },
    {
      icon: <RiCustomerService2Fill className="text-[#FF5000] text-4xl" />,
      title: "Start-to-Finish Support", 
      description: "We manage everything from pre-move planning and packing to customs clearance and final setup at your destination, providing complete peace of mind."
    },
    {
      icon: <RiGlobalLine className="text-[#FF5000] text-4xl" />,
      title: "Global Network",
      description: "Collaborations with vetted international partners guarantee professional handling, compliance with regulations, and smooth transit worldwide."
    },
    {
      icon: <MdTrackChanges className="text-[#FF5000] text-4xl" />,
      title: "Secure Handling & Tracking",
      description: "High-quality packing materials, inventories, and GPS-enabled tracking keep your possessions safe from Nairobi to anywhere in the world."
    }
  ]

  const understandingMoveSteps = [
    {
      step: "1",
      title: "Service & Liability Terms",
      description: "Clear explanation of your rights and coverage for your belongings during international transport.",
      icon: <FaFileContract className="text-[#FF5000] text-2xl" />
    },
    {
      step: "2", 
      title: "Packing & Loading Procedures",
      description: "Guidance on safe packing and loading for long-distance international travel.",
      icon: <BsBoxSeam className="text-[#FF5000] text-2xl" />
    },
    {
      step: "3",
      title: "Shipping Options",
      description: "Air, sea, or road transport, selected for efficiency and cost-effectiveness to your destination.",
      icon: <FaPlane className="text-[#FF5000] text-2xl" />
    },
    {
      step: "4",
      title: "Vehicle & Boat Relocation",
      description: "Specialized services for shipping vehicles, boats, and large items internationally.",
      icon: <FaCar className="text-[#FF5000] text-2xl" />
    },
    {
      step: "5",
      title: "Transparent Costs",
      description: "Full breakdown of shipping and associated expenses, with secure payment options.",
      icon: <BsClipboardCheck className="text-[#FF5000] text-2xl" />
    }
  ]

  const preMoveSteps = [
    {
      step: "1",
      title: "Survey to Assess Volume",
      description: "Determine packing needs, container type, and shipping requirements for your international move.",
      icon: <FaClipboardList className="text-[#FF5000] text-2xl" />
    },
    {
      step: "2", 
      title: "Custom Crating Assessment",
      description: "Determine custom crating for fragile or high-value items (artwork, antiques, pianos, electronics).",
      icon: <BsBoxSeam className="text-[#FF5000] text-2xl" />
    },
    {
      step: "3",
      title: "Compliance & Documentation",
      description: "Ensure compliance with international regulations and assist with documentation and customs requirements.",
      icon: <FaPassport className="text-[#FF5000] text-2xl" />
    }
  ]

  const moveExecutionSteps = [
    {
      step: "1",
      title: "Professional Packing & Labeling",
      description: "Expert packing with high-quality materials, detailed labeling, and comprehensive inventory creation.",
      icon: <BsBoxSeam className="text-[#FF5000] text-2xl" />
    },
    {
      step: "2",
      title: "Loading into Containers",
      description: "Careful loading into appropriate containers for air or sea freight with proper securing.",
      icon: <FaWarehouse className="text-[#FF5000] text-2xl" />
    },
    {
      step: "3",
      title: "Customs Clearance & Transit",
      description: "Expert handling of customs clearance and global transit by our experienced international team.",
      icon: <BsGlobe className="text-[#FF5000] text-2xl" />
    },
    {
      step: "4",
      title: "Delivery & Setup",
      description: "Delivery, unloading, unpacking, and reassembly at your new international home.",
      icon: <BsCheckCircle className="text-[#FF5000] text-2xl" />
    }
  ]

  const serviceFeatures = [
    "Air freight services",
    "Sea freight shipping", 
    "Road transport to neighboring countries",
    "Vehicle & boat shipping",
    "Custom crating for valuables",
    "Customs clearance assistance",
    "Door-to-door delivery",
    "Full packing & unpacking",
    "International insurance",
    "Real-time shipment tracking"
  ]

  const destinations = [
    {
      region: "Europe",
      countries: ["United Kingdom", "Germany", "Netherlands", "France", "Switzerland"],
      icon: <BsGlobe className="text-[#FF5000] text-3xl" />
    },
    {
      region: "Middle East",
      countries: ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Oman"],
      icon: <BsGlobe className="text-[#FF5000] text-3xl" />
    },
    {
      region: "North America", 
      countries: ["USA", "Canada"],
      icon: <BsGlobe className="text-[#FF5000] text-3xl" />
    },
    {
      region: "Asia",
      countries: ["Singapore", "Malaysia", "India", "China", "Japan"],
      icon: <BsGlobe className="text-[#FF5000] text-3xl" />
    },
    {
      region: "Africa",
      countries: ["South Africa", "Nigeria", "Ghana", "Egypt", "Morocco"],
      icon: <BsGlobe className="text-[#FF5000] text-3xl" />
    }
  ]

  const shippingOptions = [
    {
      title: "Air Freight",
      description: "Fast delivery for urgent relocations and high-value items",
      timeframe: "5-10 days",
      icon: <FaPlane className="text-[#FF5000] text-4xl" />,
      features: ["Fastest option", "Climate controlled", "High security", "Door-to-door tracking"]
    },
    {
      title: "Sea Freight",
      description: "Cost-effective solution for full household relocations",
      timeframe: "4-8 weeks",
      icon: <FaShip className="text-[#FF5000] text-4xl" />,
      features: ["Most economical", "Large capacity", "Full container loads", "Secure transport"]
    },
    {
      title: "Road Transport",
      description: "Regional moves to neighboring African countries",
      timeframe: "3-7 days",
      icon: <FaTruck className="text-[#FF5000] text-4xl" />,
      features: ["Regional coverage", "Flexible timing", "Direct delivery", "Cost effective"]
    }
  ]

  // Get SEO metadata
  const seoData = getPageMetadata("international-moving", {
    location: 'Nairobi',
    service: 'international-moving',
    customTitle: 'Expert International Moving Services Kenya | Taylor Movers Global',
    customDescription: 'Professional international relocation from Kenya to Europe, Middle East, North America & Asia. ✓ Air & sea freight ✓ Customs clearance ✓ Global network. Call +254 721 410 517!',
    includeService: true,
    includeLocalBusiness: false
  })

  return (
    <div className="w-full">
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:type" content={seoData.openGraph.type} />
      </Head>

      <Jumbotron 
        image="international-moving-kenya.png" 
        text="Expert International Relocation Services" 
        alt="Taylor Movers Kenya international moving services with global reach"
      />

      {/* Hero Section */}
      <div className="container my-16">
        <div className="row items-center">
          <div className="col-md-6">
            <h1 className="text-4xl font-bold text-[#FF5000] mb-4">
              Expert International Relocation Services
            </h1>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Relocating internationally is an exciting new chapter, but it can be complex and overwhelming. 
              Taylor Movers Kenya makes international moves stress-free by managing every detail—from professional 
              packing and customs clearance to transportation and delivery at your new home abroad. Trusted as one 
              of Kenya's top international movers, we handle relocations to Europe, the Middle East, North America, 
              Asia, and across Africa.
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <BsGlobe className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">Global destination coverage</span>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <BsShield className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">Full international insurance coverage</span>
            </div>
            <div className="flex items-center space-x-4 mb-8">
              <BsMap className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">Customs clearance expertise</span>
            </div>
            <QuoteModal quotebtn="orange" />
          </div>
          <div className="col-md-6">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#FF5000] to-[#FF8A50] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <Image
                  src="/assets/services/servicepage photos/International Moves.jpg"
                  alt="Taylor Movers Kenya international relocation experts"
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
      <div className="bg-gradient-to-br from-blue-50 to-gray-100 py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#FF5000] mb-4">
              Why Choose Taylor Movers for International Moving?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Global expertise with local knowledge for seamless international relocations
            </p>
          </div>
          <div className="row">
            {whyChooseUs.map((reason, index) => (
              <div key={index} className="col-lg-6 mb-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 h-full">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">{reason.icon}</div>
                    <div>
                      <h3 className="font-bold text-2xl mb-4 text-gray-800">{reason.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shipping Options */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#FF5000] mb-4">
            Shipping Options for Every Need
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the shipping method that best fits your timeline and budget
          </p>
        </div>
        <div className="row">
          {shippingOptions.map((option, index) => (
            <div key={index} className="col-lg-4 mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 h-full">
                <div className="text-center mb-6">{option.icon}</div>
                <h3 className="font-bold text-2xl mb-3 text-center text-gray-800">{option.title}</h3>
                <p className="text-gray-600 mb-4 text-center">{option.description}</p>
                <div className="text-center mb-6">
                  <span className="inline-block px-4 py-2 bg-[#FF5000]/10 text-[#FF5000] rounded-full font-semibold">
                    {option.timeframe}
                  </span>
                </div>
                <div className="space-y-2">
                  {option.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <BsCheckCircle className="text-[#FF5000] text-sm flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Destinations We Serve */}
      <div className="bg-gray-50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#FF5000] mb-4">
              Global Destinations We Serve
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional moving services to major destinations worldwide
            </p>
          </div>
          <div className="row">
            {destinations.map((dest, index) => (
              <div key={index} className="col-md-6 col-lg-4 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="text-center mb-4">{dest.icon}</div>
                  <h3 className="font-bold text-xl mb-4 text-center text-gray-800">{dest.region}</h3>
                  <div className="space-y-2">
                    {dest.countries.map((country, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <BsCheckCircle className="text-[#FF5000] text-sm flex-shrink-0" />
                        <span className="text-sm text-gray-600">{country}</span>
                      </div>
                    ))}
                  </div>
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
            Complete International Moving Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for a successful international relocation
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

      {/* International Moving Process Section */}
      <div className="bg-gradient-to-r from-[#FF5000] to-[#FF8A50] py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              International Moving Process
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              A comprehensive approach to ensure your belongings arrive safely at your new international home
            </p>
          </div>

          {/* Understanding Your Move */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-white mb-12 text-center">
              1. Understanding Your Move
            </h3>
            <div className="row">
              {understandingMoveSteps.map((step, index) => (
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

          {/* Pre-Move Planning */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-white mb-12 text-center">
              2. Pre-Move Planning
            </h3>
            <div className="row">
              {preMoveSteps.map((step, index) => (
                <div key={index} className="col-lg-4 mb-8">
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

          {/* Move Execution */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-white mb-12 text-center">
              3. Move Execution
            </h3>
            <div className="row">
              {moveExecutionSteps.map((step, index) => (
                <div key={index} className="col-lg-3 col-md-6 mb-8">
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

          {/* Post-Move Support */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-8">
              4. Post-Move Support
            </h3>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 max-w-2xl mx-auto">
              <BsStar className="text-white text-4xl mx-auto mb-4" />
              <h4 className="font-bold text-2xl text-white mb-4">Follow-up Communication</h4>
              <p className="text-white/90 leading-relaxed">
                Follow-up communication to ensure satisfaction and address any additional needs 
                after your international move is complete.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  )
}

export default InternationalMoving