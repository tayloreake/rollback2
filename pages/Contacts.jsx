import Image from "next/image"
import React, { useState, useEffect, useRef } from "react"
import Head from "next/head"
import Featured from "../components/Contacts/Featured"
import Testimonials from "../components/homepage/Testimonials"
import { toast } from "react-toastify"
import PageTitle from "../components/PageTitle"
import Jumbotron from "../components/jumbotron"
import ReCAPTCHA from "react-google-recaptcha"
import ContactAddress from "../components/Contacts/ContactAddress"
import ContactForm from "../components/Contacts/ContactForm"
import getPageMetadata from "../SEO/seo"
import { BsEnvelope, BsPhone, BsWhatsapp, BsClock } from "react-icons/bs"
import { FaMapMarkerAlt } from "react-icons/fa"

const Contacts = () => {
  // Get SEO metadata
  const seoData = getPageMetadata("contact", {
    location: 'Nairobi',
    customTitle: 'Contact Taylor Movers Kenya | Get a Free Moving Quote Today',
    customDescription: 'Contact Taylor Movers Kenya for professional moving services. Get a free quote, ask questions, or schedule your move. Call +254 721 410 517 or fill out our contact form.',
    includeLocalBusiness: true,
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
        text={"Contact Us - We'd Love to Hear From You"} 
        alt={"Contact Taylor Movers Kenya - Professional moving services team ready to assist you"} 
      />

      <div className='container pt-12'>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FF5000] mb-4">
            Get in Touch with Taylor Movers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are here to answer any questions you may have about our moving services. 
            Reach out to us and we will respond as soon as possible.
          </p>
        </div>

        {/* Quick Contact Info Cards */}
        <div className="row mb-12">
          <div className="col-md-3 col-6 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              <BsPhone className="text-[#FF5000] text-3xl mx-auto mb-3" />
              <h3 className="font-bold text-sm mb-2">Call Us</h3>
              <a href="tel:+254721410517" className="text-[#FF5000] hover:underline text-sm">
                +254 721 410 517
              </a>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              <BsWhatsapp className="text-[#FF5000] text-3xl mx-auto mb-3" />
              <h3 className="font-bold text-sm mb-2">WhatsApp</h3>
              <a href="https://wa.me/254721410517" target="_blank" className="text-[#FF5000] hover:underline text-sm">
                Chat with us
              </a>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              <BsEnvelope className="text-[#FF5000] text-3xl mx-auto mb-3" />
              <h3 className="font-bold text-sm mb-2">Email Us</h3>
              <a href="mailto:info@taylorea.com" className="text-[#FF5000] hover:underline text-sm">
                info@taylorea.com
              </a>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              <BsClock className="text-[#FF5000] text-3xl mx-auto mb-3" />
              <h3 className="font-bold text-sm mb-2">Working Hours</h3>
              <p className="text-gray-600 text-sm">Mon-Sat: 8AM-6PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mb-12">
        <div className="row bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl py-8 px-4">
          <div className="col-md-6 mb-8 md:mb-0">
            <div className="pr-0 md:pr-8">
              <h2 className="text-3xl font-bold text-[#FF5000] mb-4">
                Send Us a Message
              </h2>
              <p className="text-gray-600 mb-6">
                Fill out the form below and our team will get back to you within 24 hours. 
                Whether you need a quote, have questions, or want to schedule a move, we're here to help.
              </p>
              <ContactForm />
            </div>
          </div>

          <div className="col-md-6">
            <div className="pl-0 md:pl-8">
              <h2 className="text-3xl font-bold text-[#FF5000] mb-4">
                Visit Our Offices
              </h2>
              <ContactAddress />
            </div>
          </div>
        </div>
      </div>



      {/* Map or Additional Info Section */}
      <div className="bg-gradient-to-r from-[#FF5000] to-[#FF8A50] py-12">
        <div className="container">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Move?</h2>
            <p className="text-xl mb-6">Get your free, no-obligation quote today!</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a 
                href="tel:+254721410517" 
                className="px-8 py-4 bg-white text-[#FF5000] font-bold rounded-full hover:shadow-2xl transition-all"
              >
                Call Now: +254 721 410 517
              </a>
              <a 
                href="https://wa.me/254721410517" 
                target="_blank"
                className="px-8 py-4 bg-green-500 text-white font-bold rounded-full hover:shadow-2xl transition-all"
              >
                WhatsApp Us
              </a>
              <a 
                href="/Feedback" 
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-[#FF5000] transition-all"
              >
                Share Feedback
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contacts
