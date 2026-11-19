import React from 'react'
import Head from 'next/head'
import getPageMetadata from "../SEO/seo"

const seoData = getPageMetadata("privacy", {
  customTitle: 'Privacy Policy | Taylor Movers Nairobi',
  customDescription: 'How Taylor Movers Kenya collects, uses and protects your personal data under the Kenya Data Protection Act 2019.',
})

const Privacy = () => {
  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <link rel="canonical" href={seoData.canonical} />
      </Head>
      <div className='flex flex-col my-12 py-12'>
        <div className='max-w-[1440px] w-full flex flex-col md:items-center md:justify-center items-start justify-start px-4'>
          <h1 className='text-3xl font-bold'>Privacy Policy</h1>
          <div className='mt-4 max-w-3xl text-gray-700 space-y-4'>
            <p>We respect your privacy. Any personal details you share through our quote or contact forms are used only to respond to your enquiry and provide moving services.</p>
            <p>We never sell your data. You may request access, correction or deletion of your details at any time via info@taylorea.com.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Privacy
