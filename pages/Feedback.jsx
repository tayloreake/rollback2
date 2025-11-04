import React from "react"
import Head from "next/head"
import FeedbackForm from "../components/Contacts/FeedbackForm"
import Jumbotron from "../components/jumbotron"
import getPageMetadata from "../SEO/seo"

const Feedback = () => {
  // Get SEO metadata
  const seoData = getPageMetadata("feedback", {
    customTitle: 'Customer Feedback - Taylor Movers Kenya | Share Your Experience',
    customDescription: 'Share your moving experience with Taylor Movers Kenya. Your feedback helps us improve our services and assist future customers.',
    includeLocalBusiness: false,
    includeService: false
  })

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonical} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:type" content={seoData.openGraph.type} />
        <meta property="og:url" content={seoData.openGraph.url} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={seoData.twitter.card} />
        <meta name="twitter:title" content={seoData.twitter.title} />
        <meta name="twitter:description" content={seoData.twitter.description} />
      </Head>

      {/* Spacer for fixed navbar */}
      <div className="h-[100px] md:h-[80px]"></div>

      <Jumbotron 
        image={"taylor-movers-kenya-packing-boxes.png"} 
        text={"Customer Feedback - Tell Us About Your Experience"} 
        alt={"Customer feedback for Taylor Movers Kenya - Share your moving experience"} 
      />

      <div className='container pt-12 pb-12'>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FF5000] mb-4">
            We Value Your Feedback
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your experience matters to us. Please take a few minutes to share your thoughts 
            about our moving services. Your feedback helps us improve and serve you better.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl py-8 px-6">
            <FeedbackForm />
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-[#FF5000] to-[#FF8A50] rounded-2xl py-8 px-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Thank You for Choosing Taylor Movers!</h2>
            <p className="text-lg mb-6">
              Your feedback is invaluable in helping us maintain our high standards of service.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a 
                href="/Contacts" 
                className="px-6 py-3 bg-white text-[#FF5000] font-bold rounded-full hover:shadow-2xl transition-all"
              >
                Contact Us
              </a>
              <a 
                href="/Quote" 
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-[#FF5000] transition-all"
              >
                Get a Quote
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default React.memo(Feedback)