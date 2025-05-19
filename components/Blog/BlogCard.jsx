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
      <div className='my-3 shadow-card py-3 pt-0'>
        <Image
          src={urlFor(blog.blogImage).url()}
          alt='background'
          width={350}
          height={350}
          className='mb-6 md:mb-0 cursor-pointer w-full max-h-[200px]'
        />
        <div className='flex flex-col px-2 md:ml-4'>
          {/* <p className='text-xs mb-2'>General Moving</p> */}
          <div className='my-4 flex flex-row h-full border-gray-200 border-r'>
              <BsCalendar size={20} className=' md:mb-0 text-[#DB421B]' />
              <p className='ml-2'>{moment(blog.date).format("MM/DD/YYYY")}</p>
            </div>
          <h3 className="text-xl font-[500] truncate overflow-hidden whitespace-nowrap">{blog.blogTitle}</h3>
          {/* <hr className='w-[50px] border border-[#DB421B] my-2' /> */}
          
          <p className='mt-4 text-gray-400 h-[200px] overflow-hidden'>{blog.blogExcerpt}</p>
          <p className="text-red-500 py-3 text-sm uppercase">Read More</p>
        </div>
      </div>
    </Link>
  )
}

export default BlogCard
