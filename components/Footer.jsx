import Link from "next/link"
import React from "react"
import {
  BsArrowBarRight,
  BsArrowRight,
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsTwitter,
} from "react-icons/bs"
import { RiTwitterXLine } from "react-icons/ri";


const Footer = () => {
  return (
    <div className='bg-[#182C4D] text-white w-full h-full  px-4 flex flex-col items-center  justify-center'>
      <div className='pt-12 pb-3 max-w-[1440px] w-full flex flex-col md:flex-row items-start md:justify-between'>
        {/* About */}
        <div className='flex flex-col items-start pb-6'>
          <h3 className=' font-bold text-lg mb-3 w-full items-center justify-center text-cnter md:w-auto'>
            About Us
          </h3>
          <p className='max-w-[390px]  mb-6 text-cente md:text-start'>
            We specialize in local and international relocations. Taylor Movers
            is a privately held firm committed to excellence through providing
            relocations, transportation, warehousing, expatriate mobility
            services and logistics services efficiently.
          </p>
          <div className='hidden md:flex flex-wrap justify-between w-full max-w-[249px]'>
          <Link href='https://web.facebook.com/taylormoversea'>
              <div className='p-2 w-[44px] h-[44px] border border-[#DB421B] rounded-2xl flex items-center justify-center'>
                <BsFacebook size={20} className='text-gray-400' />
              </div>
            </Link>
            <Link href='https://web.instagram.com/taylormoversea'>
              <div className='p-2 w-[44px] h-[44px] border border-[#DB421B] rounded-2xl flex items-center justify-center'>
                <BsInstagram size={20} className='text-gray-400' />
              </div>
            </Link>
            <a href='https://twitter.com/taylormoverske' target="_blank">
              <div className='p-2 w-[44px] h-[44px] border border-[#DB421B] rounded-2xl flex items-center justify-center'>
                <RiTwitterXLine size={20} className='text-gray-400' />
              </div>
            </a>
            <Link href='https://www.linkedin.com/company/taylor-movers-ea/?originalSubdomain=ke'>
              <div className='p-2 w-[44px] h-[44px] border border-[#DB421B] rounded-2xl flex items-center justify-center'>
                <BsLinkedin size={20} className='text-gray-400' />
              </div>
            </Link>
          </div>
        </div>
        {/* Services */}
        <div className='flex flex-col items-start pb-6'>
          <h3 className=' font-bold text-lg mb-3 w-full items-center justify-center text-center md:w-auto'>
            Our Services
          </h3>
          <div className='flex flex-col justify-between items-start'>
            <Link href='/Services?service=Household Moving&&subservice=Premoving'>
              <div className='flex flex-row items-center '>
                <BsArrowRight size={20} className=' my-2 mr-2' />
                <p className=''>Household Moving</p>
              </div>
            </Link>
            <Link href='/Services?service=Office Moving&&subservice=Office Move'>
              <div className='flex flex-row items-center'>
                <BsArrowRight size={20} className='my-2 mr-2' />
                <p className=''>Office Moving</p>
              </div>
            </Link>
            <Link href='/Services?service=Corporate Moving&&subservice=Coporate Relocations'>
              <div className='flex flex-row items-center'>
                <BsArrowRight size={20} className='my-2 mr-2' />
                <p className=''>Corporate Relocation Services</p>
              </div>
            </Link>
            <Link href='/Services?service=Warehouse Moving&&subservice=Our Warehouse Services'>
              <div className='flex flex-row items-center'>
                <BsArrowRight size={20} className='my-2 mr-2' />
                <p className=''>Warehousing</p>
              </div>
            </Link>
          </div>
        </div>
        {/* Quick Links */}
        <div className='top-0 flex-col items-start pb-6'>
          <h3 className='font-bold text-lg mb-3 w-full items-center justify-center text-center md:w-auto'>
            Quick Links
          </h3>
          <div className='flex flex-col justify-between items-start w-full '>
            <Link href='/Blog'>
              <div className='flex flex-row items-center'>
                <BsArrowRight size={20} className='] my-2 mr-2' />
                <p className=''>Our Blogs</p>
              </div>
            </Link>
            {/* <div className='flex flex-row items-center'>
              <BsArrowRight size={20} className='text-[#DB421B] my-2 mr-2'/>
              <p className=''>Customer Care Policy</p>
            </div> */}
            <Link href='/Contacts'>
              <div className='flex flex-row items-center'>
                <BsArrowRight size={20} className='text-[#] my-2 mr-2' />
                <p className=''>Contact Us</p>
              </div>
            </Link>
          </div>
        </div>
        {/* Contacts */}
        <div className='flex flex-col items-center md:items-start pb-6 w-full max-w-[320px] md:w-fit'>
          <h3 className=' font-bold text-lg mb-3 w-full items-center justify-center text-center md:w-auto'>
            Business Hours
          </h3>
          <div className='flex flex-col justify-between items-center md:items-start w-full'>
            <div className='w-full '>
              <p className='md:text-start'>
                Monday - Friday:
                <br />
                09.00 am - 08.00 pm.
              </p>
              <hr className='border border-[#DB421B] w-full md:max-w-[200px] my-6' />
              <p className=' md:text-start'>
                Saturday - Sunday:
                <br />
                09.00 am - 12.00 pm.
              </p>
              <p className='md:text-start w-full mt-4'>
                We are at you&apos;re service
              </p>
            </div>
          </div>
        </div>
        {/* Socials Mobile */}
        <div className='flex flex-wrap justify-between w-full max-w-[249px] mt-10 md:hidden'>
          <Link href='https://web.facebook.com/taylormoversea'>
            <div className='p-2 w-[44px] h-[44px] border border-[#DB421B] rounded-2xl flex items-center justify-center'>
              <BsFacebook size={20} className='text-gray-400' />
            </div>
          </Link>
          <Link href='https://twitter.com/taylormoverske'>
            <div className='p-2 w-[44px] h-[44px] border border-[#DB421B] rounded-2xl flex items-center justify-center'>
              <BsTwitter size={20} className='text-gray-400' />
            </div>
          </Link>

          <Link href='https://www.linkedin.com/company/taylor-movers-ea/?originalSubdomain=ke'>
            <div className='p-2 w-[44px] h-[44px] border border-[#DB421B] rounded-2xl flex items-center justify-center'>
              <BsLinkedin size={20} className='text-gray-400' />
            </div>
          </Link>
        </div>
      </div>
      <div className="w-full flex items-center justify-center py-3 text-sm border-t border-slate-600 opacity-60 hover:opacity-full">
        © {new Date().getFullYear()} Taylor Movers. All rights reserved.
      </div>
    </div>
  )
}

export default Footer
