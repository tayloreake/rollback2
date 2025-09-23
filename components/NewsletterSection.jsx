import React, { useState } from 'react'

const NewsletterSection = ({ 
  title = "Stay Connected With Taylor Movers", 
  subtitle = "Be the first to receive moving tips, special offers, and updates from Kenya's trusted moving company",
  className = "",
  containerClass = "container py-20"
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState(null)

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      setNewsletterStatus({ type: 'success', message: "Thanks for subscribing! You'll hear from us soon." })
      setNewsletterEmail('')
    } catch (err) {
      setNewsletterStatus({ type: 'error', message: 'Something went wrong. Please try again.' })
    }
  };

  const handleNewsletterEmailChange = (e) => setNewsletterEmail(e.target.value);

  return (
    <div className={containerClass}>
      <div className={`bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-center ${className}`}>
        <h2 className="text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          {subtitle}
        </p>
        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
          <input
            type="email"
            required
            value={newsletterEmail}
            onChange={handleNewsletterEmailChange}
            placeholder="Enter your email"
            className="w-full sm:w-auto flex-1 px-5 py-4 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
            aria-label="Email address"
          />
          <button
            type="submit"
            className="px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-[#FF5000] to-[#FF8A50] hover:opacity-90 transition-opacity text-white"
          >
            Subscribe
          </button>
        </form>
        {newsletterStatus && (
          <div className={`mt-4 text-sm ${newsletterStatus.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
            {newsletterStatus.message}
          </div>
        )}
        <p className="mt-4 text-xs text-gray-400">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </div>
  )
}

export default NewsletterSection