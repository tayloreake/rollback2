import React, { useEffect, useState } from "react"
import Featured from "../components/Blog/Featured"
import BlogCard from "../components/Blog/BlogCard"
import BlogLayout from "../components/Blog/BlogLayout"
import SearchBar from "../components/Blog/SearchBar"
import CategorySidebar from "../components/Blog/CategorySidebar"
import {
  getBlogs,
  getBlogsByCategory,
  getCategories,
  getTags,
} from "../sanity/sanity-utils"
import getPageMetadata from "../SEO/seo"
import Head from 'next/head'

const Blog = ({ blogs, tags, categories }) => {
  const [activeCategory, setActiveCategory] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [stateBlogs, setStateBlogs] = useState(blogs || [])
  const [filteredBlogs, setFilteredBlogs] = useState(blogs || [])

  // Get SEO metadata
  const seoData = getPageMetadata("ourBlog")

  // Filter blogs based on category and search term
  useEffect(() => {
    let filtered = stateBlogs

    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter((blog) => {
        if (!blog.blogCategories) return false
        return blog.blogCategories.some((cat) => 
          cat.category?.toLowerCase().includes(activeCategory.toLowerCase()) ||
          activeCategory.toLowerCase().includes(cat.category?.toLowerCase() || '')
        )
      })
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((blog) => {
        const titleMatch = blog.blogTitle?.toLowerCase().includes(searchTerm.toLowerCase())
        const excerptMatch = blog.blogExcerpt?.toLowerCase().includes(searchTerm.toLowerCase())
        const tagMatch = blog.blogTags?.some((tag) => 
          tag.tag?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        return titleMatch || excerptMatch || tagMatch
      })
    }

    setFilteredBlogs(filtered)
  }, [activeCategory, searchTerm, stateBlogs])

  // Handle category change
  const handleCategoryChange = (categoryName) => {
    setActiveCategory(categoryName)
    if (!categoryName) {
      setStateBlogs(blogs || [])
    } else {
      const newBlogs = blogs.filter((blog) => {
        if (!blog.blogCategories) return false
        return blog.blogCategories.some((cat) => 
          cat.category?.toLowerCase().includes(categoryName.toLowerCase()) ||
          categoryName.toLowerCase().includes(cat.category?.toLowerCase() || '')
        )
      })
      setStateBlogs(newBlogs)
    }
  }

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  // Sidebar content
  const sidebarContent = (
    <div>
      <SearchBar onSearch={handleSearch} />
      <CategorySidebar 
        categories={categories}
        blogs={blogs}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
    </div>
  )

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:type" content={seoData.openGraph.type} />
      </Head>

      <BlogLayout sidebar={sidebarContent}>
        {/* Main content area */}
        <div className="space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Moving Blog</h1>
            <p className="text-gray-400">
              Expert tips, guides, and insights to make your move seamless
            </p>
          </div>

          {/* Search results info */}
          {(searchTerm || activeCategory) && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <p className="text-gray-300 text-sm">
                {filteredBlogs.length} result{filteredBlogs.length !== 1 ? 's' : ''} 
                {searchTerm && ` for "${searchTerm}"`}
                {activeCategory && ` in ${activeCategory}`}
              </p>
            </div>
          )}

          {/* Blog grid */}
          {filteredBlogs?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog, idx) => (
                <BlogCard key={blog.slug?.current || idx} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
                <p className="text-gray-400 text-lg mb-2">No articles found</p>
                <p className="text-gray-500 text-sm">
                  {searchTerm || activeCategory 
                    ? 'Try adjusting your search or category filter'
                    : 'Check back soon for new content'
                  }
                </p>
                {(searchTerm || activeCategory) && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setActiveCategory('')
                      setStateBlogs(blogs || [])
                    }}
                    className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Load more button (if you have pagination) */}
          {filteredBlogs?.length > 0 && filteredBlogs.length >= 9 && (
            <div className="text-center pt-8">
              <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 rounded-lg transition-colors">
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </BlogLayout>
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
