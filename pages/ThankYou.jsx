import React, { useEffect, useState } from "react"
import { GetStaticProps } from 'next';
import getPageMetadata from "../SEO/seo"
import { getThankYouMessageData } from "../sanity/sanity-utils"
import { portableTextComponents } from "../components/portable-text"
import { PortableText } from '@portabletext/react';
import Jumbotron from "../components/jumbotron"
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Script from 'next/script'

const ThankYou = ({ thankYou }) => {
    const [data, setData] = useState(thankYou)

    return (
        <>
            {/* Google Ads gtag.js */}
            <Script
                strategy="afterInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=AW-966026451"
            />

            <Script id="gtag-init" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-966026451');
        `}
            </Script>
            <div className='w-full h-full'>
                <Jumbotron image={'taylor-movers-kenya-professional-team.png'} text={""} />
                <div className="row mx-auto items-center">
                    <div className="mx-auto min-h-[400px] border border-gray-100 rounded-md my-4 max-w-3xl">
                        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4 py-5">
                            <motion.div
                                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                className="text-green-500 mb-6"
                            >
                                <CheckCircle size={80} />
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl font-semibold mb-3"
                            >
                                {thankYou?.message}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-gray-600 max-w-md"
                            >
                                {thankYou?.subMessage}
                            </motion.p>
                        </div>
                    </div>
                </div>
            </div>
        </>


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


