import Image from "next/image"
import React, { useEffect, useState } from "react"
import { BiChevronRight } from "react-icons/bi"
import Accordion from 'react-bootstrap/Accordion';
import Reviews from "../Reviews/reviews";
import { isMobile } from "react-device-detect";
import { Tab, Tabs } from "react-bootstrap";
import Link from "next/link";

const About = ({ content, urlFor }) => {

    const aboutContent = {
        title: "The Premier Moving Company",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus eros nec velit pretium, eget laoreet enim tempor. Etiam erat ex, lacinia nec mattis quis, efficitur et magna. Nam auctor odio vitae nulla scelerisque, vel porttitor eros sodales. Aenean scelerisque felis id est facilisis ornare. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. ",
        image: "about.png"
    }
  
    return (
        <div className='w-full h-full py-8 justify-center'>
            <div className="row">
                <div className="col-md-6 px-3 md:!px-[200px] md:py-8 bg-[#EDEDED]">
                    <h1 className="text-2xl font-bold text-[#F05423] my-3">{aboutContent?.title}</h1>
                    <div className="my-2">
                        {aboutContent?.text}
                    </div>
                    <div>
                        <Link href={"/About"}>
                            <button className="btn rounded-2xl px-3 py-2 text-white bg-[#F05423] my-5">ABOUT US</button>
                        </Link>
                    </div>
                </div>
                <div className="col-md-6 relative">
                    <Image
                        // width={600}
                        // height={600}
                        fill
                        style={{objectFit: 'cover'}}
                        src={`/assets/About/${aboutContent?.image}`}
                    />
                </div>
            </div>
        </div>
  )
}

export default About