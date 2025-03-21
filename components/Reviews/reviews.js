import { Modal } from "antd"
import Image from "next/image"
import React, { useState, useRef } from "react"
import ReCAPTCHA from "react-google-recaptcha"

const Reviews = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState(null)
  const [review, setReview] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const recaptchaRef = useRef(null)
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0)

  const emojis = [
    { icon: "😠", sentiment: "angry" },
    { icon: "😕", sentiment: "unhappy" },
    { icon: "😐", sentiment: "neutral" },
    { icon: "🙂", sentiment: "happy" },
    { icon: "😄", sentiment: "very happy" },
  ]

  const showModal = () => {
    setIsModalOpen(true)
    setError("")
    setSuccess(false)
  }

  const handleOk = async () => {
    // Check for rapid submissions (1 minute cooldown)
    const now = Date.now()
    if (now - lastSubmissionTime < 60000) {
      setError("Please wait a minute before submitting another review");
      return;
    }

    if (!selectedEmoji || !review.trim() || !name.trim() || !email.trim()) {
      setError("Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Verify reCAPTCHA
    const recaptchaValue = await recaptchaRef.current.executeAsync();
    if (!recaptchaValue) {
      setError("Please verify that you are human");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          sentiment: selectedEmoji,
          review: review.trim(),
          recaptchaToken: recaptchaValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
      setLastSubmissionTime(now);
      
      // Wait a moment to show success message before closing
      setTimeout(() => {
        // Reset form
        setSelectedEmoji(null);
        setReview("");
        setName("");
        setEmail("");
        setIsModalOpen(false);
        setSuccess(false);
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
      recaptchaRef.current.reset();
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setError("")
    setSuccess(false)
  }

  return (
    <div className='h-[50vh] flex items-center justify-center '>
      <div className=' h-full  w-full bg-[#DB421B] md:max-w-[100%]   flex items-center md:px-40 relative px-6'>
        <div className=''>
          <div className='flex flex-col space-y-4 z-50 '>
            <h3 className='text-3xl text-white font-bold '>Leave a Review</h3>
            <p className='font-medium text-white'>
              We would love to hear about your moving experience! Please take a
              moment to share your thoughts.
            </p>
            <button
              onClick={showModal}
              className='border-2 border-white text-white hover:bg-white hover:text-[#DB421B] text-xs rounded-full py-2 px-4 w-fit mt-4 transition-all duration-300'>
              Tell us what you think !
            </button>
          </div>

          <Image
            className='absolute bottom-0 left-[30%] z-1'
            src='/assets/Reviews/pattern.svg'
            width={120}
            height={120}
            alt='pattern'
          />
          <Image
            className='absolute top-0 right-[2%] rotate-180 z-1'
            src='/assets/Reviews/pattern.svg'
            width={120}
            height={120}
            alt='pattern'
          />
        </div>
      </div>
      <Modal
        title={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={500}>
        <div className='p-6'>
          <h2 className='text-2xl font-bold text-center mb-6'>
            Share Your Experience
          </h2>

          <div className='flex justify-center gap-8 mb-6'>
            {emojis.map((emoji, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center gap-2"
              >
                <button
                  onClick={() => setSelectedEmoji(emoji.sentiment)}
                  className={`text-3xl transition-transform hover:scale-110 ${
                    selectedEmoji === emoji.sentiment ? "scale-125" : ""
                  }`}>
                  {emoji.icon}
                </button>
                <span className="text-xs text-gray-600 capitalize">
                  {emoji.sentiment}
                </span>
              </div>
            ))}
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Your Name'
            className='w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#DB421B]'
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Your Email'
            className='w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-[#DB421B]'
          />

          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder='Tell us about your experience...'
            className='w-full p-3 border rounded-lg mb-6 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#DB421B]'
          />

          <div className="mb-6 flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            />
          </div>

          <div className='flex justify-end gap-4'>
            <button
              onClick={handleCancel}
              className='px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors'
              disabled={isSubmitting}>
              Go Back
            </button>
            <button
              onClick={handleOk}
              className='px-6 py-2 bg-[#DB421B] text-white rounded-full hover:bg-[#c13918] transition-colors disabled:opacity-50'
              disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
          {success && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-xl font-semibold text-green-600">Thank you for your review!</p>
                <p className="text-gray-600">Your feedback has been submitted successfully.</p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default Reviews
