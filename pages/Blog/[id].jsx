import React from "react"
import InFeatured from "../../components/Blog/InFeatured"
import { getBlog } from "../../sanity/sanity-utils"
import client from "../../sanity/config/client-config"
import imageUrlBuilder from "@sanity/image-url"
import PortableText from "@sanity/block-content-to-react"
import PageTitle from "../../components/PageTitle"

const Blog = ({ blog }) => {
  console.log(blog)
  const builder = imageUrlBuilder(client)

  function urlFor(source) {
    return builder.image(source)
  }
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <PageTitle title={blog.blogTitle} image={urlFor(blog.blogImage).url()} />
      <div className='max-w-[1440px] w-full h-full flex flex-col items-start justify-start py-8 my-4 px-4 md:px-8'>
        <div className='flex flex-col mb-6'>
          <h2 className='text-2xl mb-4'>{blog.blogTitle}</h2>
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
