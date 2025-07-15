import Image from "next/image"
import React, { useState, useEffect, useRef } from "react"
import Featured from "../components/Contacts/Featured"
import Testimonials from "../components/homepage/Testimonials"
import { toast } from "react-toastify"
import PageTitle from "../components/PageTitle"
import Jumbotron from "../components/jumbotron"
import ReCAPTCHA from "react-google-recaptcha"
import ContactAddress from "../components/Contacts/ContactAddress"
import ContactForm from "../components/Contacts/ContactForm"

const Contacts = () => {


  return (
    <>
      <Jumbotron image={"taylor-movers-kenya-packing-boxes.png"} text={"We would love to hear from you"} alt={"Stack of sturdy, professional moving boxes used by Taylor Movers Kenya for secure packing."} />

      <div className='container pt-6'>
        <p className="text-xl py-4 !pt-8">
          We are here to answer any questions you may have about Taylor Movers and the services we offer. Reach out to us by filling the below form and we will respond as soon as we can.
        </p>
      </div>

      <div className="container">
        <div className="row bg-[#EDEDED] py-4 my-4">
          <div className="col-md-6">
            <div className="">
              <p className="my-3">
                Feel free to contact us and we will get Back to you as soon as we can.
              </p>
              <ContactForm />
            </div>
          </div>

          <div className="col-md-6">
            <ContactAddress />
          </div>
        </div>
      </div>
    </>
  )
}

export default Contacts
