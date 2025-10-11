import React, { useState } from 'react'
import { BsHeart, BsReply, BsThreeDots } from 'react-icons/bs'
import Image from 'next/image'
import { useBlogTheme } from '../../contexts/BlogThemeContext'

const CommentSection = ({ postId }) => {
  const { theme } = useBlogTheme()
  
  // Generate realistic Kenyan comments based on postId
  const generateComments = (postId) => {
    // Kenyan names pool
    const kenyanNames = [
      { name: 'Wanjiku Maina', verified: true },
      { name: 'Brian Kipchoge', verified: false },
      { name: 'Grace Achieng', verified: true },
      { name: 'Joseph Kariuki', verified: false },
      { name: 'Faith Njeri', verified: false },
      { name: 'Daniel Omondi', verified: true },
      { name: 'Mary Wambui', verified: false },
      { name: 'Peter Mutua', verified: false },
      { name: 'Rose Chebet', verified: true },
      { name: 'Samuel Otieno', verified: false },
      { name: 'Lucy Wanjiru', verified: false },
      { name: 'James Kamau', verified: true },
      { name: 'Catherine Akinyi', verified: false },
      { name: 'David Mwangi', verified: false },
      { name: 'Anne Mumbi', verified: true },
      { name: 'John Kimani', verified: false },
      { name: 'Esther Wangari', verified: false },
      { name: 'Michael Okello', verified: true },
      { name: 'Jane Moraa', verified: false },
      { name: 'Patrick Onyango', verified: false }
    ]
    
    // Realistic moving-related comments from Kenyan perspective
    const commentPool = [
      { text: 'Taylor Movers helped us relocate from Nairobi to Mombasa. Their service was exceptional! Highly recommend.', likes: 18 },
      { text: 'We used their services for our office move from Westlands to Karen. Professional team, very careful with our equipment.', likes: 24 },
      { text: 'Moving from Kileleshwa to Runda was stress-free thanks to Taylor Movers. They handled everything perfectly!', likes: 15 },
      { text: 'Best moving company in Kenya! They moved our 4-bedroom house without a single item damaged. Asante sana!', likes: 32 },
      { text: 'I was relocating to Dubai and Taylor Movers handled all the international logistics. Worth every shilling!', likes: 28 },
      { text: 'Affordable rates and excellent service. Moved from Ngong Road to Kilimani smoothly.', likes: 12 },
      { text: 'Their packing service is top-notch. They wrapped everything so carefully, especially our electronics.', likes: 20 },
      { text: 'We hired them for our company relocation. Very professional crew and they finished ahead of schedule!', likes: 16 },
      { text: 'Moving from Lang\'ata to Donholm was made easy. The team was punctual and very respectful.', likes: 14 },
      { text: 'I appreciate how they handled my grandmother\'s antique furniture during our move from Parklands to South C.', likes: 22 },
      { text: 'Taylor Movers are the real deal. No hidden charges, just honest service. Used them twice already!', likes: 19 },
      { text: 'Their customer service is excellent. They kept us updated throughout the entire moving process.', likes: 17 },
      { text: 'Moved our shop from town to Thika Road Mall. They were careful with all our stock. Highly professional!', likes: 13 },
      { text: 'International move to London was seamless. All paperwork handled efficiently. Great experience!', likes: 26 },
      { text: 'Very reliable company. We moved from a 3-bedroom apartment and they even helped with unpacking!', likes: 21 },
      { text: 'The team arrived on time, worked fast, and everything arrived safely at our new home in Kitisuru.', likes: 25 },
      { text: 'Best decision we made for our move from Kasarani to Syokimau. Professional and affordable!', likes: 11 },
      { text: 'They moved our piano without any issues! Very skilled team. Thanks Taylor Movers!', likes: 29 },
      { text: 'Corporate relocation from Upper Hill to Gigiri went smoothly. Zero downtime for our business.', likes: 23 },
      { text: 'Used them for storage services while we were house hunting. Very secure facility and reasonable prices.', likes: 16 }
    ]
    
    const replyPool = [
      { text: 'I had the same experience! They are very professional.', likes: 5 },
      { text: 'Good to know! Will definitely consider them for my upcoming move.', likes: 7 },
      { text: 'How much did they charge? Planning to move soon.', likes: 4 },
      { text: 'Thanks for the recommendation! Will contact them.', likes: 6 },
      { text: 'Their insurance coverage is also comprehensive, which gave us peace of mind.', likes: 8 },
      { text: 'I agree! They handled our fragile items with great care.', likes: 5 },
      { text: 'Customer service is really important. Glad they exceeded expectations!', likes: 3 },
      { text: 'Did they also help with packing materials?', likes: 4 },
      { text: 'How long did the entire process take?', likes: 2 },
      { text: 'Will share this with my friends who are relocating!', likes: 6 }
    ]
    
    // Generate a hash from postId to ensure consistency
    const hash = postId ? postId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0
    
    // Determine number of comments (3-8 comments per post)
    const numComments = (hash % 6) + 3
    
    const comments = []
    
    for (let i = 0; i < numComments; i++) {
      const nameIndex = (hash + i) % kenyanNames.length
      const commentIndex = (hash + i * 3) % commentPool.length
      const person = kenyanNames[nameIndex]
      const comment = commentPool[commentIndex]
      
      // Determine timestamp variety
      const timeOptions = ['2 hours ago', '5 hours ago', '1 day ago', '2 days ago', '3 days ago', '1 week ago']
      const timeIndex = (hash + i * 2) % timeOptions.length
      
      // Decide if this comment should have replies (30% chance)
      const hasReplies = (hash + i) % 10 < 3
      const replies = []
      
      if (hasReplies) {
        const numReplies = ((hash + i) % 2) + 1 // 1-2 replies
        for (let j = 0; j < numReplies; j++) {
          const replyNameIndex = (hash + i + j + 10) % kenyanNames.length
          const replyIndex = (hash + i + j) % replyPool.length
          const replyPerson = kenyanNames[replyNameIndex]
          const replyComment = replyPool[replyIndex]
          const replyTimeIndex = (hash + i + j) % 4
          const replyTimes = ['30 min ago', '1 hour ago', '3 hours ago', '5 hours ago']
          
          replies.push({
            id: 1000 + i * 10 + j,
            author: {
              name: replyPerson.name,
              avatar: `/assets/avatar${(replyNameIndex % 3) + 1}.png`,
              isVerified: replyPerson.verified
            },
            content: replyComment.text,
            timestamp: replyTimes[replyTimeIndex],
            likes: replyComment.likes
          })
        }
      }
      
      comments.push({
        id: i + 1,
        author: {
          name: person.name,
          avatar: `/assets/avatar${(nameIndex % 3) + 1}.png`,
          isVerified: person.verified
        },
        content: comment.text,
        timestamp: timeOptions[timeIndex],
        likes: comment.likes,
        replies: replies
      })
    }
    
    return comments
  }
  
  const [comments, setComments] = useState(() => generateComments(postId))

  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: Date.now(),
      author: {
        name: 'You',
        avatar: '/assets/default-avatar.png',
        isVerified: false
      },
      content: newComment,
      timestamp: 'Just now',
      likes: 0,
      replies: []
    }

    setComments([comment, ...comments])
    setNewComment('')
  }

  const handleAddReply = (commentId) => {
    if (!replyText.trim()) return

    const reply = {
      id: Date.now(),
      author: {
        name: 'You',
        avatar: '/assets/default-avatar.png',
        isVerified: false
      },
      content: replyText,
      timestamp: 'Just now',
      likes: 0
    }

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, reply]
        }
      }
      return comment
    }))

    setReplyText('')
    setReplyingTo(null)
  }

  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`flex space-x-3 ${isReply ? 'ml-12 mt-3' : 'mb-6'}`}>
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
          <Image
            src={comment.author.avatar}
            alt={comment.author.name}
            width={32}
            height={32}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.name)}&background=6b7280&color=ffffff&size=32`
            }}
          />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className={`rounded-lg p-3 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <div className="flex items-center space-x-2 mb-1">
            <span className={`font-medium text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{comment.author.name}</span>
            {comment.author.isVerified && (
              <span className="text-blue-400 text-xs">✓</span>
            )}
            <span className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>{comment.timestamp}</span>
          </div>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>{comment.content}</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-2 text-xs">
          <button className={`flex items-center space-x-1 transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-red-400'
              : 'text-gray-500 hover:text-red-500'
          }`}>
            <BsHeart size={12} />
            <span>{comment.likes}</span>
          </button>
          
          {!isReply && (
            <button
              onClick={() => setReplyingTo(comment.id)}
              className={`flex items-center space-x-1 transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-blue-400'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              <BsReply size={12} />
              <span>Reply</span>
            </button>
          )}
          
          <button className={`transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-500 hover:text-gray-900'
          }`}>
            <BsThreeDots size={12} />
          </button>
        </div>

        {/* Reply form */}
        {replyingTo === comment.id && (
          <div className="mt-3 ml-0">
            <div className="flex space-x-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.author.name}...`}
                className={`flex-1 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white placeholder-gray-400'
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
                onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment.id)}
              />
              <button
                onClick={() => handleAddReply(comment.id)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Reply
              </button>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className={`rounded-lg border p-6 mt-8 ${
      theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <h3 className={`font-semibold mb-6 flex items-center ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        <BsReply className="mr-2 text-orange-400" size={18} />
        Comments ({comments.length})
      </h3>

      {/* Add comment form */}
      <form onSubmit={handleAddComment} className="mb-8">
        <div className="flex space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
            <Image
              src="/assets/default-avatar.png"
              alt="Your avatar"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://ui-avatars.com/api/?name=You&background=6b7280&color=ffffff&size=32"
              }}
            />
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className={`w-full px-4 py-3 rounded-lg resize-none outline-none focus:ring-2 focus:ring-orange-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white placeholder-gray-400'
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500'
              }`}
              rows="3"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                disabled={!newComment.trim()}
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments list */}
      <div>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>

      {/* Load more comments */}
      {comments.length > 0 && (
        <div className="text-center mt-6">
          <button className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
            Load more comments
          </button>
        </div>
      )}
    </div>
  )
}

export default CommentSection