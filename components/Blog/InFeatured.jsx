import Image from "next/image"
import React from "react"

const InFeatured = ({ title, image }) => {
  return (
    <div className='w-full text-center relative flex items-center justify-center'>
      <div className='py-8 w-full max-w-[350px] md:max-w-[924px] h-full max-h-[202px] mx-auto p-2 flex flex-row justify-center items-center absolute z-10'>
        <div className='flex flex-col text-black'>
          <p className='text-lg'>{title}</p>
          <div></div>
        </div>
      </div>
      <div className='w-full object-cover items-center  h-full min-h-[500px] bg-gradient-to-t from-white to-white/40 absolute' />
      <Image
        src={image}
        width={500}
        height={500}
        alt='Taylor Movers'
        className='w-full object-cover items-center min-h-[500px] max-h-[500px]'
      />
    </div>
  )
}

export default InFeatured
