import React, { useEffect, useState } from "react"
import { GetStaticProps } from 'next';
import getPageMetadata from "../SEO/seo"
import { getThankYouMessageData } from "../sanity/sanity-utils"
import { portableTextComponents } from "../components/portable-text"
import { PortableText } from '@portabletext/react';
import Jumbotron from "../components/jumbotron"


const ThankYou = ({ thankYou }) => {
    const [data, setData] = useState(thankYou)


    return (
        <div className='w-full h-full'>
            <Jumbotron image={'about.png'} text={""} />

            <div className="row mx-auto items-center">
                <div className="mx-auto min-h-[400px] border border-gray-100 rounded-md my-4 max-w-3xl">

                    <PortableText value={thankYou?.message} components={portableTextComponents} />
                </div>
            </div>
        </div>

    )
}

export default ThankYou
export async function getStaticProps() {
    const thankYou = await getThankYouMessageData()

    return {
        props: {
            thankYou
        },
        revalidate: 60, // Revalidate every 60 seconds
    }
}


