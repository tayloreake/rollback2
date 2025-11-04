import React from 'react'
import Image from 'next/image'
import getPageMetadata from '../../SEO/seo'
import Head from 'next/head'
import Jumbotron from '../../components/jumbotron'
import dynamic from 'next/dynamic'
const QuoteModal = dynamic(() => import('../../components/Quote/QuoteModal'), { ssr: false, loading: () => null })
const NewsletterSection = dynamic(() => import('../../components/NewsletterSection'), { ssr: false, loading: () => null })
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
                src="/assets/taylor-hero-images/taylor-movers-professional-team.jpg"
                alt="Taylor Movers specialized services team handling delicate items"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Beyond Moving – Complete Support */}
      <div className="container my-16">
        <div className="row">
          <div className="col-md-12">
            <h2 className="text-3xl font-bold text-[#FF5000] mb-4">Beyond Moving – Complete Support from Packing to Setup</h2>
            <p className="text-lg text-gray-700 mb-4">
              At Taylor Movers Kenya, we go beyond basic moving. As one of the most trusted moving companies in Nairobi, we provide specialized services to ensure that every aspect of your relocation—whether residential, office, or international—is handled with precision, care, and convenience.
            </p>
            <p className="text-lg text-gray-700">
              From expert packing and custom crating to post-move utilities and workspace transformation, we handle the details so you can settle in faster.
            </p>
          </div>
        </div>
      </div>

      {/* Packing Services */}
      <div className="bg-gray-50 py-12">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h3 className="text-2xl font-bold text-[#FF5000] mb-3">Packing Services – Professional & Customizable</h3>
              <p className="text-gray-700 mb-4">Your belongings deserve expert care. Our trained movers in Nairobi Kenya use top-grade packing materials and proven techniques to protect every item.</p>
              <h4 className="text-xl font-semibold mb-2">We Offer:</h4>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                <li><span className="font-medium">Full-Service Packing</span> – We pack everything in your home or office</li>
                <li><span className="font-medium">Partial Packing</span> – You pack some, we handle the rest</li>
                <li><span className="font-medium">Custom Crating</span> – For fragile, valuable, or awkwardly shaped items</li>
              </ul>
              <p className="text-gray-700">Our packing services are ideal for local moves, international relocations, and office moves in Kenya.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Crating */}
      <div className="container my-16">
        <div className="row">
          <div className="col-md-12">
            <h3 className="text-2xl font-bold text-[#FF5000] mb-6">Custom Crating – Built for Protection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold mb-2">Crating for Local Moves</h4>
                <p className="text-gray-700 mb-3">Our in-house carpentry team builds sturdy, custom wooden crates for:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Mirrors</li>
                  <li>Sculptures</li>
                  <li>Fine art</li>
                  <li>Electronics and oversized items</li>
                </ul>
                <p className="text-gray-700 mt-3">Perfect for navigating Kenya’s roads safely.</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Crating for International Moves</h4>
                <p className="text-gray-700 mb-3">Through our certified export partners, we provide ISPM 15-compliant crating that meets international shipping and customs standards, designed for:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Sea freight</li>
                  <li>Air cargo</li>
                  <li>Long-distance relocation security</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minor Electrical & Plumbing */}
      <div className="bg-gray-50 py-12">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h3 className="text-2xl font-bold text-[#FF5000] mb-3">Minor Electrical & Plumbing Services</h3>
              <p className="text-gray-700 mb-4">To ease your move-in process, our trusted electricians and plumbers are available to help with:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Electrical</h4>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Disconnecting/Reconnecting appliances</li>
                    <li>Mounting/dismounting TVs, lights, and fixtures</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Plumbing</h4>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Connecting washing machines, dishwashers, and sinks</li>
                    <li>Ensuring leak-free and secure installations</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-700 mt-4">These services are available for home and office moves across Nairobi and across Kenya.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Move-In/Out Cleaning */}
      <div className="container my-16">
        <div className="row">
          <div className="col-md-12">
            <h3 className="text-2xl font-bold text-[#FF5000] mb-3">Move-In/Out Cleaning Services</h3>
            <p className="text-gray-700 mb-4">We’ve partnered with professional cleaners to handle:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>End-of-lease deep cleaning</li>
              <li>Pre-move cleanups</li>
              <li>New-home preparation</li>
            </ul>
            <p className="text-gray-700 mt-4">Enjoy peace of mind with a spotless start or a clean departure.</p>
          </div>
        </div>
      </div>

      {/* Office Demolitions & Space Prep */}
      <div className="bg-gray-50 py-12">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h3 className="text-2xl font-bold text-[#FF5000] mb-3">Office Demolitions & Space Prep</h3>
              <p className="text-gray-700 mb-4">Our commercial clients benefit from specialized office demolition services, including:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Cubicle and workstation disassembly</li>
                <li>Removal of shelving and non-structural partitions</li>
                <li>Floor clearance for renovations</li>
              </ul>
              <p className="text-gray-700 mt-4">Handled by experienced demolition partners who understand commercial regulations and safety.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Program */}
      <div className="container my-16">
        <div className="row">
          <div className="col-md-12">
            <h3 className="text-2xl font-bold text-[#FF5000] mb-3">Beyond Relocation – Our Partner Program</h3>
            <p className="text-gray-700 mb-4">Moving involves more than just packing boxes. That’s why we’ve developed a Partner Program—a curated network of reliable service providers who support you before, during, and after the move.</p>
            <h4 className="text-xl font-semibold mb-4">Our Extended Services Include:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 border rounded-lg">
                <h5 className="font-semibold mb-2">Fumigation Services</h5>
                <p className="text-gray-700">Protect your family or team from pests. We connect you with licensed fumigation experts for residential and commercial pest control solutions.</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h5 className="font-semibold mb-2">Interior Design Consulting</h5>
                <p className="text-gray-700">Transform your new space with help from our interior design partners. From furniture layout to color palettes and sourcing, they help create a home or office that suits your style and function.</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h5 className="font-semibold mb-2">Temporary Work Agencies</h5>
                <p className="text-gray-700">Need short-term staffing after a business relocation? Our partners provide qualified personnel for logistics, admin, and operations during transitional periods.</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h5 className="font-semibold mb-2">CCTV Installation Services</h5>
                <p className="text-gray-700">Secure your new premises on day one. Through trusted security firms, we offer professional CCTV installations for homes and offices.</p>
              </div>
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