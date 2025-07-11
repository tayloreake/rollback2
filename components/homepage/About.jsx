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
        text: "Our key focus and goal is to understand our clients experience from their point of view. We see this as our central focus that drives every aspect of how we conduct our business and relate to our customers. We guarantee professional moving services in Kenya. Whether moving within Nairobi or around the globe, Taylor movers Kenya will have a custom tailored moving solution for you. ",
        image: "taylor-movers-kenya-unloading-new-home.png"
    }

    return (
        <div className='w-full h-full py-8 justify-center'>
            <div className="row">
                <div className="col-md-6 px-3 text-center md:text-left md:!px-[200px] md:py-8 bg-[#EDEDED]">
                    <h3 className="text-2xl font-bold text-[#F05423] my-3">{aboutContent?.title}</h3>
                    <div className="my-2">
                        {aboutContent?.text}
                    </div>
                    <div>
                        <Link href={"/About"}>
                            <button className="hover:opacity-60 btn rounded-2xl px-3 py-2 text-white !bg-[#F05423] my-5">ABOUT US</button>
                        </Link>
                    </div>
                </div>
                <div className="col-md-6 relative">
                    <Image
                        // width={600}
                        // height={600}
                        alt="Taylor Movers Kenya professional unloading a box of luggage from a moving vehicle at a client's new residence."
                        fill
                        style={{ objectFit: 'cover' }}
                        src={`/assets/About/${aboutContent?.image}`}
                    />
                </div>
            </div>
        </div>
    )
}

export default About