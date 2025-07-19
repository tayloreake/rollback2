import { Modal } from "antd"
import Image from "next/image"
import React, { useState, useRef, useEffect } from "react"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import imageUrlBuilder from "@sanity/image-url"
import client from "../../sanity/config/client-config"
import { getClientReviews } from "../../sanity/sanity-utils";
import { FaRegStar, FaStar } from "react-icons/fa";

const Reviews = () => {
  const [reviews, setReviews] = useState();

  useEffect(() => {
    const storedReviews = JSON.parse(window.localStorage.getItem("clientReviews"));
    setReviews(storedReviews);
  }, [])


  const builder = imageUrlBuilder(client)

  function urlFor(source) {
    return builder.image(source)
  }
  useEffect(() => { console.log("Reviews data", reviews) }, [reviews])

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
        {reviews?.map((review, idx) => (
          <div key={`review-${idx}`} >
            <div className="flex">
              <div className="flex-col mr-3 w-[300px]">
                <Image
                  width={0}
                  height={0}
                  sizes="auto"
                  alt={review.imageAlt}
                  className=" mr-3 rounded-lg !w-[150px] !h-[100px] object-cover"
                  loading="lazy"
                  src={urlFor(review?.logo).url()} />
              </div>
              <div className="flex-col">
                <h3 className="font-[600] capitalize">{review.name}</h3>
                <div className="my-3 text-sm text-[#586863]">{review.title}</div>
                <div className="my-3">
                  {[...Array(review?.rating)].map((_, i) => (
                    <FaStar className="inline-block text-[#F05423]" key={i} />
                  ))}
                  {[...Array(5 - review?.rating)].map((_, i) => (
                    <FaRegStar className="inline-block text-[#F05423]" key={i} />
                  ))}
                </div>
                <p>{review.review}</p>
              </div>

            </div>
          </div>
        ))}
      </Slider>

    </div>
  )
}

export default Reviews
