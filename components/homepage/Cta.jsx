import Image from "next/image"
import React from "react"

const Cta = ({ content }) => {
  return (
    <div className='w-full relative'>
      <Image
        src='/assets/home/cta/c1.png'
        alt='Truck passing by'
        width={1920}
        height={1080}
        className='w-full h-[700px] object-cover'
      />
      <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-[#DB421B]/60'>
        <h2 className='text-white text-xl font-bold text-center'>
          {content.goalsTitle}
        </h2>
        <p className='text-center text-white max-w-[700px] mt-4'>
          {content.goalsDescription}
        </p>
      </div>
    </div>
  )
}

export default Cta
