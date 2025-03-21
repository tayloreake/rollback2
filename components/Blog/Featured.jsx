import Image from 'next/image'
import React from 'react'

const Featured = () => {
  return (
    <div className='w-full text-center relative flex items-center justify-center '>
        <div className=' rounded-lg text-white px-2 bg-black/40 py-8 w-full max-w-[350px] md:max-w-[924px] h-full max-h-[202px] mx-auto p-2 flex flex-col justify-center items-center absolute z-10'>
          <h2 className='text-2xl mb-2'>Our Blog</h2>
          <p>
            Moving can be a daunting task, even for the most experienced
            movers. With that in mind, we&apos;ve pulled together some
            resources that can come in handy.
          </p>
        </div> 
        <div className='w-full object-cover items-center  h-full min-h-[500px] bg-black/30 absolute'/>
        <Image src="/assets/Bgs/bg2.png" width={500} height={500} alt='Taylor Movers' className='w-full object-cover items-center min-h-[500px] max-h-[500px]'/>
    </div>
  )
}

export default Featured