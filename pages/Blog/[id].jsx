import React from "react"
import { getBlog } from "../../sanity/sanity-utils"
import Image from "next/image"
import { urlFor } from '../../lib/sanity'
import { portableTextComponents } from "../../components/portable-text"
import { PortableText } from '@portabletext/react'
import BlogLayout from "../../components/Blog/BlogLayout"
import CommentSection from "../../components/Blog/CommentSection"
import CategorySidebar from "../../components/Blog/CategorySidebar"
import SearchBar from "../../components/Blog/SearchBar"
import { BsCalendar, BsHeart, BsBookmark, BsShare, BsArrowLeft } from "react-icons/bs"
import Link from "next/link"
import Head from "next/head"
import moment from "moment"
import { BlogThemeProvider, useBlogTheme } from "../../contexts/BlogThemeContext"

const BlogPostContent = ({ blog }) => {
  const { theme } = useBlogTheme()
  
  // Handle case where blog is null or undefined
  if (!blog) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Blog post not found</h1>
          <Link href="/Blog">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors">
              Back to Blog
            </button>
          </Link>
        </div>
      </div>
    )
  }
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.blogTitle || 'Blog Post',
          text: blog?.blogExcerpt || 'Check out this blog post',
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  // Simplified sidebar for individual post
  const sidebarContent = (
    <div>
      <SearchBar onSearch={() => {}} placeholder="Search other articles..." />
      <div className={`rounded-lg border p-6 ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <h3 className={`font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Article Info</h3>
        
        {/* Author info */}
        {blog?.author && (
          <div className="flex items-center mb-4 pb-4 border-b border-gray-700">
            {blog.author.authorImage && (
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <Image
                  src={urlFor(blog.author.authorImage).url()}
                  alt={blog.author.authorName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <p className={`font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{blog.author.authorName}</p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Author</p>
            </div>
          </div>
        )}

        {/* Categories */}
        {blog?.blogCategories && blog.blogCategories.length > 0 && (
          <div className={`mb-4 pb-4 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <p className={`text-sm mb-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Categories</p>
            <div className="flex flex-wrap gap-2">
              {blog.blogCategories.map((category, idx) => (
                <span key={idx} className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded">
                  {category.category || 'Category'}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {blog?.blogTags && blog.blogTags.length > 0 && (
          <div className="mb-4">
            <p className={`text-sm mb-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Tags</p>
            <div className="flex flex-wrap gap-2">
              {blog.blogTags.map((tag, idx) => (
                <span key={idx} className="text-orange-400 text-xs hover:text-orange-300 cursor-pointer">
                  #{tag.tag || 'tag'}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share button */}
        <button
          onClick={handleShare}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <BsShare size={16} />
          <span>Share Article</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <Head>
        <title>{blog?.blogTitle || 'Blog Post'}</title>
        <meta name="description" content={blog?.blogExcerpt || ''} />
        <meta property="og:title" content={blog?.blogTitle || 'Blog Post'} />
        <meta property="og:description" content={blog?.blogExcerpt || ''} />
        {blog?.blogImage && <meta property="og:image" content={urlFor(blog.blogImage).url()} />}
        <meta property="og:type" content="article" />
      </Head>

      <BlogLayout sidebar={sidebarContent}>
        <article className="prose prose-invert max-w-none">
          {/* Back button */}
          <div className="mb-6">
            <Link href="/Blog">
              <button className={`flex items-center space-x-2 transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}>
                <BsArrowLeft size={16} />
                <span>Back to Blog</span>
              </button>
            </Link>
          </div>

          {/* Article header */}
          <header className="mb-8">
            <h1 className={`text-4xl font-bold mb-4 leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {blog?.blogTitle || 'Untitled Post'}
            </h1>
            
            <div className={`flex items-center space-x-6 text-sm mb-6 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <div className="flex items-center space-x-2">
                <BsCalendar size={14} />
                <span>{blog?.date ? moment(blog.date).format("MMMM DD, YYYY") : 'No date'}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 hover:text-red-400 transition-colors">
                  <BsHeart size={16} />
                  <span>70</span>
                </button>
                
                <button className="flex items-center space-x-1 hover:text-orange-400 transition-colors">
                  <BsBookmark size={16} />
                  <span>Save</span>
                </button>
              </div>
            </div>
            
            {blog?.blogExcerpt && (
              <p className={`text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {blog.blogExcerpt}
              </p>
            )}
          </header>

          {/* Featured image */}
          {blog?.blogImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <Image
                src={urlFor(blog.blogImage).url()}
                alt={blog?.blogTitle || 'Blog image'}
                width={800}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          )}

          {/* Article content */}
          {blog?.blogText && (
            <div className={`leading-relaxed blog-content ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <PortableText 
                value={blog.blogText} 
                components={{
                  ...portableTextComponents,
                  block: {
                    ...portableTextComponents?.block,
                    normal: ({ children }) => (
                      <p className={`mb-4 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>{children}</p>
                    ),
                    h1: ({ children }) => (
                      <h1 className={`text-3xl font-bold mb-6 mt-8 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className={`text-2xl font-bold mb-4 mt-6 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className={`text-xl font-bold mb-3 mt-5 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{children}</h3>
                    ),
                  }
                }} 
              />
            </div>
          )}
        </article>

        {/* Comments section */}
        <CommentSection postId={blog?.slug?.current} />
      </BlogLayout>
    </>
  )
}

export async function getServerSideProps(context) {
  const { id: slug = "" } = context.params

  try {
    const blog = await getBlog(slug)
    
    // If blog is not found, return null
    if (!blog) {
      return {
        props: {
          blog: null,
        },
      }
    }

    return {
      props: {
        blog,
      },
    }
  } catch (error) {
    console.error('Error fetching blog:', error)
    return {
      props: {
        blog: null,
      },
    }
  }
}

const Blog = (props) => {
  return (
    <BlogThemeProvider>
      <BlogPostContent {...props} />
    </BlogThemeProvider>
  )
}

export default Blog
