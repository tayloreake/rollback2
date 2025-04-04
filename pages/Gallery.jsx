import React, { useState } from "react"
import PageTitle from "../components/PageTitle"
import Clients from "../components/homepage/Clients"
import Image from "next/image"
import getPageMetadata from "../SEO/seo"
import { getAboutPageData } from "../sanity/sanity-utils"
import imageUrlBuilder from "@sanity/image-url"
import client from "../sanity/config/client-config"

const Gallery = () => {
  
  return (
    <div className='w-full h-full'>

      <PageTitle title="Gallery" />
    
        <section className="max-w-[1140px]">
            
        </section>

    </div>
  )
}

export default Gallery