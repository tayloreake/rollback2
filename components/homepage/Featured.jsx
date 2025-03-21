import Image from "next/image"
import React from "react"
import { Carousel } from "react-bootstrap"

const Featured = ({ content, urlFor }) => {
  
  return (
    <>
      <Carousel
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
                    <div className="text-4xl font-bold py-3">Corporate <span className="text-red-500 italic">Moving</span></div>
                    <div className="italic text-2xl mt-1">
                      Experience the greatness in Moving with the Best Movers in the country
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
                      Best Corporate Moving to the best of the adhreence to international standards
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
                    <div className="text-4xl font-bold py-3"><span className="text-red-500 italic">House</span> Moving</div>
                    <div className="italic text-2xl mt-1">
                      Conveniently move your house to the best considerations of Pricing and honor
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
                    <div className="text-4xl font-bold py-3"><span className="text-red-500 italic">Warehouse</span> Moving</div>
                    <div className="italic text-2xl mt-1">
                      Imagine The best warehouse storage
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
            

      </Carousel>
    </>
  )
}

export default Featured
