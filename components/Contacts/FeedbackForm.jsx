import React, { useMemo, useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"

const ratingAreas = [
  "Ease in contacting Taylor Movers",
  "Timely response to your inquiry",
  "Courteous service",
  "Movers’ communication",
  "Movers’ timekeeping",
  "Professionalism",
  "Handling of your belongings",
  "Cleanliness / appearance",
  "Value for money",
  "Overall experience",
]

const FeedbackForm = () => {
  const [moveTypes, setMoveTypes] = useState({
    Home: false,
    Office: false,
    International: false,
    Storage: false,
    Other: false,
  })
  const [moveTypeOther, setMoveTypeOther] = useState("")
  const [completed, setCompleted] = useState("")
  const [ratings, setRatings] = useState(() => ratingAreas.map(() => 3))
  const [enjoyedMost, setEnjoyedMost] = useState("")
  const [improve, setImprove] = useState("")
  const [nps, setNps] = useState(0)
  const [expectations, setExpectations] = useState("")
  const [heardAbout, setHeardAbout] = useState("")
  const [heardOther, setHeardOther] = useState("")
  const [followUp, setFollowUp] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactInfo, setContactInfo] = useState("")
  const [testimonialConsent, setTestimonialConsent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0)
  const recaptchaRef = useRef(null)

  const selectedMoveTypes = useMemo(() => {
    const types = Object.keys(moveTypes).filter((k) => moveTypes[k])
    if (moveTypes.Other && moveTypeOther.trim()) return types.map(t => (t === "Other" ? `Other: ${moveTypeOther.trim()}` : t))
    return types
  }, [moveTypes, moveTypeOther])

  const handleMoveTypeToggle = (key) => {
    setMoveTypes((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleRatingChange = (index, value) => {
    setRatings((prev) => prev.map((v, i) => (i === index ? value : v)))
  }

  const validate = () => {
    if (selectedMoveTypes.length === 0) return "Please select at least one move type"
    if (!completed) return "Please indicate whether your move was completed"
    if (!enjoyedMost.trim()) return "Please tell us what you enjoyed most"
    if (!improve.trim()) return "Please share what we could improve"
    if (nps < 1 || nps > 10) return "Please select how likely you are to refer us (1–10)"
    if (!expectations) return "Please tell us if we met your expectations"
    if (!heardAbout) return "Please indicate how you heard about us"
    if (followUp === "Yes" && (!contactName.trim() || !contactInfo.trim())) return "Please provide your name and contact details for follow-up"
    if (!testimonialConsent) return "Please indicate testimonial permission"
    return ""
  }

  const formatMessage = (recaptchaToken) => {
    const lines = []
    lines.push("New Customer Feedback Submission")
    lines.push("")
    lines.push(`Move Type(s): ${selectedMoveTypes.join(", ") || "N/A"}`)
    lines.push(`Move Completed: ${completed || "N/A"}`)
    lines.push("")
    lines.push("Ratings (1–5):")
    ratingAreas.forEach((area, idx) => {
      lines.push(`- ${area}: ${ratings[idx]}`)
    })
    lines.push("")
    lines.push("Enjoyed Most:")
    lines.push(enjoyedMost.trim())
    lines.push("")
    lines.push("Improvements:")
    lines.push(improve.trim())
    lines.push("")
    lines.push(`Referral Likelihood (1–10): ${nps}`)
    lines.push(`Expectations: ${expectations}`)
    lines.push("")
    lines.push(`Heard About Us: ${heardAbout}${heardAbout === "Other" && heardOther.trim() ? ` — ${heardOther.trim()}` : ""}`)
    lines.push(`Manager Follow-up: ${followUp}`)
    if (followUp === "Yes") {
      lines.push(`Contact Name: ${contactName.trim()}`)
      lines.push(`Contact Details: ${contactInfo.trim()}`)
    }
    lines.push(`Testimonial Permission: ${testimonialConsent}`)
    lines.push("")
    lines.push(`reCAPTCHA: ${recaptchaToken ? "verified" : "not provided"}`)
    return lines.join("\n")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    const err = validate()
    if (err) {
      setError(err)
      return
    }

    // Check for rapid submissions (2 minutes cooldown)
    const now = Date.now()
    if (now - lastSubmissionTime < 120000) {
      const remainingTime = Math.ceil((120000 - (now - lastSubmissionTime)) / 1000);
      setError(`Please wait ${remainingTime} seconds before submitting another feedback`);
      return;
    }

    setSubmitting(true)
    try {
      const token = await recaptchaRef.current.executeAsync()
      if (!token) {
        throw new Error('Please verify that you are human')
      }

      const message = formatMessage(token)
      const resp = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "marykc@taylorea.com,stephaniem@taylorea.com",
          message,
          recaptchaToken: token,
        }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.message || "Failed to submit feedback")
      
      setLastSubmissionTime(now)
      setSuccess(true)
      // Reset minimal fields after success
      setMoveTypes({ Home: false, Office: false, International: false, Storage: false, Other: false })
      setMoveTypeOther("")
      setCompleted("")
      setRatings(ratingAreas.map(() => 3))
      setEnjoyedMost("")
      setImprove("")
      setNps(0)
      setExpectations("")
      setHeardAbout("")
      setHeardOther("")
      setFollowUp("")
      setContactName("")
      setContactInfo("")
      setTestimonialConsent("")
    } catch (e1) {
      setError(e1.message)
    } finally {
      setSubmitting(false)
      recaptchaRef.current?.reset()
      setTimeout(() => setSuccess(false), 2500)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <h3 className="text-xl font-bold text-[#FF5000] mb-2">About Your Move</h3>
          <div className="flex flex-wrap gap-4">
            {Object.keys(moveTypes).map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={moveTypes[key]} onChange={() => handleMoveTypeToggle(key)} />
                {key}
              </label>
            ))}
          </div>
          {moveTypes.Other && (
            <input
              type="text"
              value={moveTypeOther}
              onChange={(e) => setMoveTypeOther(e.target.value)}
              placeholder="Specify other"
              className="mt-3 w-full p-2 border rounded-lg"
            />
          )}
          <div className="mt-4">
            <div className="mb-2 font-medium">Was your move completed?</div>
            <div className="flex gap-6 text-sm">
              {[
                { v: "Yes" },
                { v: "No" },
              ].map((o) => (
                <label key={o.v} className="flex items-center gap-2">
                  <input type="radio" name="completed" value={o.v} checked={completed === o.v} onChange={() => setCompleted(o.v)} />
                  {o.v}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#FF5000] mb-2">Rate Your Experience</h3>
          <div className="space-y-4">
            {ratingAreas.map((area, idx) => (
              <div key={area} className="grid grid-cols-1 md:grid-cols-2 items-center gap-3">
                <div className="text-sm text-gray-700">{area}</div>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label key={n} className="flex items-center gap-1 text-sm">
                      <input type="radio" name={`rating-${idx}`} value={n} checked={ratings[idx] === n} onChange={() => handleRatingChange(idx, n)} />
                      {n}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#FF5000] mb-2">Your Feedback</h3>
          <textarea
            value={enjoyedMost}
            onChange={(e) => setEnjoyedMost(e.target.value)}
            placeholder="What did you enjoy most about your moving experience?"
            className="w-full p-3 border rounded-lg mb-4"
            rows={4}
          />
          <textarea
            value={improve}
            onChange={(e) => setImprove(e.target.value)}
            placeholder="Is there anything we could have done to make your move smoother?"
            className="w-full p-3 border rounded-lg"
            rows={4}
          />
        </div>

        <div>
          <div className="mb-2 font-medium">How likely are you to refer us to friends or colleagues? (1–10)</div>
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <label key={i + 1} className="flex items-center gap-1 text-sm">
                <input type="radio" name="nps" value={i + 1} checked={nps === i + 1} onChange={() => setNps(i + 1)} />
                {i + 1}
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 font-medium">Did your experience meet your expectations?</div>
          <div className="flex gap-6 text-sm">
            {["Exceeded", "Met", "Fell below"].map((v) => (
              <label key={v} className="flex items-center gap-2">
                <input type="radio" name="expectations" value={v} checked={expectations === v} onChange={() => setExpectations(v)} />
                {v}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#FF5000] mb-2">How did you hear about us?</h3>
          <div className="flex flex-wrap gap-6 text-sm">
            {["Referral", "Online", "Saw our truck", "Other"].map((v) => (
              <label key={v} className="flex items-center gap-2">
                <input type="radio" name="heard" value={v} checked={heardAbout === v} onChange={() => setHeardAbout(v)} />
                {v}
              </label>
            ))}
          </div>
          {heardAbout === "Other" && (
            <input
              type="text"
              value={heardOther}
              onChange={(e) => setHeardOther(e.target.value)}
              placeholder="Please specify"
              className="mt-3 w-full p-2 border rounded-lg"
            />
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#FF5000] mb-2">Follow-up (Optional)</h3>
          <div className="mb-2 font-medium">Would you like a manager to contact you about your feedback?</div>
          <div className="flex gap-6 text-sm">
            {["Yes", "No"].map((v) => (
              <label key={v} className="flex items-center gap-2">
                <input type="radio" name="followup" value={v} checked={followUp === v} onChange={() => setFollowUp(v)} />
                {v}
              </label>
            ))}
          </div>
          {followUp === "Yes" && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Your Name"
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Phone or Email"
                className="w-full p-2 border rounded-lg"
              />
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 font-medium">May we use your comments as a testimonial?</div>
          <div className="flex gap-6 text-sm">
            {["Yes", "No"].map((v) => (
              <label key={v} className="flex items-center gap-2">
                <input type="radio" name="testimonial" value={v} checked={testimonialConsent === v} onChange={() => setTestimonialConsent(v)} />
                {v}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">Thank you! Your feedback has been submitted.</div>}

        <div className="flex justify-end">
          <button type="submit" disabled={submitting} className="px-6 py-3 bg-[#FF5000] text-white rounded-full disabled:opacity-50">
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </form>
  )
}

export default FeedbackForm


