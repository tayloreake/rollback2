import Image from "next/image"
import { BsCalendar, BsShare } from "react-icons/bs"
import React from "react"
import Link from "next/link"
import imageUrlBuilder from "@sanity/image-url"
import client from "../../sanity/config/client-config"
import moment from "moment"

const BlogCard = ({ blog }) => {
  const builder = imageUrlBuilder(client)

  function urlFor(source) {
    return builder.image(source)
  }
  return (
    <Link href={`/Blog/${blog.slug.current}`}>
      <div className='flex flex-col md:flex-row my-6'>
        <Image
          src={urlFor(blog.blogImage).url()}
          alt='background'
          width={350}
          height={350}
          className='mb-6 md:mb-0 cursor-pointer md:max-w-[350px] w-full'
        />
        <div className='flex flex-col px-2 md:ml-4'>
          <p className='text-xs mb-2'>General Moving</p>
          <h3>{blog.blogTitle}</h3>
          <hr className='w-[50px] border border-[#DB421B] my-2' />
          <div className='text-sm opacity-80 flex flex-wrap items-center'>
            <div className='mb-2  md:mb-0 flex flex-row items-center justify-center  px-2 border-gray-200 border-r'>
              <Image
                src={urlFor(blog.author.authorImage).url()}
                width={50}
                height={50}
                className=' md:mb-0 rounded-full'
              />
              <p className='ml-2'>{blog.author.authorName}</p>
            </div>
            <div className='mb-2 md:mb-0 flex flex-row items-center justify-center h-full px-4 border-gray-200 border-r'>
              <BsCalendar size={20} className=' md:mb-0 text-[#DB421B]' />
              <p className='ml-2'>{moment(blog.date).format("MM/DD/YYYY")}</p>
            </div>
            {/* <div className='mb-4 md:mb-0 flex flex-row items-center justify-center h-full px-2 '>
              <BsShare size={20} className=' md:mb-0 text-[#DB421B]' />
              <p className='ml-2'>Share</p>
            </div> */}
          </div>
          <p className='mt-4 text-gray-400'>{blog.blogExcerpt}</p>
          <p className="text-red-500 py-3 text-sm italic">Read More...</p>
        </div>
      </div>
    </Link>
  )
}

export default BlogCard
