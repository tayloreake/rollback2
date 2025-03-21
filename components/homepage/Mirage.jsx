import Image from "next/image"
import React, { useEffect, useState } from "react"
import { BsTruck } from "react-icons/bs"

const Mirage = ({ content, urlFor }) => {
  const [info, setInfo] = useState([])
  useEffect(() => {
    setInfo(
      content.servicesCards.map((inf) => ({
        id: inf._key,
        pic: urlFor(inf.servicesCardImage).url(),
        title: inf.servicesCardTitle,
        text: inf.servicesCardDescription,
        icon: "truck",
      }))
    )
  }, [content.aboutCards, urlFor])

  return (
    <div className='w-full h-full my-12 py-12 px-4 flex items-center justify-center'>
      <div className='flex flex-col items-center max-w-[1720px] px-2 w-full'>
        <h2 className='text-xl font-semibold capitalize'>
          {content.servicesTitle}
        </h2>
        <hr className='w-[100px] border-[#DB421B] border my-3' />

        <p className='w-full max-w-[1000px] text-center'>
          {content.servicesDescription}
        </p>

        <div className='flex flex-col md:flex-row mt-12 w-full h-full justify-between  items-center relative '>
          {info.map((card) => {
            return (
              <>
                <div className='w-full h-full  relative md:max-w-[519px]  my-4  mx-4'>
                  <div className=' sm:min-w-[279px] min-h-[200px] rounded-lg bg-[#DB421B] sm:bg-[#DB421B]/80  w-full bottom-0 max-w-[279px] py-4 sm:py-0   md:max-h-[200px] mx-auto p-2  sm:absolute z-10'>
                    <div className='flex flex-col text-white p-3'>
                      <BsTruck size={30} />
                      <p className='mt-2 text-lg'>{card.title}</p>

                      <p className='mt-2 text-sm '>{card.text}</p>

                      <button className='bg-white text-[#DB421B] text-xs hover:bg-gray-100 transition-all rounded-full py-2 px-4 w-[100px] mt-4'>
                        View
                      </button>
                    </div>
                  </div>
                  <Image
                    src={card.pic}
                    alt='Our services'
                    width={383}
                    height={289}
                    className='w-full h-full object-cover rounded-lg hidden sm:block'
                  />
                </div>
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Mirage
