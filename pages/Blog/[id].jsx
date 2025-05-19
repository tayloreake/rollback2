import React from "react"
import InFeatured from "../../components/Blog/InFeatured"
import { getBlog } from "../../sanity/sanity-utils"
import client from "../../sanity/config/client-config"
import imageUrlBuilder from "@sanity/image-url"
import PortableText from "@sanity/block-content-to-react"
import PageTitle from "../../components/PageTitle"
import Image from "next/image"

const Blog = ({ blog }) => {
  const builder = imageUrlBuilder(client)

  function urlFor(source) {
    return builder.image(source)
  }
  return (
    <div className='w-full h-full flex flex-col items-center justify-center container'>
      <div className=''>
        <div className='flex flex-col mb-6'>
          <h2 className='text-3xl text-[#FF5000] my-4 !mt-9 font-bold'>{blog.blogTitle}</h2>
          <Image
          src={urlFor(blog.blogImage).url()}
          alt='background'
          width={350}
          height={350}
          className='mb-6 md:mb-0 cursor-pointer w-full max-h-[500px] my-4'
        />
          <PortableText blocks={blog.blogText} />
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { id: slug = "" } = context.params

  const blog = await getBlog(slug)

  return {
    props: {
      blog,
    },
  }
}

export default Blog
