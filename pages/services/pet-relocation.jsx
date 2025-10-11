import React from 'react'
import Image from 'next/image'
import getPageMetadata from '../../SEO/seo'
import Head from 'next/head'
import Jumbotron from '../../components/jumbotron'
import QuoteModal from '../../components/Quote/QuoteModal'
import NewsletterSection from '../../components/NewsletterSection'
import { BsCheckCircle, BsShield, BsTruck, BsClock, BsGlobe } from 'react-icons/bs'
import { FaPaw, FaPlane, FaFileAlt } from 'react-icons/fa'

const PetRelocation = () => {
  const features = [
    {
      icon: <BsShield className="text-[#FF5000] text-3xl" />,
      title: "International Standards",
      description: "IATA-compliant pet travel crates and procedures meeting international pet transport standards."
    },
    {
      icon: <FaPaw className="text-[#FF5000] text-3xl" />,
      title: "Veterinary Services",
      description: "Full veterinary check-ups, vaccinations, health certificates, and pre-travel consultations."
    },
    {
      icon: <FaFileAlt className="text-[#FF5000] text-3xl" />,
      title: "Complete Documentation",
      description: "We handle all import/export permits, health certificates, and customs paperwork for stress-free travel."
    },
    {
      icon: <BsClock className="text-[#FF5000] text-3xl" />,
      title: "24/7 Care & Monitoring",
      description: "Round-the-clock monitoring and care throughout the entire relocation journey."
    }
  ]

  const petTypes = [
    {
      type: "Dogs & Cats",
      description: "Safe relocation for dogs and cats of all breeds and sizes, both domestically and internationally.",
      services: ["Health checks", "IATA crates", "Climate control", "Door-to-door"]
    },
    {
      type: "Birds",
      description: "Specialized care for parrots, canaries, and other pet birds with proper ventilation and temperature control.",
      services: ["Custom cages", "Temperature control", "Vet clearance", "Safe transport"]
    },
    {
      type: "Small Animals",
      description: "Rabbits, guinea pigs, hamsters, and other small pets transported with specialized care.",
      services: ["Secure carriers", "Climate control", "Health checks", "Stress-free"]
    },
    {
      type: "Exotic Pets",
      description: "Expert handling of reptiles, amphibians, and other exotic pets requiring special permits.",
      services: ["Special permits", "Expert care", "Temperature control", "Custom solutions"]
    }
  ]

  const process = [
    {
      step: "1",
      title: "Initial Consultation",
      description: "We assess your pet's needs, destination requirements, and create a customized relocation plan."
    },
    {
      step: "2", 
      title: "Veterinary Preparation",
      description: "Complete health check-ups, vaccinations, microchipping, and obtaining necessary health certificates."
    },
    {
      step: "3",
      title: "Documentation & Permits",
      description: "We handle all paperwork including import permits, export certificates, and customs documentation."
    },
    {
      step: "4",
      title: "Pre-Travel Arrangements",
      description: "IATA-approved travel crates, flight bookings, and ground transportation coordination."
    },
    {
      step: "5",
      title: "Safe Transportation",
      description: "Climate-controlled vehicles, professional handling, and 24/7 monitoring during transit."
    },
    {
      step: "6",
      title: "Delivery & Settling",
      description: "Door-to-door delivery and post-arrival support to help your pet settle into their new home."
    }
  ]

  const destinations = [
    "United Kingdom",
    "United States",
    "Canada",
    "Australia", 
    "UAE",
    "South Africa",
    "European Union Countries",
    "And many more destinations worldwide"
  ]

  // Get SEO metadata
  const seoData = getPageMetadata("pet-relocation", {
    location: 'Nairobi',
    service: 'pet-relocation',
    customTitle: 'Professional Pet Relocation Services Kenya | International Pet Transport',
    customDescription: 'Expert pet relocation services in Kenya. ✓ International pet transport ✓ IATA standards ✓ Vet services ✓ Complete documentation. Safe pet moving worldwide. Call +254 721 410 517!',
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
        image="petrelocations.png" 
        text="Professional Pet Relocation Services" 
        alt="Taylor Movers Kenya professional pet relocation services with caring pet handlers"
      />

      {/* Hero Section */}
      <div className="container my-12">
        <div className="row items-center">
          <div className="col-md-6">
            <h1 className="text-4xl font-bold text-[#FF5000] mb-4">
              Safe & Stress-Free Pet Relocation Services
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Your pets are family, and relocating them requires special care, expertise, and compassion. 
              Taylor Movers Kenya provides comprehensive pet relocation services for both domestic and international 
              moves, ensuring your beloved companions travel safely and comfortably to their new home.
            </p>
            <div className="flex items-center space-x-4 mb-6">
              <FaPaw className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700">Hundreds of pets relocated safely</span>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <BsGlobe className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700">International pet transport expertise</span>
            </div>
            <div className="flex items-center space-x-4 mb-8">
              <BsShield className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700">IATA-compliant and fully licensed</span>
            </div>
            <QuoteModal quotebtn="orange" />
          </div>
          <div className="col-md-6">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#FF5000] to-[#FF8A50] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <Image
                  src="/assets/jumbotron/petrelocations.png"
                  alt="Professional pet relocation specialists caring for pets during transport in Kenya"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-[#FF5000] mb-12">
            Why Choose Our Pet Relocation Services?
          </h2>
          <div className="row">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3 mb-8">
                <div className="text-center bg-white p-6 rounded-lg shadow-md h-full">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pet Types Section */}
      <div className="container py-16">
        <h2 className="text-3xl font-bold text-center text-[#FF5000] mb-12">
          Pets We Relocate
        </h2>
        <div className="row">
          {petTypes.map((pet, index) => (
            <div key={index} className="col-md-6 mb-8">
              <div className="border-2 border-[#FF5000] rounded-lg p-6 h-full">
                <h3 className="text-xl font-bold text-[#FF5000] mb-3">{pet.type}</h3>
                <p className="text-gray-700 mb-4">{pet.description}</p>
                <div className="space-y-2">
                  {pet.services.map((service, idx) => (
                    <div key={idx} className="flex items-center">
                      <BsCheckCircle className="text-[#FF5000] mr-2" />
                      <span className="text-gray-600">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gradient-to-r from-[#FF5000] to-[#FF8A50] py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Our Pet Relocation Process
          </h2>
          <div className="row">
            {process.map((item, index) => (
              <div key={index} className="col-md-6 col-lg-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-white text-[#FF5000] rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-lg text-white">{item.title}</h3>
                  </div>
                  <p className="text-white/90">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Destinations Section */}
      <div className="container py-16">
        <h2 className="text-3xl font-bold text-center text-[#FF5000] mb-12">
          International Pet Relocation Destinations
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          We provide pet relocation services to destinations worldwide, handling all requirements for each country's specific pet import regulations.
        </p>
        <div className="row">
          {destinations.map((destination, index) => (
            <div key={index} className="col-md-6 col-lg-3 mb-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaPlane className="text-[#FF5000] mr-3" />
                <span className="text-gray-700">{destination}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <QuoteModal quotebtn="default" />
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection 
        title="Ready to Relocate Your Pet?"
        subtitle="Get your free pet relocation consultation today. Our experts will guide you through the entire process and ensure your pet's safe journey. Subscribe for pet travel tips and updates."
      />
    </div>
  )
}

export default PetRelocation
