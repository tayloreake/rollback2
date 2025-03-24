import React, { useState } from "react"
import PageTitle from "../components/PageTitle"
import Clients from "../components/homepage/Clients"
import Image from "next/image"
import getPageMetadata from "../SEO/seo"
import { getAboutPageData } from "../sanity/sanity-utils"
import imageUrlBuilder from "@sanity/image-url"
import client from "../sanity/config/client-config"

const About = ({ aboutPage }) => {
  const [data, setData] = useState(aboutPage[0])
  const builder = imageUrlBuilder(client)

  function urlFor(source) {
    return builder.image(source)
  }
  return (
    <div className='w-full h-full'>
      {getPageMetadata("about")}

      <PageTitle title="About Us" />

      <div className='w-full h-full flex items-center justify-center py-12 md:my-12 px-4 md:px-8'>
        <div className='w-full max-w-[1440px] flex flex-col items-center md:flex-row'>
          <div className='flex flex-col  items-center justify-center md:justify-start'>
            <h3 className='text-xl mb-6 text-center w-full md:text-start font-semibold'>
              {data.aboutTitle}
            </h3>
            <p className='text-center md:text-start max-w-[500px] lg:max-w-[820px] capitalize'>
              {data.aboutDescription}
            </p>
          </div>
          <div className='flex flex-col md:flex-row py-8 md:py-16 px-4 items-center justify-center md:justify-evenly md:px-6 md:ml-4 bg-[#DB421B] rounded-xl text-white w-full max-w-[650px] mt-8 md:mt-0'>
            <div className='flex flex-col text-center w-full md:text-start md:mr-2'>
              <h4 className='mb-2 text-lg font-bold'>{data.visionTitle}</h4>
              <p className=''>{data.visionDescription}</p>
            </div>
            <div className='flex flex-col text-center w-full md:text-start mt-8 md:mt-0'>
              <h4 className='mb-2 text-lg font-bold'>{data.missionTitle}</h4>
              <p className=''>{data.missionDescription}</p>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full h-full flex items-center justify-center py-12 px-4 md:px-8'>
        <div className='w-full max-w-[1440px] flex flex-col md:flex-row justify-between'>
          <div className='flex flex-col  items-center justify-center md:justify-start'>
            <div className='flex flex-col w-full mb-6 items-center justify-center md:items-start md:justify-start'>
              <p className='text-xl mb-2 text-center w-full md:text-start font-semibold'>
                {data.whatWeDoTitle}
              </p>
              <hr className='border border-[#DB421B] w-[100px]' />
            </div>
            <p className='text-center md:text-start max-w-[500px] lg:max-w-[820px] md:mr-4'>
              {data.whatWeDoDescription}
            </p>
          </div>
          <div className='flex flex-col md:flex-row  items-center justify-center relative md:justify-evenly md:ml-4 md:h-[500px] bg-[#DB421B] rounded-[800px] text-white w-full max-w-[500px] mt-8 md:mt-0'>
            <Image
              src={urlFor(data.whatWeDoCard.whatWeDoCardImage).url()}
              width={300}
              height={300}
              alt='Testimonial'
              className='w-full h-full rounded-xl'
            />
            <div className='absolute bottom-0 bg-[#DB421B]/30 text-white flex flex-col max-h-[189px] w-full py-10 px-4 md:px-8 rounded-3xl rounded-tr-none'>
              <h3 className=' text-xl'>
                {data.whatWeDoCard.whatWeDoCardTitle}
              </h3>
              <p className='font-italic text-sm'>
                {data.whatWeDoCard.whatWeDoCardDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Clients content={data} urlFor={urlFor} />
    </div>
  )
}

export default About

export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  )
  const aboutPage = await getAboutPageData()

  return {
    props: {
      aboutPage,
    },
  }
}
