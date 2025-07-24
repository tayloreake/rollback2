import React, { useEffect, useState } from "react"
import { GetStaticProps } from 'next';
import PageTitle from "../components/PageTitle"
import Clients from "../components/homepage/Clients"
import Image from "next/image"
import getPageMetadata from "../SEO/seo"
import { getAboutData } from "../sanity/sanity-utils"
import imageUrlBuilder from "@sanity/image-url"
import client from "../sanity/config/client-config"
import Jumbotron from "../components/jumbotron"
import PortableText from "@sanity/block-content-to-react"




const OurTalentedPeople = () => {
  const talenteds = [
    {
      name: "",
      image: "",
      desc: "",
    }
  ]

  return (
    <section>
      <h2>Our Talented People</h2>
      <div>

      </div>
    </section>
  )
}

const About = ({ aboutPage }) => {
  const [data, setData] = useState(aboutPage[0])
  const builder = imageUrlBuilder(client)

  function urlFor(source) {
    return builder.image(source)
  }

  return (
    <div className='w-full h-full'>
      {getPageMetadata("about")}

      <Jumbotron image={'taylor-movers-kenya-professional-team.png'} text={""} alt={"Professional and friendly team of Taylor Movers Kenya, ready to assist with your move"} />

      <div className="row mx-0 items-top">
        <div className="col-md-6 ">
          <div className="md:mx-[160px] mx-2 py-8 md:text-left text-center">
            <h2 className="my-6 text-3xl font-[600] text-[#FF5000]">
              The premier <br />Moving <br />Company
            </h2>
            <div className="my-3 leading-[1.5]">
              <div dangerouslySetInnerHTML={{ __html: data?.about_us }} />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="bg-[#F0EFEF] mx-2 px-2 md:px-[160px] py-8 md:text-left text-center">
            <h3 className="text-[#ff5000] py-3 font-bold text-2xl">Our Vision</h3>
            <div className="py-6">
              <div dangerouslySetInnerHTML={{ __html: data?.vision }} />

            </div>
          </div>
          <div className="bg-[#ff5000] mx-2 px-2 md:px-[160px] py-12 md:text-left text-center">
            <h3 className="text-[#070707] py-3 font-bold text-2xl">Our Mission</h3>
            <div className="py-2 text-white">
              <div dangerouslySetInnerHTML={{ __html: data?.mission }} />
            </div>
          </div>
        </div>
      </div>

      <Clients content={data} urlFor={urlFor} />
    </div>
  )
}

export default About
export async function getStaticProps() {
  const aboutPage = await getAboutData()

  return {
    props: {
      aboutPage
    },
    revalidate: 60, // Revalidate every 60 seconds
  }
}


