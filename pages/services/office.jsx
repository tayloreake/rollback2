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
  BsBuilding, 
  BsClock, 
  BsGear,
  BsTruck,
  BsBoxSeam,
  BsClipboardCheck,
  BsTools,
  BsStar,
  BsPeople,
  BsLock,
  BsGraphUp
} from 'react-icons/bs'
import { 
  FaBuilding, 
  FaHandshake, 
  FaLightbulb, 
  FaTachometerAlt,
  FaClipboardList,
  FaBoxOpen,
  FaRoute,
  FaUsers,
  FaDesktop,
  FaFileAlt,
  FaWarehouse
} from 'react-icons/fa'
import { MdSecurity, MdBusinessCenter, MdSpeed, MdPrecisionManufacturing } from 'react-icons/md'
import { RiTeamFill, RiShieldCheckFill, RiTimeFill } from 'react-icons/ri'

const OfficeRelocation = () => {

  const whyChooseUs = [
    {
      icon: <RiShieldCheckFill className="text-[#FF5000] text-4xl" />,
      title: "Trustworthy & Reliable",
      description: "Highly trained teams, strict security protocols, and meticulous planning ensure every move of small teams or large enterprises is handled with care and discretion."
    },
    {
      icon: <RiTimeFill className="text-[#FF5000] text-4xl" />,
      title: "Flexible Yet Efficient", 
      description: "We tailor solutions to your business structure, relocation timeline, and workspace needs, using specialized office-moving trucks and advanced equipment to meet deadlines with minimal downtime."
    },
    {
      icon: <MdPrecisionManufacturing className="text-[#FF5000] text-4xl" />,
      title: "Proven Experience",
      description: "From office towers to sensitive government records and large e-commerce warehouses, our expertise ensures complex corporate moves are executed securely, on time, and without operational disruption."
    }
  ]

  const preMoveSteps = [
    {
      step: "1",
      title: "Client Contact",
      description: "Share office size, distance, timelines, and special requirements.",
      icon: <FaClipboardList className="text-[#FF5000] text-2xl" />
    },
    {
      step: "2", 
      title: "On-Site Survey",
      description: "A consultant assesses the office, furniture, and equipment to plan logistics.",
      icon: <BsBuilding className="text-[#FF5000] text-2xl" />
    },
    {
      step: "3",
      title: "Custom Quotation",
      description: "Receive a tailored, transparent proposal and cost estimate.",
      icon: <BsClipboardCheck className="text-[#FF5000] text-2xl" />
    },
    {
      step: "4",
      title: "Contract & Kick-Off",
      description: "Approve the plan and assign a Project Team Leader.",
      icon: <FaHandshake className="text-[#FF5000] text-2xl" />
    },
    {
      step: "5",
      title: "Pre-Move Coordination & Employee Preparation",
      description: "Finalize schedules and guide staff on packing and workstation readiness.",
      icon: <BsPeople className="text-[#FF5000] text-2xl" />
    },
    {
      step: "6",
      title: "Logistics Finalization",
      description: "Confirm access, schedules, and contact points.",
      icon: <BsGear className="text-[#FF5000] text-2xl" />
    }
  ]

  const movingDaySteps = [
    {
      step: "1",
      title: "Pre-Move Briefing",
      description: "Team reviews schedule and responsibilities.",
      icon: <FaClipboardList className="text-[#FF5000] text-2xl" />
    },
    {
      step: "2",
      title: "Site Protection & Packing", 
      description: "Floors, walls, and entry points are safeguarded; items packed and labeled systematically.",
      icon: <BsShield className="text-[#FF5000] text-2xl" />
    },
    {
      step: "3",
      title: "Furniture Disassembly & Special Handling",
      description: "Desks, chairs, and equipment are secured for transport.",
      icon: <BsTools className="text-[#FF5000] text-2xl" />
    },
    {
      step: "4",
      title: "Loading, Transportation & Unloading",
      description: "Inventory tracked; items transported safely to the new location.",
      icon: <BsTruck className="text-[#FF5000] text-2xl" />
    },
    {
      step: "5",
      title: "Reassembly & Optional Unpacking",
      description: "Furniture rebuilt and materials arranged according to your office layout.",
      icon: <BsGear className="text-[#FF5000] text-2xl" />
    },
    {
      step: "6",
      title: "Debris Removal & Final Walk-Through",
      description: "Packaging removed and setup verified.",
      icon: <BsCheckCircle className="text-[#FF5000] text-2xl" />
    },
    {
      step: "7",
      title: "Post-Move Support",
      description: "Assistance with any follow-up needs or adjustments.",
      icon: <BsStar className="text-[#FF5000] text-2xl" />
    }
  ]

  const serviceFeatures = [
    "Complete office relocations",
    "IT equipment handling", 
    "Furniture disassembly/reassembly",
    "Sensitive document management",
    "Workspace layout planning",
    "After-hours & weekend moves",
    "Government & corporate projects",
    "Warehouse relocations",
    "Minimal business disruption",
    "Secure chain of custody"
  ]

  const businessTypes = [
    {
      icon: <BsBuilding className="text-[#FF5000] text-3xl" />,
      title: "Corporate Offices",
      description: "Full-scale relocations for businesses of all sizes"
    },
    {
      icon: <FaWarehouse className="text-[#FF5000] text-3xl" />,
      title: "Warehouses",
      description: "Large-scale equipment and inventory moves"
    },
    {
      icon: <FaFileAlt className="text-[#FF5000] text-3xl" />,
      title: "Government Facilities",
      description: "Secure handling of sensitive records and equipment"
    },
    {
      icon: <FaDesktop className="text-[#FF5000] text-3xl" />,
      title: "IT Companies",
      description: "Specialized handling of servers and tech equipment"
    }
  ]

  // Get SEO metadata
  const seoData = getPageMetadata("office-relocation", {
    location: 'Nairobi',
    service: 'office-relocation',
    customTitle: 'Professional Office Relocation Services Nairobi | Taylor Movers Kenya',
    customDescription: 'Expert office moving services in Nairobi & Kenya. ✓ Minimal downtime ✓ Secure handling ✓ Government & corporate moves ✓ 40,000+ successful moves. Call +254 721 410 517!',
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
      
      {/* Spacer for fixed navbar */}
      <div className="h-[100px] md:h-[80px]"></div>

      <Jumbotron
        image="office-relocation-nairobi.png" 
        text="Professional Office Relocation Services" 
        alt="Taylor Movers Kenya professional team handling office relocation in Nairobi"
      />

      {/* Hero Section */}
      <div className="container my-16">
        <div className="row items-center">
          <div className="col-md-6">
            <h1 className="text-4xl font-bold text-[#FF5000] mb-4">
              Professional Office Relocation Services
            </h1>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Relocating your office in Nairobi or across Kenya is more than a change of address—it's a critical 
              business move. Taylor Movers Kenya specializes in seamless office relocations, combining local expertise 
              with global standards as members of the International Association of Movers. Since 2011, we've successfully 
              completed over 40,000 moves, earning a reputation as one of Kenya's most trusted office moving companies.
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <BsGraphUp className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">Minimal business disruption guaranteed</span>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <BsLock className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">Strict security protocols for sensitive data</span>
            </div>
            <div className="flex items-center space-x-4 mb-8">
              <BsClock className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">Over 40,000 successful corporate moves</span>
            </div>
            <QuoteModal quotebtn="orange" />
          </div>
          <div className="col-md-6">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#FF5000] to-[#FF8A50] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <Image
                  src="/assets/services/servicepage photos/Office Moves.jpg"
                  alt="Professional office relocation team from Taylor Movers Kenya"
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
              Why Choose Taylor Movers for Office Relocation?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your business operations matter. We ensure seamless transitions with zero compromise on security or efficiency.
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

      {/* Business Types We Serve */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#FF5000] mb-4">
            Business Types We Serve
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From small startups to large enterprises, we handle all types of business relocations
          </p>
        </div>
        <div className="row">
          {businessTypes.map((type, index) => (
            <div key={index} className="col-md-6 col-lg-3 mb-8">
              <div className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-[#FF5000]/5 transition-all duration-300 h-full">
                <div className="mb-4">{type.icon}</div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">{type.title}</h3>
                <p className="text-gray-600">{type.description}</p>
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
              Complete Office Moving Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every aspect of your office move handled with professional precision
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

      {/* Office Relocation Process Section */}
      <div className="bg-gradient-to-r from-[#FF5000] to-[#FF8A50] py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Office Relocation Process
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              A structured approach to minimize downtime and ensure business continuity
            </p>
          </div>

          {/* Pre-Move Planning */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-white mb-12 text-center">
              1. Pre-Move Planning
            </h3>
            <div className="row">
              {preMoveSteps.map((step, index) => (
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

      {/* Membership Badge */}
      <div className="container py-16">
        <div className="bg-gradient-to-r from-[#FF5000] to-[#FF8A50] rounded-3xl p-12 text-center text-white">
          <div className="mb-6">
            <MdBusinessCenter className="text-6xl mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">International Association of Movers</h3>
            <p className="text-xl opacity-90">Global standards, local expertise</p>
          </div>
          <p className="text-lg max-w-3xl mx-auto">
            As proud members of the International Association of Movers, we adhere to the highest international 
            standards for office relocations, ensuring your business move meets global best practices.
          </p>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  )
}

export default OfficeRelocation