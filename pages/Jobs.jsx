import React, { useState, useRef } from "react"
import Head from "next/head"
import Jumbotron from "../components/jumbotron"
import getPageMetadata from "../SEO/seo"
import { BsCheckCircle, BsPeople, BsClock, BsGeoAlt } from "react-icons/bs"
import { FaTruck, FaBoxes, FaUsers, FaHeadset } from "react-icons/fa"
import ReCAPTCHA from "react-google-recaptcha"

const Jobs = () => {
  // Get SEO metadata
  const seoData = getPageMetadata("jobs", {
    customTitle: 'Jobs at Taylor Movers Kenya | Join Our Moving Team',
    customDescription: 'Join Taylor Movers Kenya team! We offer competitive benefits and growth opportunities. Apply for moving, logistics, and customer service positions.',
    includeLocalBusiness: false,
    includeService: false
  })

  const [selectedJob, setSelectedJob] = useState(null)

  const jobOpenings = [
    {
      id: 1,
      title: "Moving Crew Member",
      department: "Operations",
      location: "Nairobi, Kenya",
      type: "Full-time",
      icon: <FaTruck className="text-[#FF5000]" size={24} />,
      description: "Join our professional moving crew and help families and businesses relocate safely.",
      requirements: [
        "Physical fitness and ability to lift heavy items",
        "Good communication skills",
        "Reliable and punctual",
        "Previous moving experience preferred but not required",
        "Valid ID and clean background check"
      ],
      responsibilities: [
        "Pack and load household/office items safely",
        "Transport items to destination",
        "Unpack and arrange items as requested",
        "Maintain professional appearance and attitude",
        "Follow safety protocols"
      ]
    },
    {
      id: 2,
      title: "Logistics Coordinator",
      department: "Operations",
      location: "Nairobi, Kenya",
      type: "Full-time",
      icon: <FaBoxes className="text-[#FF5000]" size={24} />,
      description: "Coordinate moving schedules, routes, and ensure smooth operations.",
      requirements: [
        "Diploma in Logistics, Business, or related field",
        "2+ years experience in logistics or operations",
        "Strong organizational and communication skills",
        "Proficiency in MS Office and logistics software",
        "Problem-solving abilities"
      ],
      responsibilities: [
        "Schedule and coordinate moving assignments",
        "Optimize routes and resource allocation",
        "Communicate with clients and crew members",
        "Track inventory and equipment",
        "Ensure compliance with safety standards"
      ]
    },
    {
      id: 3,
      title: "Customer Service Representative",
      department: "Customer Service",
      location: "Nairobi, Kenya",
      type: "Full-time",
      icon: <FaHeadset className="text-[#FF5000]" size={24} />,
      description: "Provide excellent customer service and support to our clients.",
      requirements: [
        "Diploma in Business, Communications, or related field",
        "1+ years customer service experience",
        "Excellent verbal and written communication",
        "Computer literacy",
        "Patience and problem-solving skills"
      ],
      responsibilities: [
        "Handle customer inquiries and bookings",
        "Provide quotes and service information",
        "Resolve customer complaints professionally",
        "Maintain customer records and follow-ups",
        "Support sales and marketing activities"
      ]
    },
    {
      id: 4,
      title: "Team Leader - Moving Operations",
      department: "Operations",
      location: "Nairobi, Kenya",
      type: "Full-time",
      icon: <FaUsers className="text-[#FF5000]" size={24} />,
      description: "Lead and supervise moving crews while ensuring quality service delivery.",
      requirements: [
        "3+ years experience in moving or logistics",
        "Leadership and team management experience",
        "Strong communication and organizational skills",
        "Valid driving license",
        "Knowledge of safety regulations"
      ],
      responsibilities: [
        "Lead and supervise moving crews",
        "Ensure quality service delivery",
        "Train new team members",
        "Coordinate with logistics team",
        "Handle complex customer situations"
      ]
    }
  ]

  const benefits = [
    "Competitive salary packages",
    "Health insurance coverage",
    "Paid annual leave",
    "Training and development opportunities",
    "Performance bonuses",
    "Career advancement opportunities",
    "Friendly work environment",
    "Transportation allowance"
  ]

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonical} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:type" content={seoData.openGraph.type} />
        <meta property="og:url" content={seoData.openGraph.url} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={seoData.twitter.card} />
        <meta name="twitter:title" content={seoData.twitter.title} />
        <meta name="twitter:description" content={seoData.twitter.description} />
      </Head>

      {/* Spacer for fixed navbar */}
      <div className="h-[100px] md:h-[80px]"></div>

      <Jumbotron 
        image={"taylor-movers-kenya-packing-boxes.png"} 
        text={"Join Our Team - Build Your Career with Taylor Movers"} 
        alt={"Jobs at Taylor Movers Kenya - Join our professional moving team"} 
      />

      <div className='container pt-12 pb-12'>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FF5000] mb-4">
            Jobs at Taylor Movers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join Kenya's leading moving company and build a rewarding career with us. 
            We offer competitive benefits, professional growth opportunities, and a supportive work environment.
          </p>
        </div>

        {/* Why Work With Us Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-[#FF5000] to-[#FF8A50] rounded-2xl py-12 px-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Why Work With Taylor Movers?</h2>
              <p className="text-lg opacity-90">
                We believe our employees are our greatest asset. Here's what we offer:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <BsCheckCircle className="text-white flex-shrink-0" size={20} />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Job Openings Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#FF5000] mb-4">Current Job Openings</h2>
            <p className="text-lg text-gray-600">
              Explore our available positions and find the perfect role for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {jobOpenings.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {job.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h3>
                    <p className="text-[#FF5000] font-medium mb-2">{job.department}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{job.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <BsGeoAlt className="text-gray-400" />
                    <span className="text-gray-600">{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BsClock className="text-gray-400" />
                    <span className="text-gray-600">{job.type}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedJob(job)}
                  className="w-full px-6 py-3 bg-[#FF5000] text-white font-bold rounded-full hover:bg-[#e04400] transition-colors"
                >
                  View Details & Apply
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gray-50 rounded-2xl py-12 px-8">
            <h2 className="text-3xl font-bold text-[#FF5000] mb-4">Don't See Your Perfect Role?</h2>
            <p className="text-lg text-gray-600 mb-6">
              We're always looking for talented individuals to join our team. 
              Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <button
              onClick={() => setSelectedJob({ id: 'general', title: 'General Application' })}
              className="px-8 py-4 bg-[#FF5000] text-white font-bold rounded-full hover:bg-[#e04400] transition-colors"
            >
              Submit General Application
            </button>
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}
    </>
  )
}

// Job Details Modal Component
const JobDetailsModal = ({ job, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-[#FF5000] mb-2">
                {job.title}
              </h2>
              {job.department && (
                <p className="text-gray-600">{job.department} • {job.location} • {job.type}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {job.id !== 'general' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Job Requirements</h3>
                <ul className="space-y-2 mb-6">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <BsCheckCircle className="text-[#FF5000] mt-1 flex-shrink-0" size={16} />
                      <span className="text-gray-600">{req}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-bold text-gray-800 mb-4">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <BsCheckCircle className="text-[#FF5000] mt-1 flex-shrink-0" size={16} />
                      <span className="text-gray-600">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <JobApplicationForm job={job} onClose={onClose} />
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">General Application</h3>
                <p className="text-gray-600">
                  Submit your details and we'll contact you when suitable positions become available.
                </p>
              </div>
              <JobApplicationForm job={job} onClose={onClose} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Job Application Form Component
const JobApplicationForm = ({ job, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: job.title,
    experience: '',
    coverLetter: '',
    resume: null
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0)
  const recaptchaRef = useRef(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, resume: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.coverLetter) {
      setError('Please fill in all required fields')
      return
    }

    // Check for rapid submissions (2 minutes cooldown)
    const now = Date.now()
    if (now - lastSubmissionTime < 120000) {
      const remainingTime = Math.ceil((120000 - (now - lastSubmissionTime)) / 1000);
      setError(`Please wait ${remainingTime} seconds before submitting another application`);
      return;
    }

    setSubmitting(true)
    
    try {
      // Get reCAPTCHA token
      const recaptchaToken = await recaptchaRef.current.executeAsync()
      if (!recaptchaToken) {
        throw new Error('Please verify that you are human')
      }

      // Create email message
      const message = `
New Job Application Received

Position: ${formData.position}
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Years of Experience: ${formData.experience}

Cover Letter:
${formData.coverLetter}

${formData.resume ? `Resume file attached: ${formData.resume.name}` : 'No resume file attached'}

reCAPTCHA: ${recaptchaToken ? 'verified' : 'not provided'}
      `.trim()

      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'hradmin@taylorea.com',
          subject: `Job Application - ${formData.position} - ${formData.fullName}`,
          message: message,
          recaptchaToken: recaptchaToken
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to submit application')
      }

      setLastSubmissionTime(now)
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
      recaptchaRef.current?.reset()
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <BsCheckCircle className="text-green-500 mx-auto mb-4" size={48} />
        <h3 className="text-xl font-bold text-green-600 mb-2">Application Submitted!</h3>
        <p className="text-gray-600">Thank you for your interest. We'll review your application and get back to you soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-[#FF5000] mb-4">Apply for this Position</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Years of Relevant Experience
        </label>
        <select
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
        >
          <option value="">Select experience level</option>
          <option value="0-1">0-1 years</option>
          <option value="2-3">2-3 years</option>
          <option value="4-5">4-5 years</option>
          <option value="6-10">6-10 years</option>
          <option value="10+">10+ years</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cover Letter *
        </label>
        <textarea
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleInputChange}
          rows={4}
          placeholder="Tell us why you're interested in this position and what makes you a great fit..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Resume/CV
        </label>
        <input
          type="file"
          name="resume"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
      </div>

      <div className="mb-2">
        <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-6 py-3 bg-[#FF5000] text-white rounded-full hover:bg-[#e04400] disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  )
}

export default React.memo(Jobs)