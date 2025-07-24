import Image from "next/image";
import Link from "next/link"
import React, { useState, useEffect } from "react"
import {
  BsArrowBarRight,
  BsArrowRight,
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsTwitter,
} from "react-icons/bs"
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import QuoteModal from "./Quote/QuoteModal";
import { urlFor } from '../lib/sanity';


const Footer = () => {
  const timestamp = new Date().getTime();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoImage, setLogoImage] = useState(null)

  useEffect(() => {
    const handleManualStorageChange = () => {
      const logos = localStorage.getItem("siteLogos");
      setLogoImage(JSON.parse(logos)[0]?.footerLogo);
    };
    window.addEventListener("site-logos", handleManualStorageChange);
  }, [])

  return (
    <>
      <section className="bg-[#FF5000] text-white">
        <div className="container py-8">
          <div className="row py-5">
            <h2 className="col-12 text-2xl my-1 text-center font-[600]">
              Request a Quotation
              <span className="block text-sm my-1 font-[500]">Feel Free to ask, or send your request via chat</span>
            </h2>
            <div className="col-12 items-center flex">
              < QuoteModal quotebtn={"default"} />
            </div>
          </div>
        </div>
      </section>
      <section className='bg-[#6D6E71] text-white w-full h-full  px-2 flex flex-col items-center  justify-center'>
        <div className='pt-12 pb-3 container w-full flex flex-col md:flex-row items-start md:justify-between'>
          {/* About */}
          <div className='flex flex-col items-start pb-6'>
            <h3 className=' font-bold text-lg mb-3 w-full items-center justify-center text-cnter md:w-auto'>
              About Us
            </h3>
            <p className='text-sm max-w-[390px]  mb-6 text-cente md:text-start'>
              We specialize in local and international relocations. Taylor Movers
              is a privately held firm committed to excellence through providing
              relocations, transportation, warehousing, expatriate mobility
              services and logistics services efficiently.
            </p>

          </div>
          {/* Services */}
          <div className='flex flex-col items-start pb-6'>
            <h3 className=' font-bold text-lg mb-3 w-full items-center justify-center text-center md:w-auto'>
              Our Services
            </h3>
            <div className='text-sm text-[#BECCC7] flex flex-col justify-between items-start'>
              <Link className="my-1" href='/services/household-moving'>
                <div className='flex flex-row items-center '>
                  {/* <BsArrowRight size={20} className=' my-2 mr-2' /> */}
                  <p className=''>Household Moving</p>
                </div>
              </Link>
              <Link className="my-1" href='/services/office-moving'>
                <div className='flex flex-row items-center'>
                  {/* <BsArrowRight size={20} className='my-2 mr-2' /> */}
                  <p className=''>Office Moving</p>
                </div>
              </Link>
              <Link className="my-1" href='/services/corporate-moving'>
                <div className='flex flex-row items-center'>
                  {/* <BsArrowRight size={20} className='my-2 mr-2' /> */}
                  <p className=''>Corporate Relocation Services</p>
                </div>
              </Link>
              <Link className="my-1" href='/services/warehousing'>
                <div className='flex flex-row items-center'>
                  {/* <BsArrowRight size={20} className='my-2 mr-2' /> */}
                  <p className=''>Warehousing</p>
                </div>
              </Link>
            </div>
          </div>
          {/* Quick Links */}
          <div className='top-0 flex-col items-start pb-6'>
            <h3 className='font-bold text-lg mb-3 w-full items-center justify-center text-center md:w-auto'>
              Pages
            </h3>
            <div className='text-sm text-[#BECCC7] flex flex-col justify-between items-start w-full '>
              <Link className="my-1" href='/'>
                <div className='flex flex-row items-center'>
                  {/* <BsArrowRight size={20} className='] my-2 mr-2' /> */}
                  <p className=''>Home</p>
                </div>
              </Link>

              <Link className="my-1" href='/About'>
                <div className='flex flex-row items-center'>
                  {/* <BsArrowRight size={20} className='text-[#] my-2 mr-2' /> */}
                  <p className=''>About</p>
                </div>
              </Link>
              <Link className="my-1" href='/Services'>
                <div className='flex flex-row items-center'>
                  {/* <BsArrowRight size={20} className='text-[#] my-2 mr-2' /> */}
                  <p className=''>Our Services</p>
                </div>
              </Link>
              <Link className="my-1" href='/Blog'>
                <div className='flex flex-row items-center'>
                  {/* <BsArrowRight size={20} className='text-[#] my-2 mr-2' /> */}
                  <p className=''>Our Blog</p>
                </div>
              </Link>
              <Link className="my-1" href='/Gallery'>
                <div className='flex flex-row items-center'>
                  {/* <BsArrowRight size={20} className='text-[#] my-2 mr-2' /> */}
                  <p className=''>Our Gallery</p>
                </div>
              </Link>
            </div>
          </div>
          {/* Contacts */}
          <div className='flex flex-col items-center md:items-start pb-6 w-full max-w-[320px] md:w-fit'>
            <h3 className=' font-bold text-lg mb-3 w-full items-center justify-center text-center md:w-auto'>
              Business Hours
            </h3>
            <div className='text-sm text-[#BECCC7] flex flex-col justify-between items-center md:items-start w-full'>
              <div className='w-full '>
                <p className='md:text-start'>
                  Monday - Friday:
                  <br />
                  09.00 am - 08.00 pm.
                </p>
                {/* <hr className='border border-[#DB421B] w-full md:max-w-[200px] my-6' /> */}
                <p className='mt-2 md:text-start'>
                  Saturday - Sunday:
                  <br />
                  09.00 am - 12.00 pm.
                </p>
                {/* <p className='md:text-start w-full mt-4'>
                We are at you&apos;re service
              </p> */}
              </div>
            </div>
          </div>

        </div>

        {/* <hr className='border border-[#313D39] w-full my-6' /> */}

        <div className="container w-full row py-3 text-sm border-t-[2px] border-[#313D39]">
          <div className="col-6">
            <div className="py-1">
              {!logoImage ?
                <Image
                  width={0}
                  height={0}
                  sizes="auto"
                  style={{ height: 'auto', width: 'auto' }}
                  src={`/assets/General/logo-light.png?cb=${timestamp}`} alt='Taylor Movers Logo' />
                :
                <Image
                  src={urlFor(logoImage?.image)?.url()}
                  alt={logoImage?.alt}
                  width={120}
                  height={1}
                  className='object-contain'
                />
              }

              <div className="my-1 text-sm font-[500]">Experience delightful moving!</div>
            </div>
          </div>
          <div className="col-6">
            <div className='float-end hidden md:flex flex-wrap justify-between py-4'>
              <a href='https://web.facebook.com/taylormoversea' target="_blank">
                <div className='mr-2 p-1 w-[40px] h-[40px] bg-[#313D39] flex items-center justify-center hover:bg-[#FD6038] text-white'>
                  <FaFacebook size={20} />
                </div>
              </a>
              <a href='https://web.instagram.com/taylormoversea' target="_blank">
                <div className='mr-2 p-1 w-[40px] h-[40px] bg-[#313D39] flex items-center justify-center hover:bg-[#FD6038] text-white'>
                  <BsInstagram size={20} />
                </div>
              </a>
              <a href='https://twitter.com/taylormoverske' target="_blank">
                <div className='mr-2 p-1 w-[40px] h-[40px] bg-[#313D39] flex items-center justify-center hover:bg-[#FD6038] text-white'>
                  <RiTwitterXLine size={20} />
                </div>
              </a>
              <a href='https://www.linkedin.com/company/taylor-movers-ea/?originalSubdomain=ke' target="_blank">
                <div className='mr-2 p-1 w-[40px] h-[40px] bg-[#313D39] flex items-center justify-center hover:bg-[#FD6038] text-white'>
                  <FaLinkedin size={20} />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Footer
