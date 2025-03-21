import Image from "next/image"
import React from "react"
import {
  BsArrowRightShort,
  BsTruck,
  BsAirplane,
  BsTruckFlatbed,
} from "react-icons/bs"
import { MdOutlineWarehouse } from "react-icons/md"
import Link from "next/link"

const ServiceCard = ({ inf }) => {
  return (
    <div className='flex flex-col mt-6 md:mt-0 bg-[#DB421B] rounded-lg w-full max-w-[212px] h-[400px] mr-4'>
      <div className='flex flex-col w-full h-full max-w-[212px] max-h-[308px] bg-[#DB421B] rounded-lg'>
        <div className='w-[212px]  rounded-lg relative'>
          <div className='w-full object-cover items-center z-0  h-full  max-w-[212px] rounded-t-xl bg-gradient-to-t from-[#DB421B] to--[#DB421B]/50 absolute z-1 ' />
          <Image
            src={`${inf.pic}`}
            alt='services picture'
            width={212}
            height={151}
            className='max-h-[141px] rounded-t-lg'
          />
        </div>
      </div>
      <div className='flex flex-col items-start justify-center px-4  py-2'>
        {inf.icon === "truck" ? (
          <BsTruck size={30} className='text-white' />
        ) : inf.icon === "warehouse" ? (
          <MdOutlineWarehouse size={30} className='text-white' />
        ) : inf.icon === "plane" ? (
          <BsAirplane size={30} className='text-white' />
        ) : inf.icon === "truck2" ? (
          <BsTruckFlatbed size={30} className='text-white' />
        ) : null}
        <p className='mt-4 text-white font-light'>{inf.title}</p>
        <p className='mt-2 text-white text-xs'>{inf.text}</p>
        <Link href='/Services?service=Household%20Moving&&subservice=Premoving'>
          <button className='px-4 py-2 text-xs hover:bg-gray-100 transition-all  bg-white flex flex-row items-center w-full text-[#DB421B] max-w-[100px] rounded-2xl my-4'>
            View
            <BsArrowRightShort className='text-[#DB421B] ml-2' />
          </button>
        </Link>
      </div>
    </div>
  )
}

export default ServiceCard
