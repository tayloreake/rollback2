import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { isMobile } from "react-device-detect"
import Slider from "react-slick"

const ServiceCard = dynamic(() => import("./ServiceCard"))
const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
const HomeServices = () => {
    // load from url
  const services = [
    {
        name: "Household moving",
        image: "house.jpg",
        desc: "Seamless corporate relocations tailored to your business needs by Taylor Movers."

    },
    {
        name: "corporate moving",
        image: "corporate.jpg",
        desc: "Seamless corporate relocations tailored to your business needs by Taylor Movers."

    },
    {
        name: "Office moving",
        image: "office.png",
        desc: "Seamless corporate relocations tailored to your business needs by Taylor Movers."

    },
    {
        name: "warehousing",
        image: "house.jpg",
        desc: "Seamless corporate relocations tailored to your business needs by Taylor Movers."

    }
  ]

  const ServiceCard = ({service}) => {
    return (
        <>
        
        <div className="z-30 group relative w-full my-2 h-[400px] overflow-hidden">
            
            <Image
                src={`/assets/home/services/${service?.image}`}
                // width={0}
                fill
                className="object-cover z-10"
                alt=""
            />
            <div 
                className="font-[500] z-40 capitalize absolute bg-[#FF5000] text-white px-4 py-3 bottom-[20%]">
                    {service?.name}
                </div>
            
            <div 
                className="z-50 absolute text-2xl text-white left-0 p-4 md:p-[30%] flex items-center text-center top-0 h-full w-full bg-[#F05423D1] -translate-x-full transition-transform duration-300 group-hover:translate-x-0">
                    {service?.desc}
            </div>

        </div>
        </>
    )
  }
  return (
    <div className='w-full h-full flex items-center justify-center my-12'>
      <div className="container">
        <div className="row">
            <div className="col-12 my-4">
                <h1 className="mt-3 text-center text-3xl font-[600]">
                    Taylor Movers is a Premier <br/>Moving Company
                </h1>
                <div className="my-4 text-center text-sm">
                    Whether moving within Nairobi or around the globe, Taylor Movers Kenya will <br/>have a custom tailored moving solution for your admin
                </div>
            </div>
            {!isMobile 
              ?
                services?.map((service, idx) => (
                    <div className="col-md-6">
                        <ServiceCard service={service} />
                    </div>

                ))
            :
            <Slider {...settings}>
                {services?.map((service, idx) => (
                    <div className="col-12">
                        <ServiceCard service={service} />
                    </div>

                ))}
            </Slider>
            }
        </div>
      </div>
    </div>
  )
}

export default HomeServices
