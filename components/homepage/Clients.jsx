import Image from "next/image"
import React, { useEffect, useState } from "react"
import { BiChevronRight } from "react-icons/bi"

const Clients = ({ content, urlFor }) => {
  const [info, setInfo] = useState([])
  useEffect(() => {
    setInfo(
      content.clientsAccordions.map((item, index) => {
        const { _key, clientsAccordionTitle, clientsAccordionImages } = item
        const imagesArray = clientsAccordionImages.map((image) =>
          urlFor(image).url()
        )
        return {
          id: _key,
          title: clientsAccordionTitle,
          images: imagesArray,
          open: index === 0,
        }
      })
    )
  }, [urlFor])

  const handleClick = (id) => {
    const newInfo = info.map((item) => {
      if (item.id === id) {
        item.open = !item.open
      }
      return item
    })
    setInfo(newInfo)
  }

  return (
    <div className='w-full h-full py-12 px-4 md:px-8 flex items-center justify-center'>
      <div className='flex flex-col max-w-[1440px] w-full'>
        <h2 className='text-xl font-semibold'>{content.clientsTitle}</h2>
        <hr className='border border-[#DB421B] w-[50px] my-3' />

        <p className='max-w-[1400px]'>{content.clientsDescription}</p>

        <div className='flex flex-col mt-12'>
          {info.map((item, index) => (
            <div
              key={index}
              className='flex flex-col'
              onClick={() => handleClick(item.id)}>
              <button className='flex items-center   py-2 rounded-md  mb-2'>
                {item ? (
                  <BiChevronRight className='transform rotate-90 text-[#DB421B]' />
                ) : (
                  <BiChevronRight className='text-[#DB421B]' />
                )}
                <p className='text-sm pl-4'>{item.title}</p>
              </button>
              {item.open ? (
                <div className='flex flex-row items-center overflow-x-auto mt-4'>
                  {item.images.map((image) => (
                    <Image
                      key={image}
                      src={image}
                      alt='Banking'
                      width={122}
                      height={122}
                      className='w-full max-w-[122px] h-[122px] object-cover mr-4'
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Clients
