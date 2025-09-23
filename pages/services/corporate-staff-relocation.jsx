import React from 'react'
import Image from 'next/image'
import getPageMetadata from '../../SEO/seo'
import Head from 'next/head'
import Jumbotron from '../../components/jumbotron'
import QuoteModal from '../../components/Quote/QuoteModal'
import NewsletterSection from '../../components/NewsletterSection'
import { 
  BsCheckCircle, 
  BsShield, 
  BsClock, 
  BsGear,
  BsTruck,
  BsBoxSeam,
  BsClipboardCheck,
  BsTools,
  BsStar,
  BsPeople,
  BsGlobe,
  BsBuilding
} from 'react-icons/bs'
import { 
  FaUsers, 
  FaClipboardList,
  FaBoxOpen,
  FaHome,
  FaGraduationCap,
  FaUserTie,
  FaChartLine,
  FaFileContract,
  FaHeart
} from 'react-icons/fa'
import { MdBusiness, MdSupport, MdSpeed } from 'react-icons/md'

const CorporateStaffRelocation = () => {
  const whyChooseUs = [
    {
      icon: <BsGear className="text-[#FF5000] text-4xl" />,
      title: "Innovative",
      description: "We use modern logistics systems, digital inventory tracking, and specialized relocation software to simplify the moving process. Our approach ensures smooth coordination between HR teams, relocating employees, and our moving crew — making transitions seamless."
    },
    {
      icon: <MdSpeed className="text-[#FF5000] text-4xl" />,
      title: "Efficient", 
      description: "Corporate moves are time-sensitive. We carefully plan each relocation to minimize disruption to work schedules. From fast packing and safe transport to quick setup in the new home, we ensure staff are settled and ready to resume work without delay."
    },
    {
      icon: <MdSupport className="text-[#FF5000] text-4xl" />,
      title: "Comprehensive Support",
      description: "Relocation goes beyond moving boxes. Through our trusted network of partners, we assist employees and their families with house hunting, school placement, and domestic staff recruitment, helping them settle into their new environment quickly and comfortably."
    }
  ]

  const preparationSteps = [
    {
      step: "1",
      title: "HR & Employee Briefing",
      description: "We coordinate with company HR and the relocating staff to understand requirements, timelines, and special needs.",
      icon: <FaUsers className="text-[#FF5000] text-2xl" />
    },
    {
      step: "2", 
      title: "Needs Assessment & Survey",
      description: "A consultant evaluates belongings, housing logistics, and destination details for an accurate quote.",
      icon: <BsClipboardCheck className="text-[#FF5000] text-2xl" />
    },
    {
      step: "3",
      title: "Relocation Plan",
      description: "A detailed moving plan and timeline are shared, including housing arrangements, packing preferences, and travel coordination.",
      icon: <FaClipboardList className="text-[#FF5000] text-2xl" />
    },
    {
      step: "4",
      title: "Documentation Support",
      description: "Assistance with permits, customs, or international paperwork if required.",
      icon: <FaFileContract className="text-[#FF5000] text-2xl" />
    },
    {
      step: "5",
      title: "Final Move Confirmation",
      description: "All details are reviewed with both employer and employee prior to the move.",
      icon: <BsCheckCircle className="text-[#FF5000] text-2xl" />
    }
  ]

  const movingDaySteps = [
    {
      step: "1",
      title: "Pre-Move Briefing",
      description: "Our team leader walks the employee through the day's schedule.",
      icon: <FaClipboardList className="text-[#FF5000] text-2xl" />
    },
    {
      step: "2",
      title: "Packing & Protection", 
      description: "Professional packing of household goods, office equipment, and personal effects. Fragile items receive specialized handling.",
      icon: <BsBoxSeam className="text-[#FF5000] text-2xl" />
    },
    {
      step: "3",
      title: "Furniture Disassembly & Secure Handling",
      description: "Large items are safely disassembled and prepared for transport.",
      icon: <BsTools className="text-[#FF5000] text-2xl" />
    },
    {
      step: "4",
      title: "Loading, Transportation & Delivery",
      description: "Items are tracked digitally and delivered safely, whether within Nairobi, across Kenya, or internationally.",
      icon: <BsTruck className="text-[#FF5000] text-2xl" />
    },
    {
      step: "5",
      title: "Reassembly & Setup",
      description: "Furniture is reassembled, and belongings placed according to the employee's preference.",
      icon: <BsGear className="text-[#FF5000] text-2xl" />
    },
    {
      step: "6",
      title: "Optional Unpacking",
      description: "Full unpacking and organization available upon request.",
      icon: <FaBoxOpen className="text-[#FF5000] text-2xl" />
    },
    {
      step: "7",
      title: "Debris Removal & Final Walk-Through",
      description: "Packing waste cleared; final inspection ensures satisfaction.",
      icon: <BsCheckCircle className="text-[#FF5000] text-2xl" />
    }
  ]

  const postMoveSteps = [
    {
      step: "1",
      title: "Follow-Up Services",
      description: "Assistance with settling-in needs such as storage solutions, additional deliveries, or guidance in the new location.",
      icon: <MdSupport className="text-[#FF5000] text-2xl" />
    },
    {
      step: "2",
      title: "Employer Reporting",
      description: "Updates provided to HR or management to confirm a successful relocation.",
      icon: <FaChartLine className="text-[#FF5000] text-2xl" />
    }
  ]

  const serviceFeatures = [
    "Employee & family relocation",
    "HR team coordination", 
    "International relocations",
    "Housing assistance",
    "School placement support",
    "Domestic staff recruitment",
    "Temporary accommodation",
    "Digital inventory tracking",
    "Custom relocation plans",
    "24/7 support hotline"
  ]

  const relocationTypes = [
    {
      icon: <BsBuilding className="text-[#FF5000] text-3xl" />,
      title: "Domestic Transfers",
      description: "Staff relocations within Nairobi or across Kenyan cities"
    },
    {
      icon: <BsGlobe className="text-[#FF5000] text-3xl" />,
      title: "International Assignments",
      description: "Global relocations with visa and customs support"
    },
    {
      icon: <FaUsers className="text-[#FF5000] text-3xl" />,
      title: "Executive Moves",
      description: "Premium relocations for senior management"
    },
    {
      icon: <FaHeart className="text-[#FF5000] text-3xl" />,
      title: "Family Relocations",
      description: "Complete support for employees with families"
    }
  ]

  const supportServices = [
    {
      icon: <FaHome className="text-[#FF5000] text-3xl" />,
      title: "Housing Solutions",
      description: "House hunting, lease negotiations, and temporary accommodation arrangements"
    },
    {
      icon: <FaGraduationCap className="text-[#FF5000] text-3xl" />,
      title: "School Placement",
      description: "Research and enrollment assistance for international and local schools"
    },
    {
      icon: <FaUserTie className="text-[#FF5000] text-3xl" />,
      title: "Domestic Staff",
      description: "Recruitment of housekeepers, drivers, and childcare providers"
    }
  ]

  // Get SEO metadata
  const seoData = getPageMetadata("corporate-staff-relocation", {
    location: 'Nairobi',
    service: 'corporate-staff-relocation',
    customTitle: 'Corporate Staff Relocation Services Kenya | Employee Moving | Taylor Movers',
    customDescription: 'Professional corporate staff relocation services in Kenya & internationally. ✓ Employee moves ✓ HR coordination ✓ Housing support ✓ Family relocations. Call +254 721 410 517!',
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
        image="corporate-staff-relocation-kenya.png" 
        text="Corporate Staff Relocation Services" 
        alt="Taylor Movers Kenya professional corporate staff relocation services"
      />

      {/* Hero Section */}
      <div className="container my-16">
        <div className="row items-center">
          <div className="col-md-6">
            <h1 className="text-4xl font-bold text-[#FF5000] mb-4">
              Seamless Employee Moves in Kenya and Beyond
            </h1>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At Taylor Movers Kenya, we specialize in professional, stress-free staff relocation services 
              designed to support both employers and employees. Whether you're transferring staff within Nairobi, 
              across Kenya, or to international destinations, our experienced team ensures every move is smooth, 
              efficient, and tailored to organizational needs.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              From packing and transport to housing setup and post-move support, we help companies minimize 
              downtime while keeping employees comfortable and settled.
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <MdBusiness className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">Corporate HR coordination</span>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <BsGlobe className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">Domestic & international relocations</span>
            </div>
            <div className="flex items-center space-x-4 mb-8">
              <BsCheckCircle className="text-[#FF5000] text-2xl" />
              <span className="text-gray-700 font-medium">Digital tracking & reporting</span>
            </div>
            <QuoteModal quotebtn="orange" />
          </div>
          <div className="col-md-6">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#FF5000] to-[#FF8A50] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <Image
                  src="/assets/services/servicepage photos/Office Moves 2.webp"
                  alt="Taylor Movers Kenya corporate staff relocation professionals"
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
              Why Choose Taylor Movers for Corporate Relocation?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional expertise that keeps your business running while your employees transition smoothly
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

      {/* Relocation Types We Serve */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#FF5000] mb-4">
            Corporate Relocation Types
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive relocation solutions for every type of corporate move
          </p>
        </div>
        <div className="row">
          {relocationTypes.map((type, index) => (
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
              Complete Corporate Relocation Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every aspect of corporate staff relocation handled with professional precision
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

      {/* Support Services */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#FF5000] mb-4">
            Beyond Moving - Complete Settling Support
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive services to help employees and families settle quickly
          </p>
        </div>
        <div className="row">
          {supportServices.map((service, index) => (
            <div key={index} className="col-lg-4 mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 h-full">
                <div className="text-center mb-6">{service.icon}</div>
                <h3 className="font-bold text-2xl mb-4 text-center text-gray-800">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed text-center">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Corporate Relocation Process Section */}
      <div className="bg-gradient-to-r from-[#FF5000] to-[#FF8A50] py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Corporate Relocation Process
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              A systematic approach ensuring seamless transitions for both employees and employers
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
          <div className="mb-20">
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

          {/* Post-Move Support */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-12 text-center">
              3. Post-Move Support
            </h3>
            <div className="row justify-content-center">
              {postMoveSteps.map((step, index) => (
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

      {/* Company Benefits */}
      <div className="container py-16">
        <div className="bg-gradient-to-r from-[#FF5000] to-[#FF8A50] rounded-3xl p-12 text-center text-white">
          <div className="mb-6">
            <MdBusiness className="text-6xl mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">Trusted by Leading Companies</h3>
            <p className="text-xl opacity-90">Professional staff relocations that support business growth</p>
          </div>
          <p className="text-lg max-w-3xl mx-auto">
            With Taylor Movers Kenya, corporate staff relocations are managed with precision, care, and professionalism. 
            We help businesses retain productivity and give employees confidence that their transition will be smooth — 
            locally, regionally, or internationally.
          </p>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection 
        title="Ready for Corporate Staff Relocation?"
        subtitle="Let our corporate relocation experts handle your employee moves with precision and care. Subscribe for corporate moving tips and special rates."
      />
    </div>
  )
}

export default CorporateStaffRelocation