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


const categories = [
  "General moving",
  "Document Storage",
  "House Moving",
  "Office Moving",
];
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

      <div className='container my-4'>

        <div className='flex flex-col  mt-6 w-full'>
          <h2 className='hidden md:block text-[#F05423] text-center mb-2 text-3xl font-[600] my-5'>Conversation Categories</h2>
          <h3 className="font-[600] text-2xl text-center text-black my-3">Latest Story From Our Blog</h3>

          <div className='hidden md:flex items-justify justify-center pr-6   w-full overflow-x-auto pb-6 mr-6 '>
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
                  <button className='!bg-[#F05423] rounded-full font-[500] btn text-white whitespace-nowrap capitalize'>{category.category}</button>
                </div>
              ))}
          </div>


          <div className='row'>
            {stateBlogs?.length > 0 &&
              stateBlogs?.map((blog, idx) => (
                <div key={`blog-${idx}`} className="col-md-4">
                  <BlogCard key={blog.slug} blog={blog} />
                </div>
              ))}
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
