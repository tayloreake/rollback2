import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { toast } from "react-toastify"
import ReCAPTCHA from "../SafeRecaptcha"
import useFormPersistence from "../../hooks/useFormPersistence"
import { getAttribution } from "../../utils/attribution"

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
  bedrooms: "1 Bedroom",
  moveDate: getCurrentDate(),
  ref: "Referrals"
});

const MOVE_TYPES = [
  "Local House Move",
  "Office Move",
  "International Move",
  "Corporate Staff Relocation",
  "Storage & Warehousing",
  "Long-Distance Move",
  "Business Move",
  "Other",
];

const BEDROOM_OPTIONS = [
  "Studio Apartment",
  "1 Bedroom",
  "2 Bedrooms",
  "3 Bedrooms",
  "4 Bedrooms",
  "5 Bedrooms",
  "6 Bedrooms",
  "More than 6 Bedrooms",
];

const REFERRAL_OPTIONS = [
  "Referrals",
  "Social Media Pages",
  "Internet Search",
  "Door To Door Marketing",
  "Taylor Mover Trucks",
  "Previous Interactions",
];

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

  // P0: accept international formats, normalise server-side to E.164 (default KE).
  // Audit: was /^0\d{9}$/ which blocked +254/+44/+1 expat & embassy leads.
  const isValidPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return false
    return /^\+?\d[\d\s-]{7,15}$/.test(phoneNumber.trim())
  }

  useEffect(() => {
    if (formSubmitted) {
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'generate_lead',
          form_id: 'quote',
          move_type: formData.moveType,
          bedrooms: formData.bedrooms,
          lead_source: formData.ref,
          value: 1,
          currency: 'KES',
        });
      } catch (e) { /* no-op */ }
      window.dispatchEvent(new CustomEvent("tayloreaFormSubmitted", {
        detail: { status: "success", timestamp: Date.now() }
      }));

      // Use Next.js router for better navigation
      window.location.href = "/ThankYou";
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSubmitted]);

  const isValidName = (name) => {
    if (!name) return false
    return /^[\p{L}\p{M}' .-]{2,80}$/u.test(name.trim());
  };

  const isValidLocation = (location) => {
    return location.length >= 3;
  };

  // Single server-orchestrated submit (Sanity Security §7.3/§8):
  // POSTs once to /api/submitQuote, which does ledger → SMS/email → Zoho.
  // No direct Sanity writes from the browser, no dual fan-out.
  const handleSendMessage = async () => {
    const tayloreaMessageContent = formatMessageContent('taylorea');

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

      const token = await Promise.race([
        recaptchaRef.current?.executeAsync?.(),
        createTimeoutPromise(10000) // 10 second timeout
      ]);

      if (!token) {
        throw new Error('Failed to verify reCAPTCHA');
      }

      // Prepare quote data for the server
      const quoteDataForLogging = {
        firstName: formData.fname,
        email: formData.email,
        phoneNumber: formData.number,
        location: formData.location,
        destination: formData.destination,
        moveType: formData.moveType,
        bedrooms: formData.bedrooms,
        moveDate: formData.moveDate,
        referrals: formData.ref,
        attribution: getAttribution(),
      };

      const response = await Promise.race([
        fetch("/api/submitQuote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: tayloreaMessageContent,
            recaptchaToken: token,
            quoteData: quoteDataForLogging
          }),
        }),
        createTimeoutPromise(30000) // 30 second timeout
      ]);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit quote request');
      }

      // No direct Sanity writes from the browser (Sanity Security §2/§7).
      // The server route owns ledger + notifications + Zoho.

      setLastSubmissionTime(now);
      toast.success("Quote request submitted successfully! We'll contact you soon.");
      clearFormData();
      setFormSubmitted(true);

    } catch (error) {
      console.error("Error:", error);
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
    if (!isValidPhoneNumber(formData.number)) {
      toast.error(`Please enter a valid phone number (e.g. 0721410517 or +254721410517)`);
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
      const recaptchaValue = await recaptchaRef.current?.executeAsync?.();
      if (!recaptchaValue) {
        toast.error("Please verify that you are human");
        return;
      }

      await handleSendMessage();
    } catch (error) {
      toast.error("Failed to submit form. Please try again.");
    }
  }

  const inputCls = 'border border-slate-200 px-4 py-3 w-full rounded-xl focus:border-[#FF5000] focus:ring-2 focus:ring-[#FF5000]/20 transition-all duration-200 text-[15px] text-gray-900 bg-white placeholder:text-gray-400'
  const labelCls = 'block text-[13px] font-semibold text-slate-700 mb-1.5'

  return (
    <div className='w-full max-w-[480px] mx-auto quote-form-container bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(11,27,51,0.35)] border border-slate-100 overflow-hidden'>
      {/* Enterprise header */}
      <div className='bg-[#0B1B33] px-6 pt-6 pb-5 relative overflow-hidden'>
        <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5000] via-[#FF8A50] to-[#FF5000]' />
        <div className='flex items-center gap-2 mb-3'>
          <span className='text-[11px] font-bold tracking-widest uppercase bg-white/10 text-white px-2.5 py-1 rounded-full border border-white/15'>Taylor Movers • Since 2008</span>
          {showPersistedDataNotice && (
            <span className='text-[11px] text-white/90 bg-white/10 px-2.5 py-1 rounded-full'>Draft restored</span>
          )}
        </div>
        <h2 className='font-bold text-[22px] leading-tight text-white'>Get Your Free Moving Quote</h2>
        <p className='text-slate-300 text-sm mt-1'>Transparent pricing • No hidden fees • Response within 30 minutes</p>
        <div className='flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[12px] text-slate-200'>
          <span>IAM Member</span><span className='text-white/20'>|</span>
          <span>40,000+ Successful Moves</span><span className='text-white/20'>|</span>
          <span>4.9★ from 4,000+ reviews</span>
        </div>
        {hasPersistedData && (
          <div className='mt-3 flex items-center justify-between bg-white/10 border border-white/15 rounded-lg px-3 py-2'>
            <span className='text-white text-xs'>Continue from where you left off</span>
            <button type='button' onClick={clearFormData} className='text-white/70 hover:text-white text-xs underline'>Start fresh</button>
          </div>
        )}
      </div>

      {/* Trust strip */}
      <div className='grid grid-cols-3 divide-x divide-slate-100 bg-slate-50 border-b border-slate-100 text-center'>
        <div className='py-2.5 px-2'><p className='text-[13px] font-bold text-slate-900'>Licensed</p><p className='text-[11px] text-slate-500'>& Insured</p></div>
        <div className='py-2.5 px-2'><p className='text-[13px] font-bold text-slate-900'>Free Survey</p><p className='text-[11px] text-slate-500'>On request</p></div>
        <div className='py-2.5 px-2'><p className='text-[13px] font-bold text-slate-900'>0712 410 517</p><p className='text-[11px] text-slate-500'>Call / WhatsApp</p></div>
      </div>

      <div className='px-6 py-5'>
        <form ref={formRef} onSubmit={handleSubmit} className='w-full flex flex-col gap-5'>
          <div>
            <p className='text-[11px] font-bold tracking-widest uppercase text-[#FF5000] mb-3'>1 • Contact details</p>
            <div className='flex flex-col gap-4'>
              <div>
                <label htmlFor='quote-fname' className={labelCls}>Full Name <span className='text-[#FF5000]'>*</span></label>
                <input type='text' id='quote-fname' name='name' autoComplete='name' value={formData.fname} required placeholder='e.g. Jane Wanjiru-Kamau' onChange={(e) => updateFormData('fname', e.target.value)} className={inputCls} />
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='quote-phone' className={labelCls}>Phone / WhatsApp <span className='text-[#FF5000]'>*</span></label>
                  <input type='tel' inputMode='tel' id='quote-phone' name='phone' autoComplete='tel' value={formData.number} required placeholder='+254 712 410 517' onChange={(e) => updateFormData('number', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label htmlFor='quote-email' className={labelCls}>Email <span className='text-[#FF5000]'>*</span></label>
                  <input type='email' id='quote-email' name='email' autoComplete='email' value={formData.email} required placeholder='you@company.com' onChange={(e) => updateFormData('email', e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>
          </div>

          <div className='h-px bg-slate-100' />

          <div>
            <p className='text-[11px] font-bold tracking-widest uppercase text-[#FF5000] mb-3'>2 • Move details</p>
            <div className='flex flex-col gap-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='quote-from' className={labelCls}>Moving From <span className='text-[#FF5000]'>*</span></label>
                  <input type='text' id='quote-from' name='from' autoComplete='address-level2' value={formData.location} required placeholder='Westlands, Nairobi' onChange={(e) => updateFormData('location', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label htmlFor='quote-to' className={labelCls}>Moving To <span className='text-[#FF5000]'>*</span></label>
                  <input type='text' id='quote-to' name='to' value={formData.destination} required placeholder='Kileleshwa, Nairobi' onChange={(e) => updateFormData('destination', e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='quote-type' className={labelCls}>Move Type <span className='text-[#FF5000]'>*</span></label>
                  <select id='quote-type' name='moveType' value={formData.moveType} onChange={(e) => updateFormData('moveType', e.target.value)} className={inputCls + ' cursor-pointer'}>
                    {MOVE_TYPES.map((m) => (<option key={m} value={m}>{m}</option>))}
                  </select>
                </div>
                <div>
                  <label htmlFor='quote-size' className={labelCls}>Property Size <span className='text-[#FF5000]'>*</span></label>
                  <select id='quote-size' name='bedrooms' value={formData.bedrooms} onChange={(e) => updateFormData('bedrooms', e.target.value)} className={inputCls + ' cursor-pointer'}>
                    {BEDROOM_OPTIONS.map((b) => (<option key={b} value={b}>{b}</option>))}
                  </select>
                </div>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='quote-date' className={labelCls}>Preferred Move Date <span className='text-[#FF5000]'>*</span></label>
                  <input type='date' id='quote-date' name='moveDate' value={formData.moveDate} onChange={handleDateChange} className={inputCls} />
                </div>
                <div>
                  <label htmlFor='quote-ref' className={labelCls}>How did you hear about us?</label>
                  <select id='quote-ref' name='referral' value={formData.ref} onChange={(e) => updateFormData('ref', e.target.value)} className={inputCls + ' cursor-pointer'}>
                    {REFERRAL_OPTIONS.map((r) => (<option key={r} value={r}>{r}</option>))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full'>
            <ReCAPTCHA ref={recaptchaRef} size='invisible' sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} />
          </div>
        </form>
      </div>

      <div className='px-6 pb-6 pt-4 bg-white border-t border-slate-100'>
        <button type='submit' onClick={(e) => { e.preventDefault(); if (formRef.current) { formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); } }} disabled={isSubmitting} className='w-full bg-[#FF5000] text-white px-6 py-4 rounded-xl hover:bg-[#D94300] transition-all font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_25px_-8px_rgba(255,80,0,0.7)]'>
          {isSubmitting ? (<span className='flex items-center justify-center gap-2'><span className='animate-spin rounded-full h-5 w-5 border-b-2 border-white' />Submitting secure request…</span>) : (<span>Request My Free Quote →</span>)}
        </button>
        <p className='text-center text-[12px] text-slate-500 mt-3'>🔒 Your details are encrypted & never shared. Prefer chat? <a href='https://wa.me/254721410517?text=Hi%20Taylor%2C%20I%27d%20like%20a%20quote%20(ref%3A%20WEB)' target='_blank' rel='noreferrer' className='font-semibold text-[#0B1B33] underline'>WhatsApp us</a> • <a href='tel:+254721410517' className='font-semibold text-[#0B1B33] underline'>Call 0721 410 517</a></p>
      </div>
    </div>
  )
}

export default QuoteForm
