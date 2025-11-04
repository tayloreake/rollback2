import React, { useState } from 'react'
import Image from 'next/image'
import getPageMetadata from '../../SEO/seo'
import Head from 'next/head'
import Jumbotron from '../../components/jumbotron'
import dynamic from 'next/dynamic'
const QuoteModal = dynamic(() => import('../../components/Quote/QuoteModal'), { ssr: false, loading: () => null })
const NewsletterSection = dynamic(() => import('../../components/NewsletterSection'), { ssr: false, loading: () => null })
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
  BsStar,
  BsPeople,
  BsCurrencyDollar,
  BsCalendar3
} from 'react-icons/bs'
import { 
  FaTruck, 
  FaHandshake, 
  FaUsers, 
  FaTachometerAlt,
  FaClipboardList,
  FaBoxOpen,
  FaRoute,
  FaDollarSign,
  FaDesktop,
  FaFileAlt,
  FaClock,
  FaWarehouse,
  FaBuilding
} from 'react-icons/fa'
import { MdSecurity, MdSupport, MdSpeed, MdInventory, MdGroupWork, MdMonetizationOn } from 'react-icons/md'
import { RiShieldCheckFill, RiCustomerService2Fill, RiTruckFill } from 'react-icons/ri'

const ConsolidatedMoves = () => {

  const whyChooseConsolidated = [
    {
      icon: <RiShieldCheckFill className="text-[#FF5000] text-4xl" />,
      title: "Dependable and Secure",
      description: "We are one of Kenya's most reliable relocation companies. Our trained professionals, transparent pricing, and comprehensive insurance guarantee peace of mind, knowing your belongings are protected throughout the journey."
    },
    {
      icon: <MdInventory className="text-[#FF5000] text-4xl" />,
      title: "Innovative and Organized",
      description: "We apply advanced route planning, modern vehicles, and smart logistics to maximize the efficiency of every consolidated move. Our digital inventory and labeling systems ensure each item is carefully tracked and accounted for."
    },
    {
      icon: <MdMonetizationOn className="text-[#FF5000] text-4xl" />,
      title: "Efficient and Affordable",
      description: "Consolidation allows us to reduce costs while maintaining speed and reliability. Every schedule is well coordinated to minimize delays, giving you a budget-friendly move without unnecessary waiting."
    }
  ]

  const preparationSteps = [
    {
      step: "1",
      title: "Initial Consultation",
      description: "Your journey begins with a consultation where you share details such as destination, volume, timeline, and any special handling requirements.",
      icon: <FaClipboardList className="text-[#FF5000] text-2xl" />
    },
    {
      step: "2", 
      title: "Assessment & Quotation",
      description: "A relocation consultant then assesses your belongings and provides a clear, itemized quotation.",
      icon: <BsBoxSeam className="text-[#FF5000] text-2xl" />
    },
    {
      step: "3",
      title: "Strategic Scheduling",
      description: "Your move is strategically scheduled alongside others to maximize efficiency and savings.",
      icon: <BsCalendar3 className="text-[#FF5000] text-2xl" />
    },
    {
      step: "4",
      title: "Packing Service Options",
      description: "You may choose our professional packing service or pack yourself using our high-quality materials and expert guidance.",
      icon: <FaBoxOpen className="text-[#FF5000] text-2xl" />
    },
    {
      step: "5",
      title: "Final Coordination",
      description: "Once details are confirmed, a dedicated Move Coordinator ensures everything is set before moving day.",
      icon: <BsClipboardCheck className="text-[#FF5000] text-2xl" />
    }
  ]

  const movingDaySteps = [
    {
      step: "1",
      title: "Team Briefing",
      description: "On the day of your move, our Team Leader briefs you on logistics and expectations.",
      icon: <BsPeople className="text-[#FF5000] text-2xl" />
    },
    {
      step: "2",
      title: "Careful Packing & Protection", 
      description: "Every item is carefully packed, labeled, and protected to prevent damage.",
      icon: <BsBoxSeam className="text-[#FF5000] text-2xl" />
    },
    {
      step: "3",
      title: "Secure Loading & Consolidation",
      description: "Your belongings are securely loaded, consolidated with other shipments, and tracked using our digital inventory.",
      icon: <BsTruck className="text-[#FF5000] text-2xl" />
    },
    {
      step: "4",
      title: "Optimized Transport",
      description: "Through optimized routes, we ensure timely delivery across counties.",
      icon: <FaRoute className="text-[#FF5000] text-2xl" />
    },
    {
      step: "5",
      title: "Professional Unloading",
      description: "Upon arrival, items are unloaded, placed in designated rooms, and furniture reassembled where necessary.",
      icon: <BsCheckCircle className="text-[#FF5000] text-2xl" />
    },
    {
      step: "6",
      title: "Final Walkthrough",
      description: "A final walkthrough confirms everything is in order, and post-move support is available should you need it.",
      icon: <BsStar className="text-[#FF5000] text-2xl" />
    }
  ]

  const consolidatedBenefits = [
    "Reduce moving costs without compromising safety or service quality",
    "Access professional moving expertise even for smaller shipments",
    "Flexible options for both residential and corporate clients",
    "Shared transport reduces environmental impact",
    "Professional packing and handling",
    "Real-time tracking and inventory management"
  ]

  const idealClients = [
    {
      type: "Individuals",
      description: "Perfect for people with smaller shipments who want professional service at reduced costs",
      icon: <BsPeople className="text-[#FF5000] text-3xl" />,
      examples: ["Studio apartments", "Small 1-bedroom homes", "Personal belongings", "Student moves"]
    },
    {
      type: "Small Businesses", 
      description: "Cost-effective solution for small office moves and equipment transport",
      icon: <FaBuilding className="text-[#FF5000] text-3xl" />,
      examples: ["Small office equipment", "Store inventory", "Business documents", "Retail displays"]
    },
    {
      type: "Corporate Clients",
      description: "Efficient solution for partial office moves and department relocations",
      icon: <FaDesktop className="text-[#FF5000] text-3xl" />,
      examples: ["Department relocations", "Equipment transfers", "Archive storage", "Branch setups"]
    }
  ]

  const serviceFeatures = [
    "Professional packing services",
    "Secure inventory tracking", 
    "Flexible scheduling options",
    "Shared transport savings",
    "Expert handling of fragiles",
    "Door-to-door service",
    "Insurance coverage options",
    "Real-time delivery updates",
    "Professional unpacking",
    "Post-move follow-up"
  ]

  const costSavings = [
    {
      title: "Up to 40% Savings",
      description: "Compared to dedicated truck moves",
      icon: <FaDollarSign className="text-[#FF5000] text-4xl" />
    },
    {
      title: "No Minimum Volume",
      description: "Perfect for small to medium shipments",
      icon: <BsBoxSeam className="text-[#FF5000] text-4xl" />
    },
    {
      title: "Transparent Pricing",
      description: "Pay only for the space you use",
      icon: <BsClipboardCheck className="text-[#FF5000] text-4xl" />
    }
  ]

  // Get SEO metadata
  const seoData = getPageMetadata("consolidated-moves", {
    location: 'Nairobi',
    service: 'consolidated-moves',
    customTitle: 'Trusted Long-Distance Consolidated Moving Services Kenya | Taylor Movers',
    customDescription: 'Professional long-distance consolidated moving services in Kenya. ✓ 40,000+ successful moves ✓ Cost-effective solutions ✓ 15+ years expertise. Call +254 721 410 517!',
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
        image="consolidated-moves-nairobi.png" 
        text="Trusted Long-Distance Consolidated Moving Services" 
        alt="Taylor Movers Kenya long-distance consolidated moving services with shared transport solutions"
      />

      {/* Hero Section */}
      <div className="container my-16">
        <div className="row items-center">
          <div className="col-md-6">
            <h1 className="text-4xl font-bold text-[#FF5000] mb-4">
              Trusted Long-Distance Consolidated Moving Services
            </h1>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Looking for a smart and cost-effective way to relocate across Kenya? Taylor Movers Kenya offers professional long-distance consolidated moving solutions that deliver the perfect balance of affordability, safety, and reliability.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              By combining shipments from multiple clients into one carefully managed trip, we significantly reduce transportation costs while maintaining the highest standards of care, security, and punctuality. Whether you need to move household items, office equipment, or personal effects across counties, our experienced team ensures every step is smooth, from pickup to delivery.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              With over 15 years of expertise and more than 40,000 successful moves completed, Taylor Movers has built a reputation as Kenya's most trusted partner for long-distance relocation.
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <BsCheckCircle className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">Over 40,000 successful moves completed</span>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <BsShield className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">15+ years of expertise and reliability</span>
            </div>
            <div className="flex items-center space-x-4 mb-8">
              <BsCurrencyDollar className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">Cost-effective long-distance solutions</span>
            </div>
            <QuoteModal quotebtn="orange" />
          </div>
          <div className="col-md-6">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#FF5000] to-[#FF8A50] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <Image
                  src="/assets/services/servicepage photos/Long Distance.jpg"
                  alt="Taylor Movers Kenya consolidated moving truck with shared transport space"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Savings Section */}
      <div className="bg-gradient-to-r from-[#FF5000] to-[#FF8A50] py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Significant Cost Savings
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Share transport costs without compromising on service quality
            </p>
          </div>
          <div className="row">
            {costSavings.map((saving, index) => (
              <div key={index} className="col-lg-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center text-white border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="mb-6">{saving.icon}</div>
                  <h3 className="font-bold text-2xl mb-4">{saving.title}</h3>
                  <p className="text-white/90">{saving.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Consolidated Moves */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#FF5000] mb-4">
              Why Choose Taylor Movers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional moving services with significant cost savings through shared transport
            </p>
          </div>
          <div className="row">
            {whyChooseConsolidated.map((reason, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 h-full">
                  <div className="text-center mb-6">{reason.icon}</div>
                  <h3 className="font-bold text-xl mb-4 text-center text-gray-800">{reason.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-center">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ideal Clients */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#FF5000] mb-4">
            Perfect for These Client Types
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Consolidated moves are ideal for various client types looking for cost-effective solutions
          </p>
        </div>
        <div className="row">
          {idealClients.map((client, index) => (
            <div key={index} className="col-lg-4 mb-8">
              <div className="bg-gradient-to-br from-orange-50 to-red-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="text-center mb-6">{client.icon}</div>
                <h3 className="font-bold text-2xl mb-4 text-center text-gray-800">{client.type}</h3>
                <p className="text-gray-600 mb-6 text-center">{client.description}</p>
                <div className="space-y-2">
                  {client.examples.map((example, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <BsCheckCircle className="text-[#FF5000] text-sm flex-shrink-0" />
                      <span className="text-sm text-gray-600">{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Features Grid */}
      <div className="bg-gray-50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#FF5000] mb-4">
              Complete Consolidated Moving Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              All the benefits of professional moving at a fraction of the cost
            </p>
          </div>
          <div className="row">
            {serviceFeatures.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-4 mb-4">
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:bg-[#FF5000]/5 transition-colors shadow-sm">
                  <BsCheckCircle className="text-[#FF5000] text-xl flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Consolidated Move Process */}
      <div className="bg-gradient-to-r from-[#FF5000] to-[#FF8A50] py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Long-Distance Consolidated Moving Process
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              A systematic approach ensuring every consolidated move is executed flawlessly
            </p>
          </div>

          {/* Pre-Move Planning */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-white mb-12 text-center">
              1. Preparation and Planning
            </h3>
            <div className="row">
              {preparationSteps.map((step, index) => (
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

          {/* Move Execution */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-12 text-center">
              2. Moving Day Execution
            </h3>
            <div className="row">
              {movingDaySteps.map((step, index) => (
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
        </div>
      </div>

      {/* Benefits Summary */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#FF5000] mb-4">
            Benefits of Consolidated Moves
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience professional moving services while saving significantly on costs
          </p>
        </div>
        <div className="bg-gradient-to-r from-[#FF5000] to-[#FF8A50] rounded-3xl p-12 text-white">
          <div className="row">
            {consolidatedBenefits.map((benefit, index) => (
              <div key={index} className="col-md-6 col-lg-4 mb-4">
                <div className="flex items-center space-x-3">
                  <BsCheckCircle className="text-white text-xl flex-shrink-0" />
                  <span className="text-white font-medium">{benefit}</span>
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

export default ConsolidatedMoves