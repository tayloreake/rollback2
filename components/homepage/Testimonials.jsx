import Image from 'next/image'
import React from 'react'

const Testimonials = () => {
  return (
    <div className='w-full relative'>
        <Image src='/assets/Testimonials/test.png' alt='Truck passing by' width={1920} height={1080} className='w-full h-[700px] object-cover' />
        <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-[#DB421B]/60'>
            <p className='text-white text-xl font-bold text-center'>
            The Premier Moving Company
            </p>
            <p className='text-center text-white max-w-[700px] mt-4'>
                Our key focus and goal is to understand our clients experience from their point of view. We see this as our central focus that drives every aspect of how we conduct our business and relate to our customers. We guarantee professional moving services in Kenya. Whether moving within Nairobi or around the globe, Taylor movers Kenya will have a custom tailored moving solution for you.
            </p>
        </div>
    </div>
  )
}

export default Testimonials