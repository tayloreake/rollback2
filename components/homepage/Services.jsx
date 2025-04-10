import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const ServiceCard = dynamic(() => import("./ServiceCard"))

const Services = ({ content, urlFor }) => {
  const [info, setInfo] = useState([])
  useEffect(() => {
    setInfo(
      content.aboutCards.map((inf) => ({
        id: inf._key,
        pic: urlFor(inf.aboutCardImage).url(),
        title: inf.aboutCardTitle,
        text: inf.aboutCardDescription,
        icon: "truck",
      }))
    )
  }, [content.aboutCards, urlFor])

  return (
    <div className='w-full h-full flex items-center justify-center my-12'>
      <div className='max-w-[1720px] flex flex-col md:flex-row items-center w-full justify-center md:justify-evenly px-4'>
        <div className='flex flex-col items-start justify-center'>
          <h2 className='mb-2 text-xl font-semibold max-w-[70%]'>
            {/* TAYLOR MOVERS IS  PREMIER <br /> MOVING COMPANY IN KENYA */}
            {content.aboutTitle}
          </h2>
          <hr className='w-[100px] border-[#DB421B] border my-3' />

          <p className='max-w-[565px]'>{content.aboutDescription}</p>
        </div>
        <div className='flex flex-row w-full overflow-x-auto max-w-[924px] my-4 md:my-0'>
          {info.map((inf) => (
            <ServiceCard key={inf.id} inf={inf} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Services
