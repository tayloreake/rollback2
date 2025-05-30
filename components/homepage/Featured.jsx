import Image from "next/image"
import React from "react"
import { Carousel } from "react-bootstrap"
import HeroSection from "./hero-section"

const Featured = ({ content, urlFor }) => {

  return (
    <>
      <HeroSection />
      {/* <Carousel
        // controls={false}
        // indicators={false}
        className='banner-imgs'>
        <Carousel.Item >
          <img
            className="d-block w-100"
            src={"/assets/featured/taylorea.jpg"}
            // onLoad={onImageLoaded}
            alt="image"
            effects="blur"
          />
          <Carousel.Caption
            className="bg-[rgba(0,0,0,0.3)] text-center top-0 bottom-auto">
            <div className="text-4xl font-bold py-3">Moving <span className="text-red-500 italic">Resources</span></div>
            <div className="italic text-2xl mt-1">
              Even for professionals like us, moving can be a daunting task.
              With that in mind, we’ve pulled together some resources that can come in handy,
              whether you are moving with us or not.
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item >
          <img
            className="d-block w-100"
            src={"/assets/featured/corporate.jpg"}
            // onLoad={onImageLoaded}
            alt="image"
            effects="blur"
          />
          <Carousel.Caption
            className="bg-[rgba(0,0,0,0.3)] text-center top-0 bottom-auto">
            <div className="text-4xl font-bold py-3"><span className="text-red-500 italic">Corporate</span> Moving</div>
            <div className="italic text-2xl mt-1">
              New to an area? Do you need Area Tours, Information Packets, School/ Community Information, Home Finding/Home Purchasing Information &amp;
              Assistance, Home Rental Solutions, Mortgage Services or Temporary Housing?
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item >
          <img
            className="d-block w-100"
            src={"/assets/featured/house.jpg"}
            // onLoad={onImageLoaded}
            alt="image"
            effects="blur"
          />
          <Carousel.Caption
            className="bg-[rgba(0,0,0,0.3)] text-center top-0 bottom-auto">
            <div className="text-4xl font-bold py-3"><span className="text-red-500 italic">Household</span> Moving</div>
            <div className="italic text-2xl mt-1">
              Our Packing Options and additional household moving services let you do as much as you like or as little as you like when it comes to your big move.
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item >
          <img
            className="d-block w-100"
            src={"/assets/featured/warehouse.jpg"}
            // onLoad={onImageLoaded}
            alt="image"
            effects="blur"
          />
          <Carousel.Caption
            className="bg-[rgba(0,0,0,0.3)] text-center top-0 bottom-auto">
            <div className="text-4xl font-bold py-3"><span className="text-red-500 italic">Warehousing</span> & Storage</div>
            <div className="italic text-2xl mt-1">
              Often a business move requires a bit of extra storage during times of&nbsp;transition.&nbsp;Looking for extra storage for business files,
              office furniture,&nbsp;or the&nbsp;boss’s fancy flip flop collection? You’re in luck!
            </div>
          </Carousel.Caption>
        </Carousel.Item>


      </Carousel> */}
    </>
  )
}

export default Featured
