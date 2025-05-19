import React, { useState } from "react"
import PageTitle from "../components/PageTitle"
import Clients from "../components/homepage/Clients"
import Image from "next/image"
import getPageMetadata from "../SEO/seo"
import { getAboutPageData } from "../sanity/sanity-utils"
import imageUrlBuilder from "@sanity/image-url"
import client from "../sanity/config/client-config"
import Jumbotron from "../components/jumbotron"



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
      <h1>Our Talented People</h1>
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

      <Jumbotron image={'about.png'} text={""} />
      
      <div className="row mx-0 items-center">
        <div className="col-md-6 ">
          <div className="mx-[160px] py-8">
            <h1 className="my-6 text-3xl font-[600] text-[#FF5000]">
              The premier <br/>Moving <br/>Company
            </h1>
            <div className="my-3 leading-[1.5]">
              <p>Our key focus and goal is to understand our clients experience from their point of view. We see this as our central focus that drives every aspect of how we conduct our business and relate to our customers. We guarantee professional moving services in Kenya. Whether moving within Nairobi or around the globe, Taylor movers Kenya will have a custom tailored moving solution for you.</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
            <div className="bg-[#F0EFEF] px-[160px] py-8">
            <h1 className="text-[#ff5000] py-3 font-bold text-2xl">Our Vision</h1>
            <div className="py-6">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus eros nec velit pretium, eget laoreet enim tempor. Etiam erat ex, lacinia nec mattis quis, efficitur et magna. Nam auctor odio vitae nulla scelerisque, vel porttitor eros sodales. Aenean scelerisque felis id est facilisis ornare. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. </p>
                </div>
            </div>
            <div className="bg-[#ff5000] px-[160px] py-12">
                <h1 className="text-[#070707] py-3 font-bold text-2xl">Our Mission</h1>
                <div className="py-2 text-white">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus eros nec velit pretium, eget laoreet enim tempor. Etiam erat ex, lacinia nec mattis quis, efficitur et magna. Nam auctor odio vitae nulla scelerisque, vel porttitor eros sodales. Aenean scelerisque felis id est facilisis ornare. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. </p>
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
