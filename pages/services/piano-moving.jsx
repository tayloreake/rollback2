import React from 'react'
import Image from 'next/image'
import getPageMetadata from '../../SEO/seo'
import Head from 'next/head'
import Jumbotron from '../../components/jumbotron'
import QuoteModal from '../../components/Quote/QuoteModal'
import NewsletterSection from '../../components/NewsletterSection'
import { BsCheckCircle, BsShield, BsTruck, BsClock } from 'react-icons/bs'
import { FaGuitar, FaMusic } from 'react-icons/fa' // Fixed: FaMusic instead of FaPiano

const PianoMoving = () => {
  const features = [
    {
      icon: <BsShield className="text-[#FF5000] text-3xl" />,
      title: "Specialized Equipment",
      description: "Professional piano dollies, padded straps, and protective blankets designed specifically for piano moving."
    },
    {
      icon: <BsClock className="text-[#FF5000] text-3xl" />,
      title: "Expert Team",
      description: "Our trained specialists have years of experience moving grand pianos, uprights, and digital pianos safely."
    },
    {
      icon: <BsTruck className="text-[#FF5000] text-3xl" />,
      title: "Climate-Controlled Transport",
      description: "Temperature and humidity controlled vehicles to protect your piano from environmental damage."
    },
    {
      icon: <BsCheckCircle className="text-[#FF5000] text-3xl" />,
      title: "Full Insurance Coverage",
      description: "Comprehensive insurance coverage for your valuable instrument throughout the entire move."
    }
  ]

  const pianoTypes = [
    {
      type: "Grand Pianos",
      description: "Concert grands, baby grands, and parlor grands require specialized handling and equipment."
    },
    {
      type: "Upright Pianos",
      description: "Studio uprights, console pianos, and full-size uprights moved with care and precision."
    },
    {
      type: "Digital Pianos",
      description: "Modern digital and electric pianos handled with appropriate protective measures."
    },
    {
      type: "Organs & Keyboards",
      description: "Church organs, Hammond organs, and professional keyboards safely relocated."
    }
  ]

  const process = [
    {
      step: "1",
      title: "Pre-Move Assessment",
      description: "Our specialists visit your location to assess the piano, measure doorways, stairs, and plan the safest route."
    },
    {
      step: "2", 
      title: "Preparation & Protection",
      description: "We wrap and protect your piano with specialized blankets, secure the keyboard lid, and prepare all moving equipment."
    },
    {
      step: "3",
      title: "Safe Transportation",
      description: "Using professional piano dollies and our climate-controlled vehicles, we transport your piano securely."
    },
    {
      step: "4",
      title: "Careful Placement",
      description: "We position your piano exactly where you want it and can arrange for tuning services if needed."
    }
  ]

  // Get SEO metadata
  const seoData = getPageMetadata("piano-moving", {
    location: 'Nairobi',
    service: 'piano-moving',
    customTitle: 'Professional Piano Moving Services Nairobi | Safe Piano Transport Kenya',
    customDescription: 'Expert piano movers in Nairobi, Kenya. ✓ Specialized equipment ✓ Trained professionals ✓ Grand & upright pianos ✓ Full insurance. Call +254 721 410 517!',
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
        image="piano-moving-professionals.png" 
        text="Professional Piano Moving" 
        alt="Taylor Movers Kenya professionals carefully moving a grand piano with specialized equipment"
      />

      {/* Hero Section */}
      <div className="container my-12">
        <div className="row items-center">
          <div className="col-md-6">
            <h1 className="text-4xl font-bold text-[#FF5000] mb-4">
              Expert Piano Moving Services in Nairobi
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Your piano is more than just an instrument—it's an investment, a family heirloom, and a source of beautiful music. 
              At Taylor Movers Kenya, we understand the unique challenges of moving pianos and provide specialized services 
              to ensure your precious instrument arrives safely at its new home.
            </p>
            <div className="flex items-center space-x-4 mb-6">
              <FaMusic className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700">Over 500 pianos moved successfully</span>
            </div>
            <div className="flex items-center space-x-4 mb-8">
              <BsShield className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700">Fully insured and licensed professionals</span>
            </div>
            <QuoteModal quotebtn="orange" />
          </div>
          <div className="col-md-6">
            <div className="relative">
              <Image
                src="/assets/services/servicepage photos/Specialized 2.jpg"
                alt="Professional piano movers carefully handling a grand piano in Nairobi"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-[#FF5000] mb-12">
            Why Choose Our Piano Moving Services?
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

      {/* Piano Types We Move */}
      <div className="container py-16">
        <h2 className="text-3xl font-bold text-center text-[#FF5000] mb-12">
          Piano Types We Move
        </h2>
        <div className="row">
          {pianoTypes.map((piano, index) => (
            <div key={index} className="col-md-6 mb-8">
              <div className="border-2 border-[#FF5000] rounded-lg p-6 h-full hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-[#FF5000] mb-3">{piano.type}</h3>
                <p className="text-gray-700">{piano.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-2xl max-w-2xl mx-auto shadow-lg">
            <h3 className="text-2xl font-bold text-[#FF5000] mb-4">
              Get a Custom Quote for Your Piano Move
            </h3>
            <p className="text-gray-600 mb-6">
              Every piano move is unique. Contact us for a personalized quote based on your specific requirements, 
              including piano type, size, location, stairs, and any special needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <QuoteModal quotebtn="default" />
              <a 
                href="tel:+254721410517" 
                className="px-8 py-3 bg-white border-2 border-[#FF5000] text-[#FF5000] font-bold rounded-lg hover:bg-[#FF5000] hover:text-white transition-all"
              >
                Call: +254 721 410 517
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-[#F8F9FA] py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-[#FF5000] mb-12">
            Our Piano Moving Process
          </h2>
          <div className="row">
            {process.map((item, index) => (
              <div key={index} className="col-md-6 col-lg-3 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#FF5000] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection 
        title="Ready to Move Your Piano?"
        subtitle="Get your free quote today and let our piano moving experts handle your precious instrument with care. Subscribe for moving tips and special offers."
      />
    </div>
  )
}

export default PianoMoving