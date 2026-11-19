import React from 'react'
import Image from 'next/image'
import getPageMetadata from '../../SEO/seo'
import Head from 'next/head'
import Jumbotron from '../../components/jumbotron'
import QuoteModal from '../../components/Quote/QuoteModal'
import NewsletterSection from '../../components/NewsletterSection'
import { BsCheckCircle, BsShield, BsTruck, BsClock } from 'react-icons/bs'
import { FaTools, FaPiano, FaPaw } from 'react-icons/fa'

const SpecializedServices = () => {
  const specializedServices = [
    {
      title: "Piano Moving",
      description: "Professional piano moving services with specialized equipment for grand pianos, uprights, and digital pianos.",
      icon: <FaPiano className="text-[#FF5000] text-3xl" />,
      link: "/services/piano-moving",
      features: ["Specialized Equipment", "Expert Team", "Climate Control", "Full Insurance"]
    },
    {
      title: "Pet Relocation", 
      description: "Safe and stress-free pet relocation services with proper documentation and care.",
      icon: <FaPaw className="text-[#FF5000] text-3xl" />,
      link: "/services/pet-relocation",
      features: ["International Standards", "Vet Services", "Documentation", "24/7 Care"]
    },
    {
      title: "Furniture Assembly",
      description: "Professional furniture assembly and disassembly services for all types of furniture.",
      icon: <FaTools className="text-[#FF5000] text-3xl" />,
      link: "/services/furniture-assembly", 
      features: ["Expert Assembly", "Quality Tools", "Warranty", "Quick Service"]
    },
    {
      title: "Packing Services",
      description: "Professional packing services using high-quality materials and expert techniques.",
      icon: <BsTruck className="text-[#FF5000] text-3xl" />,
      link: "/services/packing-services",
      features: ["Quality Materials", "Expert Packing", "Labeling System", "Unpacking Service"]
    }
  ]

  // Get SEO metadata
  const seoData = getPageMetadata("specialized-services", {
    location: 'Nairobi',
    service: 'specialized-services',
    customTitle: 'Specialized Moving Services Nairobi | Piano, Pet, Assembly | Taylor Movers',
    customDescription: 'Professional specialized moving services in Nairobi. Piano moving, pet relocation, furniture assembly & packing services. Expert care for special items. Call +254 721 410 517!',
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
        image="specialized-services-kenya.png" 
        text="Specialized Moving Services" 
        alt="Taylor Movers Kenya specialized moving services including piano moving and pet relocation"
      />

      {/* Hero Section */}
      <div className="container my-16">
        <div className="row items-center">
          <div className="col-md-6">
            <h1 className="text-4xl font-bold text-[#FF5000] mb-4">
              Specialized Moving Services in Kenya
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Some items require special care and expertise. Taylor Movers Kenya provides 
              specialized moving services for pianos, pets, furniture assembly, and professional 
              packing to ensure your most valuable and delicate items are handled with the 
              utmost care and precision.
            </p>
            <div className="flex items-center space-x-4 mb-6">
              <BsShield className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700">Specialized equipment and techniques</span>
            </div>
            <div className="flex items-center space-x-4 mb-8">
              <BsCheckCircle className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700">Expert trained professionals</span>
            </div>
            <QuoteModal quotebtn="orange" />
          </div>
          <div className="col-md-6">
            <div className="relative">
              <Image
                src="/assets/services/specialized-moving-services.jpg"
                alt="Taylor Movers specialized services team handling delicate items"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="bg-gray-50 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-[#FF5000] mb-12">
            Our Specialized Services
          </h2>
          <div className="row">
            {specializedServices.map((service, index) => (
              <div key={index} className="col-md-6 mb-8">
                <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow h-full">
                  <div className="flex items-center mb-6">
                    <div className="mr-4">{service.icon}</div>
                    <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <BsCheckCircle className="text-[#FF5000] mr-2 text-sm" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <a 
                    href={service.link}
                    className="inline-block bg-[#FF5000] text-white px-6 py-2 rounded-lg hover:bg-[#e04400] transition-colors"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection 
        title="Need Specialized Moving Services?"
        subtitle="Contact us today for expert handling of your valuable and delicate items. Get a free consultation and quote."
      />
    </div>
  )
}

export default SpecializedServices