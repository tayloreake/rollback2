import React, { useState } from "react"
import PageTitle from "../components/PageTitle"
import Image from "next/image"
import getPageMetadata from "../SEO/seo";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const Gallery = () => {
    const images = require.context(`../public/assets/gallery/images`, false, /\.(png|jpe?g|svg)$/);
    const imagePaths = images.keys().map(images);
    const videos = require.context(`../public/assets/gallery/videos`, false, /\.(png|jpe?g|svg)$/);
    const videoPaths = videos.keys().map(videos);
  return (
    <div className='w-full h-full'>

      <PageTitle title="Gallery" />
    
        <section className="max-w-[1140px] mx-auto my-5">
            <Tabs
                defaultActiveKey="images"
                id="uncontrolled-tab-example"
                className="mb-3"
                >
                <Tab eventKey="videos" title="Videos">
                {videoPaths.map((src, i) => (

                    <video 
                    key={`${"gallery-videos-"}-${i}`}
                    width="320"
                    height="240" 
                    controls
                    muted loop
                    playsInline
                    className="inline-block max-w-[419px] w-[419px] h-[419px]"
                    >
                    <source 
                        src={src} type="video/mp4"/>
                    <source src={src} type="video/mov"/>


                    Your browser does not support the video tag.
                    </video>
                    ))}                
                </Tab>
                <Tab eventKey="images" title="Images">

                  <div className="md:columns-6 gap-1">
                      {imagePaths.map((src, i) => (
                          <Image 
                          key={`${"gallery-images-"}-${i}`}
                          alt={`img-${i}`}
                          src={src}
                          width={200}
                          height={100}
                          className="break-inside-avoid inline-block mb-2"
                          style={{width:"200px", marginRight:"7px"}}
                          />
                      ))}
                  </div>
                </Tab>
                
            </Tabs>
        </section>

    </div>
  )
}

export default Gallery