import Image from 'next/image'
import React from 'react'

const Featured = () => {
  return (
    <div className='w-full text-center relative flex items-center justify-center'>
        {/* <div className=' rounded-lg bg-black/40 py-8 w-full max-w-[350px] md:max-w-[924px] h-full max-h-[202px] mx-auto p-2 flex flex-row justify-center items-center absolute z-10'>
            
        </div> */}
        {/* <div className='w-full object-cover items-center  h-full min-h-[500px] bg-black/30 absolute'/> */}
        <Image src="/assets/Bgs/bg1.png" width={500} height={500} alt='Taylor Movers' className='w-full object-cover items-center min-h-[200px] md:min-h-[500px] max-h-[500px]'/>
    </div>
  )
}

export default Featured