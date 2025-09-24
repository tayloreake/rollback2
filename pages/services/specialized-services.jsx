import React from 'react'
import Image from 'next/image'
import getPageMetadata from '../../SEO/seo'
import Head from 'next/head'
import Jumbotron from '../../components/jumbotron'
import QuoteModal from '../../components/Quote/QuoteModal'
import NewsletterSection from '../../components/NewsletterSection'
import { BsCheckCircle, BsShield, BsTruck, BsClock } from 'react-icons/bs'
import { FaPaw } from 'react-icons/fa'

const SpecializedServices = () => {
  const specializedServices = [
    {
      title: "Pet Relocation", 
      description: "Safe and stress-free pet relocation services with proper documentation and care.",
      icon: <FaPaw className="text-[#FF5000] text-3xl" />,
      link: "/services/pet-relocation",
      features: ["International Standards", "Vet Services", "Documentation", "24/7 Care"]
    }
  ]

  // Get SEO metadata
  const seoData = getPageMetadata("specialized-services", {
    location: 'Nairobi',
    service: 'specialized-services',
    customTitle: 'Specialized Moving Services Nairobi | Pet Relocation | Taylor Movers',
    customDescription: 'Professional pet relocation services in Nairobi and internationally. Safe, stress-free pet moving with proper documentation and veterinary care. Call +254 721 410 517!',
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
              Moving with pets requires special care and expertise. Taylor Movers Kenya provides 
              professional pet relocation services to ensure your beloved companions travel 
              safely and comfortably to their new home, whether locally within Kenya or internationally.
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