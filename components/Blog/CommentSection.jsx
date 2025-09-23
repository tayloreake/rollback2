import React, { useState } from 'react'
import { BsHeart, BsReply, BsThreeDots } from 'react-icons/bs'
import Image from 'next/image'

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: {
        name: 'Sarah Johnson',
        avatar: '/assets/avatar1.png',
        isVerified: true
      },
      content: 'Great article! The tips about packing fragile items were really helpful for our recent move.',
      timestamp: '2 hours ago',
      likes: 12,
      replies: [
        {
          id: 2,
          author: {
            name: 'Mike Chen',
            avatar: '/assets/avatar2.png',
            isVerified: false
          },
          content: 'I agree! The bubble wrap technique saved my grandmother\'s china set.',
          timestamp: '1 hour ago',
          likes: 5
        }
      ]
    },
    {
      id: 3,
      author: {
        name: 'David Rodriguez',
        avatar: '/assets/avatar3.png',
        isVerified: false
      },
      content: 'Would love to see more content about long-distance moving. Any tips for moving across states?',
      timestamp: '4 hours ago',
      likes: 8,
      replies: []
    }
  ])

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
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-white text-sm">{comment.author.name}</span>
            {comment.author.isVerified && (
              <span className="text-blue-400 text-xs">✓</span>
            )}
            <span className="text-gray-400 text-xs">{comment.timestamp}</span>
          </div>
          <p className="text-gray-300 text-sm">{comment.content}</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-2 text-xs">
          <button className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors">
            <BsHeart size={12} />
            <span>{comment.likes}</span>
          </button>
          
          {!isReply && (
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <BsReply size={12} />
              <span>Reply</span>
            </button>
          )}
          
          <button className="text-gray-400 hover:text-white transition-colors">
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
                className="flex-1 bg-gray-700 text-white placeholder-gray-400 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
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
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mt-8">
      <h3 className="text-white font-semibold mb-6 flex items-center">
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
              className="w-full bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-lg resize-none outline-none focus:ring-2 focus:ring-orange-500"
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
            <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
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