import Image from "next/image"
import React, { useState, useRef } from "react"
import ReCAPTCHA from "react-google-recaptcha"


const ratingQuestions = [
    { text: "How would you rate the booking process?", name: "booking" },
    { text: "How would you rate the communication?", name:"communication" },
    { text: "How would you rate the punctuality?", name:"punctuality" },
    { text: "How would you rate the professionalism?", name:"professionalism" }
];

const ReviewForm = ({setIsModalOpen}) => {

    const [selectedEmoji, setSelectedEmoji] = useState(null)
    const [review, setReview] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false);
    const [ratings, setRatings] = useState(Array(4).fill(1));
    const [finalized, setFinalized] = useState(null);
    const recaptchaRef = useRef(null);
    
    const [lastSubmissionTime, setLastSubmissionTime] = useState(0)
  
    const emojis = [
      { icon: "😠", sentiment: "angry" },
      { icon: "😕", sentiment: "unhappy" },
      { icon: "😐", sentiment: "neutral" },
      { icon: "🙂", sentiment: "happy" },
      { icon: "😄", sentiment: "very happy" },
    ]
  
    const handleRatingChange = (index, value) => {
      const newRatings = [...ratings];
      newRatings[index] = value;
      setRatings(newRatings);
  };

    const handleOk = async () => {
        // Check for rapid submissions (1 minute cooldown)
        const now = Date.now()
        if (now - lastSubmissionTime < 60000) {
          setError("Please wait a minute before submitting another review");
          return;
        }
    
        if (!selectedEmoji) {
    
          setErrors({emoji: "Please select an emoji"});
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
          // setError("Please verify that you are human");
          // return;
        }
    
        setIsSubmitting(true);
        setError("");
        setErrors({})
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
              finalized: finalized,
              booking: ratings[0],
              communication: ratings[1],
              punctuality: ratings[2],
              professionalism: ratings[3],
              sentiment: selectedEmoji,
              review: review.trim(),
              recaptchaToken: recaptchaValue,
            }),
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
          }
    
    
          // send mail
          const formatMessageContent = () => {
                const message = `
                  New Review:
                  Name: ${name}
                  Email: ${email}
                  sentiment: ${selectedEmoji}
                  Finalized Moving: ${finalized}
                  Booking: ${ratings[0]}/5,
                  Communication: ${ratings[1]}/5,
                  Punctuality: ${ratings[2]}/5,
                  Professionalism: ${ratings[3]}/5,
                  Review: ${review}
                `;
                return message;
              }
          const messageContent = formatMessageContent();
          const emailResponse = await fetch("/api/sendEmail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: "sales@taylorea.com",
              message: messageContent,
              recaptchaToken: "recaptchaToken"
            }),
          });
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
        setErrors({})
        setSuccess(false)
      }
    return (
        <>
           <div className='p-6'>
          <h2 className='text-2xl font-bold text-center mb-6'>
            Share Your Experience
          </h2>

          <div className='flex justify-center gap-8 mb-6'>
            {emojis.map((emoji, index) => (
              <div 
                key={index} 
                className={`${selectedEmoji == emoji?.sentiment ? "border border-red-500 p-1 rounded-md " : ''} flex-col items-center gap-2`}
              >
                <button
                  onClick={() => setSelectedEmoji(emoji.sentiment)}
                  className={`opacity-60 text-3xl transition-transform hover:scale-110 ${
                    selectedEmoji === emoji.sentiment ? "scale-130 opacity-100" : ""
                  }`}>
                  {emoji.icon}
                </button>
                <div className="text-xs text-gray-600 capitalize">
                  {emoji.sentiment}
                </div>
              </div>
            ))}
            
          </div>
          {errors?.emoji && <div className="text-red-500">{errors?.emoji}</div>}


          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Your Name'
            className='w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#DB421B]'
          />

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Your Email'
            className='w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-[#DB421B]'
          />


          <div className="mb-6">
            <p className="mb-2 font-medium">Was the Moving finalized?</p>
            <div className="flex gap-6">
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="finalized"
                        value="Yes"
                        onChange={() => setFinalized("Yes")}
                    />
                    Yes
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="finalized"
                        value="No"
                        onChange={() => setFinalized("No")}
                    />
                    No
                </label>
            </div>
            </div>
            

            {/* Satisfaction Ratings */}
            {ratingQuestions.map((question, index) => (
                <div key={index} className="mb-6">
                    <p className="mb-2 font-medium">{question.text}</p>
                    <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <label key={num} className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name={`rating-${index}`}
                                    value={num}
                                    onChange={() => handleRatingChange(index, num)}
                                />
                                {num}
                            </label>
                        ))}
                    </div>
                </div>
            ))}
          <div>

          </div>
          <textarea
            required
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
        </>
    )
}
export default React.memo(ReviewForm);