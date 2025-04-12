import { Modal } from "antd"
import Image from "next/image"
import React, { useState, useRef } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import ReviewsForm from "./reviews-form"

const Reviews = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const showModal = () => {
    setIsModalOpen(true);
  }
  

  return (
    <div className='h-[50vh] flex items-center justify-center '>
      <div className=' h-full  w-full bg-[#DB421B] md:max-w-[100%]   flex items-center md:px-40 relative px-6'>
        <div className=''>
          <div className='flex flex-col space-y-4 z-50 '>
            <h3 className='text-3xl text-white font-bold '>Leave a Review</h3>
            <p className='font-medium text-white'>
              We would love to hear about your moving experience! Please take a
              moment to share your thoughts.
            </p>
            <button
              onClick={showModal}
              className='border-2 border-white text-white hover:opacity-70 hover:text-[#DB421B] text-xs rounded-full py-2 px-4 w-fit mt-4 transition-all duration-300'>
              Tell us what you think !
            </button>
          </div>

          <Image
            className='absolute bottom-0 left-[30%] z-1'
            src='/assets/Reviews/pattern.svg'
            width={120}
            height={120}
            alt='pattern'
          />
          <Image
            className='absolute top-0 right-[2%] rotate-180 z-1'
            src='/assets/Reviews/pattern.svg'
            width={120}
            height={120}
            alt='pattern'
          />
        </div>
      </div>
      <Modal
        title={null}
        open={isModalOpen}
        footer={null}
        width={500}>

        <ReviewsForm setIsModalOpen={setIsModalOpen} />

      </Modal>
    </div>
  )
}

export default Reviews
