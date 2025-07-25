import Image from "next/image"
import React, { useEffect, useState } from "react"
import { BiChevronRight } from "react-icons/bi"
import Accordion from 'react-bootstrap/Accordion';
import Reviews from "../Reviews/reviews";
import { isMobile } from "react-device-detect";
import { Tab, Tabs } from "react-bootstrap";
import Link from "next/link";
import { portableTextComponents } from "../../components/portable-text"
import { PortableText } from '@portabletext/react';
import { urlFor } from '../../lib/sanity';



const About = ({ content }) => {
    return (
        <div className='w-full h-full py-8 justify-center'>
            <div className="row">
                <div className="col-md-6 px-3 text-center md:text-left md:!px-[200px] md:py-8 bg-[#EDEDED]">
                    <h1 className="text-2xl font-bold text-[#F05423] my-3">{content?.title}</h1>
                    <div className="my-2">
                        <PortableText value={content?.text} components={portableTextComponents} />
                    </div>
                    <div>
                        <Link href={"/About"}>
                            <button className="hover:opacity-60 btn rounded-2xl px-3 py-2 text-white !bg-[#F05423] my-5">ABOUT US</button>
                        </Link>
                    </div>
                </div>
                <div className="col-md-6 relative">
                    <Image
                        src={urlFor(content.aboutImage.image).url()}
                        alt={content.aboutImage.alt}
                        fill
                        style={{ objectFit: 'cover' }}
                        className='mb-6 md:mb-0 cursor-pointer w-full m-h-[500px]'
                    />
                </div>
            </div>
        </div>
    )
}

export default About