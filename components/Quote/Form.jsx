import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { toast } from "react-toastify"
// import { createQuote } from "../sanity/sanity-utils"
import ReCAPTCHA from "react-google-recaptcha"
import { createQuote } from "../../sanity/sanity-utils"
import useFormPersistence from "../../hooks/useFormPersistence"

// Helper function to get current date
function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Initial form data structure - defined outside component to prevent re-creation
const getInitialFormData = () => ({
  fname: "",
  email: "",
  location: "",
  destination: "",
  number: "",
  moveType: "Local House Move",
  bedrooms: "1br",
  moveDate: getCurrentDate(),
  ref: "Referal"
});

const QuoteForm = () => {
  // Memoize initial data to prevent re-creation
  const initialFormData = useMemo(() => getInitialFormData(), []);

  // Use form persistence hook with stable initial data
  const { 
    formData, 
    updateFormData, 
    clearFormData, 
    hasPersistedData 
  } = useFormPersistence('main-quote-form', initialFormData, 300);
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0)
  const [showPersistedDataNotice, setShowPersistedDataNotice] = useState(false)
  const recaptchaRef = useRef(null)
  const formRef = useRef(null)

  // Show notice if persisted data was loaded
  useEffect(() => {
    if (hasPersistedData) {
      setShowPersistedDataNotice(true)
      toast.info("Your previous form data has been restored. You can continue where you left off!", {
        autoClose: 5000,
        position: "top-center"
      })
      // Hide notice after 8 seconds
      const timer = setTimeout(() => {
        setShowPersistedDataNotice(false)
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [hasPersistedData])

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    return /^\0\d{9}$/.test(phoneNumber)
  }

  useEffect(() => {
    if (formSubmitted) {
      window.dispatchEvent(new CustomEvent("tayloreaFormSubmitted", {
        detail: { status: "success", timestamp: Date.now() }
      }));

      window.location.href = "/ThankYou";
    }
  }, [formSubmitted]);

  const isValidName = (name) => {
    return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
  };

  const isValidLocation = (location) => {
    return location.length >= 3;
  };

  const handleSendMessage = async () => {
    const tayloreaMessageContent = formatMessageContent('taylorea');
    const userMessageContent = formatMessageContent('user');

    try {
      // Check for rapid submissions (2 minutes cooldown)
      const now = Date.now()
      if (now - lastSubmissionTime < 120000) {
        const remainingTime = Math.ceil((120000 - (now - lastSubmissionTime)) / 1000);
        toast.error(`Please wait ${remainingTime} seconds before submitting another request`);
        return;
      }

      setIsSubmitting(true);

      // Create timeout promise for all operations
      const createTimeoutPromise = (ms) => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timeout')), ms)
      );

      // First send SMS with timeout
      const smsToken = await Promise.race([
        recaptchaRef.current.executeAsync(),
        createTimeoutPromise(10000) // 10 second timeout
      ]);
      
      if (!smsToken) {
        throw new Error('Failed to verify reCAPTCHA for SMS');
      }

      // SMS API call with timeout
      const smsResponse = await Promise.race([
        fetch("/api/sendSms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: ["+254721410517"],
            message: tayloreaMessageContent,
            recaptchaToken: smsToken
          }),
        }),
        createTimeoutPromise(15000) // 15 second timeout
      ]);

      if (!smsResponse.ok) {
        const errorData = await smsResponse.json();
        // throw new Error(errorData.error || errorData.message || 'Failed to send SMS');
      }

      // Reset reCAPTCHA for email
      recaptchaRef.current.reset();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for reset

      // Then send email with timeout
      const emailToken = await Promise.race([
        recaptchaRef.current.executeAsync(),
        createTimeoutPromise(10000) // 10 second timeout
      ]);
      
      if (!emailToken) {
        throw new Error('Failed to verify reCAPTCHA for email');
      }

      // Prepare quote data for logging
      const quoteDataForLogging = {
        firstName: formData.fname,
        email: formData.email,
        phoneNumber: formData.number,
        location: formData.location,
        destination: formData.destination,
        moveType: formData.moveType,
        bedrooms: formData.bedrooms,
        moveDate: formData.moveDate,
        referrals: formData.ref
      };

      const emailResponse = await Promise.race([
        fetch("/api/sendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: "sales@taylorea.com",
            message: userMessageContent,
            recaptchaToken: emailToken,
            quoteData: quoteDataForLogging
          }),
        }),
        createTimeoutPromise(15000) // 15 second timeout
      ]);

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        throw new Error(errorData.message || 'Failed to send email');
      }

      // Save Skip to Sanity
      // try {
      //   await createQuote(
      //     formData.fname,
      //     formData.email,
      //     formData.number,
      //     formData.location,
      //     formData.destination,
      //     formData.moveType,
      //     formData.bedrooms,
      //     formData.moveDate,
      //     formData.ref
      //   );
      // } catch (error) {
      //   console.error("Error saving quote to Sanity did not submit..:", error);
      // }

      setLastSubmissionTime(now);
      toast.success("Quote request submitted successfully! We'll contact you soon.");

      // Clear form data and persisted storage
      clearFormData();
      setFormSubmitted(true);

    } catch (error) {
      console.error("Error:", error);
      toast.success("Quote request submitted successfully! We'll contact you soon.");
      toast.error(error.message || "Failed to submit quote request. Please try again.");
    } finally {
      setIsSubmitting(false);
      recaptchaRef.current?.reset();
    }
  }

  const formatMessageContent = (to) => {
    const message = `
      New Move Request:
      ${to == 'user' ? 'dear ' + formData.fname + '\n' + 'This is a confirmation email that you have made a new move request with the following details:' : ''}
      Name: ${formData.fname}
      Email: ${formData.email}
      Phone Number: ${formData.number}
      Move Type: ${formData.moveType}
      Bedrooms: ${formData.bedrooms}
      Move Date: ${formData.moveDate}
      From: ${formData.location}
      To: ${formData.destination}
      How did you hear about us: ${formData.ref}
    `;
    return message;
  }



  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const currentDate = new Date().toISOString().split('T')[0];

    if (selectedDate >= currentDate) {
      updateFormData('moveDate', selectedDate);
    } else {
      toast.error('Please select a date from today onwards');
    }
  };

  function validateFields() {
    if (!formData.fname || !isValidName(formData.fname)) {
      toast.error("Please enter a valid name (letters and spaces only)");
      return false;
    }

    if (!formData.email || !isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (isValidPhoneNumber(formData.number)) {
      toast.error(`Please enter a valid phone number (07/01XXXXXXXX), ${formData.number + " " + isValidPhoneNumber(formData.number)}`);
      return false;
    }

    if (!isValidLocation(formData.location)) {
      toast.error("Please enter a valid current location (at least 3 characters)");
      return false;
    }

    if (!isValidLocation(formData.destination)) {
      toast.error("Please enter a valid destination (at least 3 characters)");
      return false;
    }

    if (!formData.moveDate) {
      toast.error("Please select a move date");
      return false;
    }

    const selectedDate = new Date(formData.moveDate);
    const currentDate = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    console.log("Selected Date:", selectedDate, "Current Date:", currentDate);
    if (selectedDate < currentDate) {
      toast.error("Please select a future date for the move");
      return false;
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      toast.info("Your request is being processed...");
      return;
    }

    if (!validateFields()) {
      return;
    }

    try {
      const recaptchaValue = await recaptchaRef.current.executeAsync();
      if (!recaptchaValue) {
        toast.error("Please verify that you are human");
        return;
      }

      await handleSendMessage();
    } catch (error) {
      toast.error("Failed to submit form. Please try again.");
    }
  }

  return (
    <div className='w-full max-w-[400px] mx-auto quote-form-container'>
      {/* Header Section */}
      <div className='py-4 px-4 mb-4 bg-gradient-to-r from-[#FF5000] to-[#FF6B35] rounded-t-xl'>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-bold text-xl text-white mb-1">Request a Quote</h1>
            <p className='text-white text-sm opacity-90'>Get your free moving estimate</p>
          </div>
          {showPersistedDataNotice && (
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-xs text-white font-medium">📝 Data restored</span>
            </div>
          )}
        </div>
        {hasPersistedData && (
          <div className="mt-3 p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-medium">Continue from where you left off</span>
              <button
                type="button"
                onClick={clearFormData}
                className="text-white/70 hover:text-white text-xs underline"
              >
                Start fresh
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Form Container - Scrollable fields */}
      <div className='px-4 pb-4 quote-form-scroll-container' style={{ maxHeight: 'calc(90vh - 240px)', overflowY: 'auto', overflowX: 'hidden' }}>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='w-full flex flex-col items-center justify-center space-y-4'>
          {/* Prevent form re-rendering by removing unstable keys */}
          
          {/* Full Name */}
          <div className='relative w-full'>
            <input
              type='text'
              value={formData.fname}
              required
              placeholder="John Doe"
              onChange={(e) => updateFormData('fname', e.target.value)}
              onBlur={(e) => {
                // Prevent clearing on blur by ensuring value stays
                if (e.target.value !== formData.fname) {
                  updateFormData('fname', e.target.value);
                }
              }}
              className='border border-slate-300 px-4 py-3 w-full rounded-xl focus:border-[#FF5000] focus:ring-2 focus:ring-[#FF5000]/20 transition-all duration-200 text-gray-800 bg-white'
              style={{ 
                WebkitAppearance: 'none',
                WebkitUserSelect: 'text',
                userSelect: 'text',
                color: '#374151 !important',
                backgroundColor: '#ffffff !important'
              }}
            />
            <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-500 font-medium'>
              Full Name
            </label>
          </div>

          {/* Mobile Number */}
          <div className='relative w-full'>
            <input
              type='text'
              value={formData.number}
              required
              onChange={(e) => updateFormData('number', e.target.value)}
              onBlur={(e) => {
                if (e.target.value !== formData.number) {
                  updateFormData('number', e.target.value);
                }
              }}
              className='border border-slate-300 px-4 py-3 w-full rounded-xl focus:border-[#FF5000] focus:ring-2 focus:ring-[#FF5000]/20 transition-all duration-200 text-gray-800 bg-white'
              placeholder="0700000000"
              style={{ 
                WebkitAppearance: 'none',
                WebkitUserSelect: 'text',
                userSelect: 'text',
                color: '#374151 !important',
                backgroundColor: '#ffffff !important'
              }}
            />
            <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-500 font-medium'>
              Mobile Number
            </label>
          </div>

          {/* Email */}
          <div className='relative w-full'>
            <input
              type='email'
              value={formData.email}
              placeholder="john@gmail.com"
              onChange={(e) => updateFormData('email', e.target.value)}
              onBlur={(e) => {
                if (e.target.value !== formData.email) {
                  updateFormData('email', e.target.value);
                }
              }}
              className='border border-slate-300 px-4 py-3 w-full rounded-xl focus:border-[#FF5000] focus:ring-2 focus:ring-[#FF5000]/20 transition-all duration-200 text-gray-800 bg-white'
              style={{ 
                WebkitAppearance: 'none',
                WebkitUserSelect: 'text',
                userSelect: 'text',
                color: '#374151 !important',
                backgroundColor: '#ffffff !important'
              }}
            />
            <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-500 font-medium'>
              Email Address
            </label>
          </div>

          {/* Current Location */}
          <div className='relative w-full'>
            <input
              type='text'
              value={formData.location}
              placeholder="Westlands, Nairobi"
              onChange={(e) => updateFormData('location', e.target.value)}
              onBlur={(e) => {
                if (e.target.value !== formData.location) {
                  updateFormData('location', e.target.value);
                }
              }}
              className='border border-slate-300 px-4 py-3 w-full rounded-xl focus:border-[#FF5000] focus:ring-2 focus:ring-[#FF5000]/20 transition-all duration-200 text-gray-800 bg-white'
              style={{ 
                WebkitAppearance: 'none',
                WebkitUserSelect: 'text',
                userSelect: 'text',
                color: '#374151 !important',
                backgroundColor: '#ffffff !important'
              }}
            />
            <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-500 font-medium'>
              Current Location
            </label>
          </div>

          {/* Destination */}
          <div className='relative w-full'>
            <input
              type='text'
              value={formData.destination}
              placeholder="Nairobi CBD"
              onChange={(e) => updateFormData('destination', e.target.value)}
              onBlur={(e) => {
                if (e.target.value !== formData.destination) {
                  updateFormData('destination', e.target.value);
                }
              }}
              className='border border-slate-300 px-4 py-3 w-full rounded-xl focus:border-[#FF5000] focus:ring-2 focus:ring-[#FF5000]/20 transition-all duration-200 text-gray-800 bg-white'
              style={{ 
                WebkitAppearance: 'none',
                WebkitUserSelect: 'text',
                userSelect: 'text',
                color: '#374151 !important',
                backgroundColor: '#ffffff !important'
              }}
            />
            <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-500 font-medium'>
              Destination Location
            </label>
          </div>

          {/* Move Type */}
          <div className='relative w-full'>
            <select
              onChange={(e) => updateFormData('moveType', e.target.value)}
              value={formData.moveType}
              className='border border-slate-300 px-4 py-3 w-full rounded-xl focus:border-[#FF5000] focus:ring-2 focus:ring-[#FF5000]/20 transition-all duration-200 text-gray-800 bg-white appearance-none cursor-pointer'
              style={{ 
                WebkitAppearance: 'none',
                color: '#374151 !important',
                backgroundColor: '#ffffff !important'
              }}>
              <option value="Local House Move">Local House Move</option>
              <option value="International Move">International Move</option>
              <option value="Business Move">Business Move</option>
              <option value="Other">Other</option>
            </select>
            <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-500 font-medium'>
              Move Type
            </label>
          </div>

          {/* Number of Bedrooms */}
          <div className='relative w-full'>
            <select
              onChange={(e) => updateFormData('bedrooms', e.target.value)}
              value={formData.bedrooms}
              className='border border-slate-300 px-4 py-3 w-full rounded-xl focus:border-[#FF5000] focus:ring-2 focus:ring-[#FF5000]/20 transition-all duration-200 text-gray-800 bg-white appearance-none cursor-pointer'
              style={{ 
                WebkitAppearance: 'none',
                color: '#374151 !important',
                backgroundColor: '#ffffff !important'
              }}>
              <option value="1br">1 Bedroom</option>
              <option value="2br">2 Bedrooms</option>
              <option value="3br">3 Bedrooms</option>
              <option value="4br">4 Bedrooms</option>
              <option value="5br">5 Bedrooms</option>
              <option value="6br">6 Bedrooms</option>
              <option value="More than 6br">More than 6 Bedrooms</option>
              <option value="studio">Studio Apartment</option>
            </select>
            <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-500 font-medium'>
              Number of Bedrooms
            </label>
          </div>

          {/* Move Date */}
          <div className='relative w-full'>
            <input
              type='date'
              value={formData.moveDate}
              onChange={handleDateChange}
              className='border border-slate-300 px-4 py-3 w-full rounded-xl focus:border-[#FF5000] focus:ring-2 focus:ring-[#FF5000]/20 transition-all duration-200 text-gray-800 bg-white'
              style={{ 
                WebkitAppearance: 'none',
                color: '#374151 !important',
                backgroundColor: '#ffffff !important'
              }}
            />
            <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-500 font-medium'>
              Preferred Move Date
            </label>
          </div>

          {/* How did you find us */}
          <div className='relative w-full'>
            <select
              onChange={(e) => updateFormData('ref', e.target.value)}
              value={formData.ref}
              className='border border-slate-300 px-4 py-3 w-full rounded-xl focus:border-[#FF5000] focus:ring-2 focus:ring-[#FF5000]/20 transition-all duration-200 text-gray-800 bg-white appearance-none cursor-pointer'
              style={{ 
                WebkitAppearance: 'none',
                color: '#374151 !important',
                backgroundColor: '#ffffff !important'
              }}>
              <option value="Referals">Referrals</option>
              <option value="Social Media Pages">Social Media Pages</option>
              <option value="Internet Search">Internet Search</option>
              <option value="Door To Door Marketing">Door To Door Marketing</option>
              <option value="Taylor Mover Trucks">Taylor Mover Trucks</option>
              <option value="Previous Interactions">Previous Interactions</option>
            </select>
            <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-500 font-medium'>
              How did you find us?
            </label>
          </div>

          {/* reCAPTCHA */}
          <div className="w-full">
            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            />
          </div>
        </form>
      </div>

      {/* Submit Button - Fixed at bottom, always visible */}
      <div className='px-4 pb-6 pt-4 bg-white border-t border-gray-200'>
        <button
          type='submit'
          onClick={(e) => {
            e.preventDefault();
            if (formRef.current) {
              formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
          }}
          disabled={isSubmitting}
          className='w-full bg-[#FF5000] text-white px-6 py-4 rounded-xl hover:bg-[#e04400] transition-all duration-200 font-semibold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg'>
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="text-sm sm:text-base">Submitting...</span>
            </div>
          ) : (
            <span className="text-sm sm:text-base">Submit Quote Request</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default QuoteForm