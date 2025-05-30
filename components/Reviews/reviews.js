import { Modal } from "antd"
import Image from "next/image"
import React, { useState, useRef } from "react"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaRegStar, FaStar } from "react-icons/fa";

const Reviews = () => {

  // Get this from Sanity
  const reviews = [
    {
      image: "review1.png",
      author: "Esther Njeri",
      title: "Copywriter on  Silot",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus eros nec velit pretium.",
      rating: 5
    },
    {
      image: "review1.png",
      author: "Esther Njeri",
      title: "Copywriter on  Silot",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus eros nec velit pretium.",
      rating: 4
    },
    {
      image: "review1.png",
      author: "Esther Njeri",
      title: "Copywriter on  Silot",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus eros nec velit pretium.",
      rating: 3
    }
  ]

  const showModal = () => {
    setIsModalOpen(true);
  }
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };



  return (
    <div className='bg-[#0000000D] rounded-2xl px-3 py-4'>

      <Slider {...settings}>
        {reviews.map((review, idx) => (
          <div key={`review-${idx}`} >
            <div className="flex">
              <div className="flex-col mr-3">
                <Image
                  width={0}
                  height={0}
                  sizes="auto"
                  style={{ width: "200px", height: "150px" }}
                  className=" mr-3 rounded-lg"
                  src={`/assets/Reviews/${review?.image}`} alt='' />
              </div>
              <div className="flex-col">
                <h3 className="font-[600]">{review.author}</h3>
                <div className="my-3 text-sm text-[#586863]">{review.title}</div>
                <div className="my-3">
                  {[...Array(review?.rating)].map((_, i) => (
                    <FaStar className="inline-block text-[#F05423]" key={i} />
                  ))}
                  {[...Array(5 - review?.rating)].map((_, i) => (
                    <FaRegStar className="inline-block text-[#F05423]" key={i} />
                  ))}
                </div>
                <p>{review.text}</p>
              </div>

            </div>
          </div>
        ))}
      </Slider>

    </div>
  )
}

export default Reviews
