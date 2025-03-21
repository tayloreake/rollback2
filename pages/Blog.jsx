import React, { useEffect, useState } from "react"
import Featured from "../components/Blog/Featured"
import BlogCard from "../components/Blog/BlogCard"
import {
  getBlogs,
  getBlogsByCategory,
  getCategories,
  getTags,
} from "../sanity/sanity-utils"
import getPageMetadata from "../SEO/seo"
import PageTitle from "../components/PageTitle"

const Blog = ({ blogs, tags, categories }) => {
  // console.log({
  //   blogs,
  //   tags,
  //   categories,
  // })
  const [activeCategory, setActiveCategory] = useState("")
  const [activeTag, setActiveTag] = useState("")
  const [stateBlogs, setStateBlogs] = useState(blogs || [])

  return (
    <>
      {getPageMetadata("ourBlog")}
      <div className='w-full h-full flex flex-col items-center justify-center'>
        <PageTitle title={"Our Blog"} />
        <div className='max-w-[1440px] w-full h-full flex flex-col items-start justify-start py-8  px-4 md:px-8'>

          <div className='flex flex-col  mt-6 w-full'>
            <h3 className='text-[#DB421B] mb-2 text-lg'>Categories</h3>
            <div className='flex flex-row pr-6   w-full overflow-x-auto pb-6 mr-6 '>
              {categories?.length > 0 &&
                categories?.map((category) => (
                  <div
                    key={category._id}
                    onClick={async () => {
                      const newBlogs = blogs.filter((blg) => {
                        const found = blg.blogCategories.some((ctgry) => {
                          return ctgry._ref === category._id
                        })
                        return found
                      })

                      setStateBlogs(newBlogs)
                    }}
                    className=' mr-6 hover:antialiased cursor-pointer w-fit'>
                    <p className='whitespace-nowrap'>{category.category}</p>
                    <hr className='border border-[#DB421B] w-[50px] hover:w-[80px] duration-150' />
                  </div>
                ))}
            </div>
            <h3 className='text-[#DB421B] mb-2 mt-8'>Search By Tag</h3>
            <div className='flex flex-row pr-6   w-full overflow-x-auto pb-6 mr-6 '>
              {tags?.length > 0 &&
                tags?.map((tag) => (
                  <button
                    key={tag._id}
                    onClick={async () => {
                      const newBlogs = blogs.filter((blg) => {
                        const found = blg.blogTags.some((tg) => {
                          return tg._ref === tag._id
                        })
                        return found
                      })

                      setStateBlogs(newBlogs)
                    }}
                    className='bg-[#DB421B]/60 rounded-full mr-6 hover:antialiased cursor-pointer w-fit py-2 px-4 flex items-center justify-center text-white'>
                    <p className='whitespace-nowrap'>{tag.tag}</p>
                  </button>
                ))}
            </div>

            <div className='flex flex-col w-full mt-12'>
              {stateBlogs?.length > 0 &&
                stateBlogs?.map((blog) => (
                  <BlogCard key={blog.slug.current} blog={blog} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Blog

export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  )
  const blogs = await getBlogs()
  const categories = await getCategories()
  const tags = await getTags()
  return {
    props: {
      blogs,
      tags,
      categories,
    },
  }
}
