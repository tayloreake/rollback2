import React, { useState, useEffect, useMemo } from "react"
import Head from 'next/head'
import getPageMetadata from "../SEO/seo"
import Jumbotron from "../components/jumbotron"
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa"

const FAQ = () => {
  const [openQuestions, setOpenQuestions] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredFAQs, setFilteredFAQs] = useState([])

  // Get SEO metadata
  const seoData = getPageMetadata("faq", {
    location: 'Nairobi',
    customTitle: 'Frequently Asked Questions - Taylor Movers Kenya | Moving FAQs',
    customDescription: 'Find answers to common questions about Taylor Movers Kenya services. Learn about our moving process, pricing, insurance, and international relocation services in Nairobi.',
    includeLocalBusiness: true,
    includeService: false
  })

  const faqData = useMemo(() => [
    {
      id: 1,
      question: "Is your company registered and licensed to operate in Kenya?",
      answer: "Yes, our moving company in Kenya is fully registered and licensed to provide professional moving services in Nairobi and across the country."
    },
    {
      id: 2,
      question: "How long has your company been in business?",
      answer: "Taylor Movers Nairobi has been one of the leading moving companies in Nairobi Kenya since 2008. We have successfully executed over 40,000 residential and office relocations, including international moves to over 40 global destinations."
    },
    {
      id: 3,
      question: "Are your staff permanent employees, and are they trained?",
      answer: "Yes, all our movers in Nairobi Kenya are permanent employees. Each staff member undergoes thorough training in packing, loading, safe lifting, professional customer service, and secure handling of personal belongings."
    },
    {
      id: 4,
      question: "Do you have insurance coverage for my belongings during the move?",
      answer: "Yes, our Nairobi movers provide comprehensive transit insurance coverage. We offer different levels of protection depending on your moving needs. Our liability covers loss or damage during transportation, ensuring peace of mind throughout your move."
    },
    {
      id: 5,
      question: "Are you part of any recognized moving associations?",
      answer: "Yes, we are proud members of the International Association of Movers (IAM), aligning us with trusted moving companies in Kenya and globally."
    },
    {
      id: 6,
      question: "What measures do you have in place for security and risk management during transit?",
      answer: "Our moving services in Nairobi include fully lockable and enclosed trucks. We perform background checks during staff recruitment and conduct regular performance reviews and training for all Kenya movers on professional standards and safety."
    },
    {
      id: 7,
      question: "What services do you offer?",
      answer: `As one of the top moving companies in Nairobi, we offer:
        • Packing and unpacking
        • Loading and transportation
        • Furniture assembly/disassembly
        • Cleaning services
        • Storage and warehousing
        • Specialized moving for items like pianos, artworks, and antiques
        • Pet and plant relocation`
    },
    {
      id: 8,
      question: "Can I pack my own items, or do you require professional packing?",
      answer: "Yes, you can pack your own items. However, we recommend letting our trained Nairobi movers handle the packing for greater safety, efficiency, and a more seamless moving experience."
    },
    {
      id: 9,
      question: "How do you protect fragile or high-value items?",
      answer: "As experienced movers in Nairobi Kenya, we protect your valuables using premium packing materials, individualized wrapping, and \"FRAGILE\" labeling. Our trained team handles items like electronics, pianos, antiques, and artwork with precision loading and safety protocols."
    },
    {
      id: 10,
      question: "How do you determine the cost of a move?",
      answer: `Our moving company in Nairobi calculates moving costs based on:
        • Volume or weight of goods
        • Distance between origin and destination
        • Required services (e.g. packing, storage)
        • Accessibility
        • Time of year
        
        We offer free, no-obligation site surveys to ensure accurate pricing.`
    },
    {
      id: 11,
      question: "What payment methods do you accept?",
      answer: "We accept MPESA, RTGS, and bank transfers. A 50% deposit is required to confirm your move. The remaining balance is payable upon completion."
    },
    {
      id: 12,
      question: "How much notice do I need to give to book your services?",
      answer: "We recommend booking as early as possible, but we also accommodate last-minute requests. Contact our Nairobi moving company directly to check availability."
    },
    {
      id: 13,
      question: "How long will the move take?",
      answer: `The duration depends on the type and distance of the move:
        • Local moves in Nairobi: 4–8 hours (same-day service)
        • Long-distance moves in Kenya: 1–3 days
        • International moves: 2–8 weeks depending on location and shipping method`
    },
    {
      id: 14,
      question: "Do you offer real-time tracking during the move?",
      answer: "Yes, we provide real-time tracking and updates for all local and international moves handled by our Nairobi movers."
    },
    {
      id: 15,
      question: "What if my new home isn't ready on moving day?",
      answer: "No problem. Our moving services in Nairobi include secure, short-term and long-term storage and warehousing options."
    },
    {
      id: 16,
      question: "Do you offer pet or plant relocation services?",
      answer: "Yes, our Kenya movers provide specialized relocation services for pets and plants to ensure their safe and comfortable transport."
    },
    {
      id: 17,
      question: "Does Taylor Movers offer inter-county moves within Kenya?",
      answer: "Yes, absolutely. Taylor Movers is a leading expert in providing professional and reliable inter-county moving services. Whether you are moving from Nairobi to Mombasa, Kisumu, Eldoret, or any other county in Kenya."
    },
    {
      id: 18,
      question: "How does Taylor Movers calculate the cost for an inter-county move within Kenya?",
      answer: "For moves within Kenya, our cost is primarily calculated based on a combination of factors, including the volume/weight of your shipment and the distance of the move. We offer a free, no-obligation quote."
    },
    {
      id: 19,
      question: "What services does Taylor Movers provide for cross-border moves within the East African Community (EAC)?",
      answer: `Taylor Movers specializes in comprehensive cross-border moving services. We offer a "full-service" solution which includes:
        • Professional packing and loading
        • Customs clearance guidance and handling of necessary documentation
        • Secure transportation across the border
        • Unloading and unpacking at your destination
        • Real-time communication with your move captain and consultant`
    },
    {
      id: 20,
      question: "Do you handle the customs and documentation process for me?",
      answer: "Absolutely. Our team is well-versed in the East Africa Customs Management Act. We will guide you through the entire documentation process, advise on any payable taxes or levies, and ensure all paperwork is in order for a smooth border crossing."
    },
    {
      id: 21,
      question: "What is the typical transit time for international shipments (air vs. sea)?",
      answer: `The transit time for your international shipment depends on the mode of transport and the destination.

Air Freight: This is the fastest and most popular choice for urgent or time-sensitive shipments, like essential belongings. Air cargo transit typically takes 4 to 10 days from port to port, offering unmatched speed.

Sea Freight: This is the most cost-effective option for a full household move. Ocean freight is a much longer process, with typical transit times ranging from 20 to 45 days depending on the route. While slower, it's ideal for large volumes of items and is the most economical solution for a comprehensive relocation.`
    },
    {
      id: 22,
      question: "Are you familiar with customs clearance procedures and documentation requirements for my destination country?",
      answer: "Yes, absolutely. As a leading international moving company based in Kenya, we specialize in navigating complex customs clearance procedures. We are experts in handling all international customs regulations and import documentation for countries worldwide. Our experienced team works with international movers Kenya to ensure your belongings clear customs smoothly. Your personal moving consultant will guide you through preparing essential paperwork."
    },
    {
      id: 23,
      question: "Do you have a network of partners or agents in the destination country to assist with the move?",
      answer: `Yes. As one of the most reliable international moving companies in Nairobi, Taylor Movers is a member of an extensive global network of trusted logistics partners and destination agents. This is a cornerstone of our door-to-door moving service. Our partners are carefully vetted and are experts in their local markets, providing crucial on-the-ground support including:

        • Destination services like customs brokerage and local freight forwarding
        • Arranging transportation from the port or airport to your new home
        • Offering professional unpacking and reassembly services for your furniture and belongings
        
        Our network ensures that your entire move is a seamless, coordinated effort, giving you peace of mind that you've chosen the right international moving company. Our local presence in Nairobi combined with our global reach means we are your local and international moving solution.`
    }
  ], [])

  const toggleQuestion = (questionId) => {
    setOpenQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  // Filter FAQs based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFAQs(faqData)
    } else {
      const filtered = faqData.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredFAQs(filtered)
    }
  }, [searchTerm, faqData])

  // Initialize filtered FAQs
  useEffect(() => {
    setFilteredFAQs(faqData)
  }, [faqData])

  return (
    <div className='w-full h-full'>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:type" content={seoData.openGraph.type} />
      </Head>

      <Jumbotron 
        image={'taylor-movers-kenya-professional-team.png'} 
        title="Frequently Asked Questions"
        subtitle="Get instant answers to all your moving questions. We're here to help make your relocation smooth and stress-free."
        alt={"Frequently Asked Questions about Taylor Movers Kenya moving services"} 
      />

      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FF5000] to-[#FF8A50] rounded-full mb-6 shadow-lg">
              <span className="text-3xl">❓</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Find answers to the most common questions about our moving services in Kenya. 
              If you don't find what you're looking for, feel free to contact us directly.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] text-lg transition-all duration-300 hover:border-gray-300"
              placeholder="Search frequently asked questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                ×
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Found <span className="font-semibold text-[#FF5000]">{filteredFAQs.length}</span> result{filteredFAQs.length !== 1 ? 's' : ''} for "<span className="font-semibold">{searchTerm}</span>"
              </p>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-6">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Results Found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search terms or browse all questions below.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-gradient-to-r from-[#FF5000] to-[#FF8A50] text-white px-6 py-3 rounded-2xl font-semibold hover:from-[#FF8A50] hover:to-[#FFB380] transition-all duration-300 transform hover:scale-105"
                >
                  View All Questions
                </button>
              </div>
            ) : (
              filteredFAQs.map((faq, index) => (
              <div key={faq.id} className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <button
                  className="w-full px-8 py-6 text-left flex items-start justify-between focus:outline-none focus:ring-2 focus:ring-[#FF5000] focus:ring-opacity-50 rounded-2xl group hover:bg-gradient-to-r hover:from-[#FF5000]/5 hover:to-[#FF8A50]/5 transition-all duration-300"
                  onClick={() => toggleQuestion(faq.id)}
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#FF5000] to-[#FF8A50] rounded-full flex items-center justify-center text-white font-bold text-sm mt-1">
                      {faq.id}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 pr-4 group-hover:text-[#FF5000] transition-colors duration-300 leading-relaxed">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div className={`w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#FF5000] flex items-center justify-center transition-all duration-300 ${openQuestions[faq.id] ? 'rotate-180 bg-[#FF5000]' : ''}`}>
                      <FaChevronDown className={`text-lg transition-colors duration-300 ${openQuestions[faq.id] || 'group-hover:text-white'} ${openQuestions[faq.id] ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                  </div>
                </button>
                
                {openQuestions[faq.id] && (
                  <div className="px-8 pb-8 border-t border-gray-100 animate-fade-in-down">
                    <div className="pt-6 pl-12">
                      <div className="bg-gradient-to-r from-[#FF5000]/5 to-[#FF8A50]/5 rounded-xl p-6 border-l-4 border-[#FF5000]">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-br from-[#FF5000] via-[#FF6B35] to-[#FF8A50] rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-[22px] p-12 text-center">
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FF5000] to-[#FF8A50] rounded-full mb-6 shadow-lg">
                  <span className="text-2xl">💬</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                  Still Have Questions?
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Our team is here to help. Contact us for personalized assistance with your moving needs.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <a 
                    href="tel:0721410517" 
                    className="group bg-gradient-to-br from-[#FF5000] to-[#FF8A50] hover:from-[#FF8A50] hover:to-[#FFB380] text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex flex-col items-center space-y-2"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">📞</span>
                    <span className="text-sm opacity-90">Call us now</span>
                    <span className="font-bold">0721 410 517</span>
                  </a>
                  <a 
                    href="mailto:info@taylorea.com" 
                    className="group bg-white border-2 border-[#FF5000] text-[#FF5000] hover:bg-[#FF5000] hover:text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex flex-col items-center space-y-2"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">✉️</span>
                    <span className="text-sm opacity-75 group-hover:opacity-90">Send email</span>
                    <span className="font-bold text-sm">info@taylorea.com</span>
                  </a>
                  <a 
                    href="https://wa.me/254721410517" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex flex-col items-center space-y-2"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">💬</span>
                    <span className="text-sm opacity-90">WhatsApp us</span>
                    <span className="font-bold">Chat Now</span>
                  </a>
                </div>
                
                {/* Quick Stats */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                      <div className="text-2xl md:text-3xl font-bold text-[#FF5000] mb-1">24/7</div>
                      <div className="text-sm text-gray-600">Support Available</div>
                    </div>
                    <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                      <div className="text-2xl md:text-3xl font-bold text-[#FF5000] mb-1">&lt; 2hr</div>
                      <div className="text-sm text-gray-600">Response Time</div>
                    </div>
                    <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                      <div className="text-2xl md:text-3xl font-bold text-[#FF5000] mb-1">FREE</div>
                      <div className="text-sm text-gray-600">Consultation</div>
                    </div>
                    <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                      <div className="text-2xl md:text-3xl font-bold text-[#FF5000] mb-1">17+</div>
                      <div className="text-sm text-gray-600">Years Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ