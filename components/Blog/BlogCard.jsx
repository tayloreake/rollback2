import Image from "next/image"
import { BsCalendar, BsShare, BsHeart, BsBookmark, BsChat } from "react-icons/bs"
import { HiOutlineExternalLink } from "react-icons/hi"
import React, { useState } from "react"
import Link from "next/link"
import imageUrlBuilder from "@sanity/image-url"
import client from "../../sanity/config/client-config"
import moment from "moment"

const BlogCard = ({ blog }) => {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const builder = imageUrlBuilder(client)

  function urlFor(source) {
    return builder.image(source)
  }

  const handleShare = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.blogTitle,
          text: blog.blogExcerpt,
          url: `${window.location.origin}/Blog/${blog.slug.current}`,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/Blog/${blog.slug.current}`)
      alert('Link copied to clipboard!')
    }
  }

  const handleBookmark = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
  }

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors duration-200 group">
      <Link href={`/Blog/${blog.slug.current}`}>
        <div className="cursor-pointer">
          {/* Image */}
          <div className="relative overflow-hidden">
            <Image
              src={urlFor(blog.blogImage).url()}
              alt={blog.blogTitle}
              width={350}
              height={200}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
            />
            
            {/* Category tags overlay */}
            {blog.blogCategories && blog.blogCategories.length > 0 && (
              <div className="absolute top-3 left-3">
                {blog.blogCategories.slice(0, 2).map((category, idx) => (
                  <span key={idx} className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded mr-2 mb-1">
                    {category.category || 'Category'}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Author and Date */}
            <div className="flex items-center mb-3 text-sm text-gray-400">
              {blog.author && (
                <div className="flex items-center mr-4">
                  {blog.author.authorImage && (
                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                      <Image
                        src={urlFor(blog.author.authorImage).url()}
                        alt={blog.author.authorName}
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <span>{blog.author.authorName}</span>
                </div>
              )}
              <div className="flex items-center">
                <BsCalendar size={14} className="mr-1" />
                <span>{moment(blog.date).format("MMM DD, YYYY")}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
              {blog.blogTitle}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
              {blog.blogExcerpt}
            </p>

            {/* Tags */}
            {blog.blogTags && blog.blogTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.blogTags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="text-orange-400 text-xs hover:text-orange-300 cursor-pointer">
                    #{tag.tag || 'tag'}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center justify-between border-t border-gray-700 pt-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 text-sm transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
            }`}
          >
            <BsHeart size={16} className={isLiked ? 'fill-current' : ''} />
            <span>70</span>
          </button>
          
          <button className="flex items-center space-x-1 text-sm text-gray-400 hover:text-blue-400 transition-colors">
            <BsChat size={16} />
            <span>43</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleBookmark}
            className={`p-2 rounded transition-colors ${
              isBookmarked 
                ? 'text-orange-500 bg-orange-500/10' 
                : 'text-gray-400 hover:text-orange-400 hover:bg-gray-700'
            }`}
          >
            <BsBookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 rounded text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition-colors"
          >
            <BsShare size={16} />
          </button>
          
          <Link href={`/Blog/${blog.slug.current}`}>
            <button className="p-2 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
              <HiOutlineExternalLink size={16} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
