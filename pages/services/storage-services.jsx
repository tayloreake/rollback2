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
  BsStar,
  BsEye,
  BsKey,
  BsThermometer,
  BsBuilding
} from 'react-icons/bs'
import { 
  FaWarehouse, 
  FaHandshake, 
  FaLightbulb, 
  FaTachometerAlt,
  FaClipboardList,
  FaBoxOpen,
  FaRoute,
  FaUsers,
  FaDesktop,
  FaFileAlt,
  FaFire,
  FaVideo,
  FaBug
} from 'react-icons/fa'
import { MdSecurity, MdSupport, MdSpeed, MdInventory, MdAccessTime, MdCleaningServices } from 'react-icons/md'
import { RiShieldCheckFill, RiCustomerService2Fill } from 'react-icons/ri'

const StorageServices = () => {

  const whyChooseStorage = [
    {
      icon: <FaWarehouse className="text-[#FF5000] text-4xl" />,
      title: "Variety of Unit Sizes",
      description: "From small personal items to large furniture or bulk inventory, we provide storage solutions that fit your needs."
    },
    {
      icon: <MdCleaningServices className="text-[#FF5000] text-4xl" />,
      title: "Clean & Pest-Controlled Environment", 
      description: "Climate-conscious, regularly maintained facilities ensure your belongings remain in pristine condition."
    },
    {
      icon: <MdAccessTime className="text-[#FF5000] text-4xl" />,
      title: "Easy Access & Convenience",
      description: "Wide loading docks, trolleys, elevators, and optional 24/7 access provide seamless operations."
    },
    {
      icon: <MdSecurity className="text-[#FF5000] text-4xl" />,
      title: "Fire & Theft Protection",
      description: "Advanced fire detection, suppression systems, and 24/7 CCTV monitoring guarantee safety."
    },
    {
      icon: <RiShieldCheckFill className="text-[#FF5000] text-4xl" />,
      title: "Strong & Secure Infrastructure",
      description: "Durable, climate-resistant warehouses handle heavy goods and long-term storage needs."
    },
    {
      icon: <RiCustomerService2Fill className="text-[#FF5000] text-4xl" />,
      title: "Friendly Support Team",
      description: "Knowledgeable staff assist with consultations, guided tours, and ongoing support."
    }
  ]

  const consultationSteps = [
    {
      step: "1",
      title: "Client Consultation",
      description: "Determine storage needs, volume, duration, and special requirements.",
      icon: <FaClipboardList className="text-[#FF5000] text-2xl" />
    },
    {
      step: "2", 
      title: "Customized Recommendation",
      description: "Customized recommendation of unit size and storage solution.",
      icon: <FaWarehouse className="text-[#FF5000] text-2xl" />
    },
    {
      step: "3",
      title: "Transparent Quotation",
      description: "Transparent quotation covering packing, transport, and warehousing fees.",
      icon: <BsClipboardCheck className="text-[#FF5000] text-2xl" />
    },
    {
      step: "4",
      title: "Storage Contract Agreement",
      description: "Storage contract agreement with clear terms, access protocols, and payment schedule.",
      icon: <FaHandshake className="text-[#FF5000] text-2xl" />
    }
  ]

  const storageExecutionSteps = [
    {
      step: "1",
      title: "Professional Packing & Inventory",
      description: "Professional packing and inventory management using barcodes and protective materials.",
      icon: <BsBoxSeam className="text-[#FF5000] text-2xl" />
    },
    {
      step: "2",
      title: "Transport to Warehouse", 
      description: "Transport of goods directly to our Nairobi warehouse to minimize handling.",
      icon: <BsTruck className="text-[#FF5000] text-2xl" />
    },
    {
      step: "3",
      title: "Safe Warehousing",
      description: "Safe warehousing in climate-protected, CCTV-monitored units; items palletized, shelved, or vault-stored as needed.",
      icon: <FaWarehouse className="text-[#FF5000] text-2xl" />
    },
    {
      step: "4",
      title: "Digital Inventory Tracking",
      description: "Digital inventory tracking for easy, accurate retrieval.",
      icon: <MdInventory className="text-[#FF5000] text-2xl" />
    },
    {
      step: "5",
      title: "Flexible Access",
      description: "Flexible access by appointment for full control over your possessions.",
      icon: <BsKey className="text-[#FF5000] text-2xl" />
    },
    {
      step: "6",
      title: "Retrieval & Delivery",
      description: "Retrieval and delivery services, including optional furniture reassembly and unpacking.",
      icon: <BsCheckCircle className="text-[#FF5000] text-2xl" />
    }
  ]

  const postStorageSteps = [
    {
      step: "1",
      title: "Final Payment Processing",
      description: "Final payment processing and invoicing.",
      icon: <BsClipboardCheck className="text-[#FF5000] text-2xl" />
    },
    {
      step: "2",
      title: "Follow-up by Storage Consultant",
      description: "Follow-up by a dedicated storage consultant.",
      icon: <FaUsers className="text-[#FF5000] text-2xl" />
    },
    {
      step: "3",
      title: "Standing Orders Option",
      description: "Option to set up standing orders for ongoing storage.",
      icon: <BsClock className="text-[#FF5000] text-2xl" />
    },
    {
      step: "4",
      title: "Service Feedback",
      description: "Opportunity to provide service feedback to improve our offerings.",
      icon: <BsStar className="text-[#FF5000] text-2xl" />
    }
  ]

  const storageFeatures = [
    "Climate-controlled units",
    "24/7 CCTV monitoring", 
    "Fire detection & suppression",
    "Pest control maintenance",
    "Wide loading docks",
    "Trolleys & elevators",
    "Digital inventory tracking",
    "Flexible access hours",
    "Professional packing",
    "Secure entry systems"
  ]

  const storageTypes = [
    {
      title: "Personal Storage",
      description: "Household items, furniture, and personal belongings",
      size: "5m² - 50m²",
      icon: <BsHouse className="text-[#FF5000] text-4xl" />,
      features: ["Climate controlled", "Easy access", "Security monitored", "Short & long term"]
    },
    {
      title: "Business Storage",
      description: "Office equipment, inventory, and commercial goods",
      size: "10m² - 200m²",
      icon: <BsBuilding className="text-[#FF5000] text-4xl" />,
      features: ["Bulk capacity", "Loading dock access", "Business hours", "Document storage"]
    },
    {
      title: "Warehouse Storage",
      description: "Large-scale inventory and distribution storage",
      size: "100m² - 1000m²",
      icon: <FaWarehouse className="text-[#FF5000] text-4xl" />,
      features: ["Near JKIA", "Distribution ready", "Forklift access", "Bulk handling"]
    }
  ]

  const securityFeatures = [
    {
      icon: <FaVideo className="text-[#FF5000] text-3xl" />,
      title: "24/7 CCTV Monitoring",
      description: "Comprehensive surveillance system with recorded monitoring"
    },
    {
      icon: <FaFire className="text-[#FF5000] text-3xl" />,
      title: "Fire Detection System",
      description: "Advanced fire detection and automatic suppression systems"
    },
    {
      icon: <BsKey className="text-[#FF5000] text-3xl" />,
      title: "Secure Access Control",
      description: "Controlled entry with personalized access codes and monitoring"
    },
    {
      icon: <BsThermometer className="text-[#FF5000] text-3xl" />,
      title: "Climate Control",
      description: "Temperature and humidity controlled environment"
    },
    {
      icon: <FaBug className="text-[#FF5000] text-3xl" />,
      title: "Pest Control",
      description: "Regular pest control maintenance and monitoring"
    },
    {
      icon: <BsShield className="text-[#FF5000] text-3xl" />,
      title: "Insurance Options",
      description: "Comprehensive insurance coverage for stored items"
    }
  ]

  // Get SEO metadata
  const seoData = getPageMetadata("storage-services", {
    location: 'Nairobi',
    service: 'storage-services',
    customTitle: 'Secure Storage Services Nairobi | Professional Warehousing Kenya',
    customDescription: 'Professional storage solutions in Nairobi. ✓ Climate controlled ✓ 24/7 security ✓ Near JKIA ✓ Flexible access ✓ Business & personal storage. Call +254 721 410 517!',
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
        image="storage-services-nairobi.png" 
        text="Secure & Professional Storage Services" 
        alt="Taylor Movers Kenya secure storage facilities in Nairobi"
      />

      {/* Hero Section */}
      <div className="container my-16">
        <div className="row items-center">
          <div className="col-md-6">
            <h1 className="text-4xl font-bold text-[#FF5000] mb-4">
              Secure & Professional Storage Services
            </h1>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Taylor Movers Kenya offers reliable, affordable, and high-security storage solutions in Nairobi 
              for both residential and corporate clients. Whether storing household items, office equipment, 
              or commercial goods, our warehouses provide flexible options for short-term or long-term storage. 
              Strategically located near JKIA, our facilities support easy access for local and international 
              businesses, making distribution and logistics efficient and convenient.
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <BsEye className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">24/7 CCTV monitoring & security</span>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <BsThermometer className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">Climate-controlled environment</span>
            </div>
            <div className="flex items-center space-x-4 mb-8">
              <FaRoute className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">Strategically located near JKIA</span>
            </div>
            <QuoteModal quotebtn="orange" />
          </div>
          <div className="col-md-6">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#FF5000] to-[#FF8A50] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <Image
                  src="/assets/services/servicepage photos/Warehousing 1 .jpg"
                  alt="Taylor Movers Kenya secure storage facility in Nairobi"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Our Storage Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#FF5000] mb-4">
              Why Choose Taylor Movers Storage?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional storage solutions with uncompromising security and convenience
            </p>
          </div>
          <div className="row">
            {whyChooseStorage.map((reason, index) => (
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

      {/* Storage Types */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#FF5000] mb-4">
            Storage Solutions for Every Need
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From personal belongings to business inventory, we have the right storage solution
          </p>
        </div>
        <div className="row">
          {storageTypes.map((type, index) => (
            <div key={index} className="col-lg-4 mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 h-full">
                <div className="text-center mb-6">{type.icon}</div>
                <h3 className="font-bold text-2xl mb-3 text-center text-gray-800">{type.title}</h3>
                <p className="text-gray-600 mb-4 text-center">{type.description}</p>
                <div className="text-center mb-6">
                  <span className="inline-block px-4 py-2 bg-[#FF5000]/10 text-[#FF5000] rounded-full font-semibold">
                    {type.size}
                  </span>
                </div>
                <div className="space-y-2">
                  {type.features.map((feature, idx) => (
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

      {/* Security Features */}
      <div className="bg-gray-50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#FF5000] mb-4">
              Advanced Security Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your belongings are protected by multiple layers of security
            </p>
          </div>
          <div className="row">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-4 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="text-center mb-4">{feature.icon}</div>
                  <h3 className="font-bold text-xl mb-3 text-center text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 text-center">{feature.description}</p>
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
            Complete Storage Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for safe and convenient storage
          </p>
        </div>
        <div className="row">
          {storageFeatures.map((feature, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-[#FF5000]/5 transition-colors">
                <BsCheckCircle className="text-[#FF5000] text-xl flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Process Section */}
      <div className="bg-gradient-to-r from-blue-900 to-gray-900 py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Storage Process
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              A systematic approach to secure and convenient storage
            </p>
          </div>

          {/* Pre-Storage Consultation & Planning */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-white mb-12 text-center">
              1. Pre-Storage Consultation & Planning
            </h3>
            <div className="row">
              {consultationSteps.map((step, index) => (
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

          {/* Secure Storage Execution */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-white mb-12 text-center">
              2. Secure Storage Execution
            </h3>
            <div className="row">
              {storageExecutionSteps.map((step, index) => (
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

          {/* Post-Storage Support */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-12 text-center">
              3. Post-Storage Support
            </h3>
            <div className="row">
              {postStorageSteps.map((step, index) => (
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

      {/* Location Advantage */}
      <div className="container py-16">
        <div className="bg-gradient-to-r from-[#FF5000] to-[#FF8A50] rounded-3xl p-12 text-center text-white">
          <div className="mb-6">
            <FaRoute className="text-6xl mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">Strategic Location Near JKIA</h3>
            <p className="text-xl opacity-90">Perfect for logistics and distribution</p>
          </div>
          <p className="text-lg max-w-3xl mx-auto">
            Our storage facilities are strategically located near Jomo Kenyatta International Airport, 
            providing easy access for local and international businesses. This prime location makes 
            distribution and logistics efficient and convenient for all your storage needs.
          </p>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  )
}

export default StorageServices