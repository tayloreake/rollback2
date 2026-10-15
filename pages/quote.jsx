import React, { useState, useRef } from "react"
import Featured from "../components/Quote/Featured"
import { toast } from "react-toastify"
import ReCAPTCHA from "../components/SafeRecaptcha"
import PageTitle from "../components/PageTitle"
import getPageMetadata from "../SEO/seo"
import Head from 'next/head'
import { getAttribution } from '../utils/attribution'

const Quote = () => {
  const [fname, setFname] = useState("")
  const [email, setEmail] = useState("")
  const [location, setLocation] = useState("")
  const [destination, setDestination] = useState("")
  const [number, setNumber] = useState("")
  const [moveType, setMoveType] = useState("Local House Move")
  const [bedrooms, setBedrooms] = useState("1 Bedroom")
  const [moveDate, setMoveDate] = useState(getCurrentDate())
  const [ref, setRef] = useState("Referrals")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0)
  const recaptchaRef = useRef(null)

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return false
    return /^\+?\d[\d\s-]{7,15}$/.test(phoneNumber.trim())
  }

  const isValidName = (name) => {
    if (!name) return false
    return /^[\p{L}\p{M}' .-]{2,80}$/u.test(name.trim());
  };

  const isValidLocation = (location) => {
    return location.length >= 3;
  };

  // Single server-orchestrated submit (Sanity Security §7.3/§8):
  // POSTs once to /api/submitQuote (ledger → SMS/email → Zoho).
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

      const token = await recaptchaRef.current?.executeAsync?.();
      if (!token) {
        throw new Error('Failed to verify reCAPTCHA');
      }

      const response = await fetch("/api/submitQuote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: tayloreaMessageContent,
          recaptchaToken: token,
          quoteData: {
            firstName: fname,
            email: email,
            phoneNumber: number,
            location: location,
            destination: destination,
            moveType: moveType,
            bedrooms: bedrooms,
            moveDate: moveDate,
            referrals: ref,
            attribution: getAttribution(),
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send email');
      }

      // No direct Sanity writes from the browser (Sanity Security §2/§7).

      setLastSubmissionTime(now);
      toast.success("Quote request submitted successfully! We'll contact you soon.");
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'generate_lead',
          form_id: 'quote',
          move_type: moveType,
          bedrooms: bedrooms,
          lead_source: ref,
          value: 1,
          currency: 'KES',
        });
      } catch (e) { /* no-op */ }
      
      // Reset form
      setFname("");
      setEmail("");
      setLocation("");
      setDestination("");
      setNumber("");
      
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
      ${to == 'user' ? 'dear ' + fname + '\n' + 'This is a confirmation email that you have made a new move request with the following details:' : ''}
      Name: ${fname}
      Email: ${email}
      Phone Number: ${number}
      Move Type: ${moveType}
      Bedrooms: ${bedrooms}
      Move Date: ${moveDate}
      From: ${location}
      To: ${destination}
      How did you hear about us: ${ref}
    `;
    return message;
  }

  function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const currentDate = new Date().toISOString().split('T')[0];

    if (selectedDate >= currentDate) {
      setMoveDate(selectedDate);
    } else {
      toast.error('Please select a date from today onwards');
    }
  };

  function validateFields() {
    if (!fname || !isValidName(fname)) {
      toast.error("Please enter a valid name (letters and spaces only)");
      return false;
    }
    
    if (email && !isValidEmail(email)) {
      toast.error("Please enter a valid email address or leave it empty");
      return false;
    }
    if (!isValidPhoneNumber(number)) {
      toast.error(`Please enter a valid phone number (e.g. 0721410517 or +254721410517)`);
      return false;
    }
    
    if (!isValidLocation(location)) {
      toast.error("Please enter a valid current location (at least 3 characters)");
      return false;
    }
    
    if (!isValidLocation(destination)) {
      toast.error("Please enter a valid destination (at least 3 characters)");
      return false;
    }
    
    if (!moveDate) {
      toast.error("Please select a move date");
      return false;
    }
    
    const selectedDate = new Date(moveDate);
    const currentDate = new Date();
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
      console.error("Error:", error);
      toast.error("Failed to submit form. Please try again.");
    }
  }

  // Get SEO metadata
  const seoData = getPageMetadata("quote", {
    location: 'Nairobi',
    customTitle: 'Get Free Moving Quote Nairobi | Professional Movers | Taylor Movers',
    customDescription: 'Get your free moving quote for Nairobi, Kenya in under 5 minutes. Professional movers with transparent pricing. No hidden fees. Call +254 721 410 517 now!',
    includeLocalBusiness: false,
    includeService: true
  })

  const MOVE_TYPES = ["Local House Move","Office Move","International Move","Corporate Staff Relocation","Storage & Warehousing","Long-Distance Move","Business Move","Other"]
  const BEDROOMS = ["Studio Apartment","1 Bedroom","2 Bedrooms","3 Bedrooms","4 Bedrooms","5 Bedrooms","6 Bedrooms","More than 6 Bedrooms"]
  const REFS = ["Referrals","Social Media Pages","Internet Search","Door To Door Marketing","Taylor Mover Trucks","Previous Interactions"]
  const inputCls = 'border border-slate-200 px-4 py-3 w-full rounded-xl focus:border-[#FF5000] focus:ring-2 focus:ring-[#FF5000]/20 text-[15px] bg-white'
  const labelCls = 'block text-[13px] font-semibold text-slate-700 mb-1.5'

  return (
    <div className='w-full bg-slate-50'>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonical} />
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:type" content={seoData.openGraph.type} />
      </Head>
      <div className='bg-[#0B1B33] relative overflow-hidden'>
        <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5000] via-[#FF8A50] to-[#FF5000]' />
        <div className='max-w-[1200px] mx-auto px-4 py-12 md:py-16 text-center'>
          <p className='inline-block text-[11px] font-bold tracking-widest uppercase bg-white/10 text-white px-3 py-1.5 rounded-full border border-white/15 mb-4'>Nairobi&apos;s Trusted Movers Since 2008</p>
          <h1 className='text-white font-bold text-3xl md:text-5xl leading-tight'>Get Your Free Moving Quote in Minutes</h1>
          <p className='text-slate-300 mt-3 max-w-2xl mx-auto'>IAM member • 40,000+ successful moves • 4.9★ from 4,000+ verified reviews. Transparent pricing, fully insured crews.</p>
        </div>
      </div>

      <div className='max-w-[1200px] mx-auto px-4 py-10 grid lg:grid-cols-[1fr_360px] gap-8 items-start'>
        <div className='bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden'>
          <div className='px-6 md:px-8 py-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3'>
            <div>
              <h2 className='font-bold text-xl text-slate-900'>Request a Quotation</h2>
              <p className='text-sm text-slate-500'>We reply within 30 minutes during business hours (7am–7pm EAT).</p>
            </div>
            <div className='flex gap-2 text-[12px]'><a href='https://wa.me/254721410517?text=Hi%20Taylor%2C%20I%27d%20like%20a%20quote%20(ref%3A%20WEB)' target='_blank' rel='noreferrer' className='px-3 py-2 rounded-lg bg-green-600 text-white font-semibold'>WhatsApp</a><a href='tel:+254721410517' className='px-3 py-2 rounded-lg bg-slate-900 text-white font-semibold'>Call Sales</a></div>
          </div>
          <form onSubmit={handleSubmit} className='px-6 md:px-8 py-6 grid md:grid-cols-2 gap-5'>
            <div><label htmlFor='q-fname' className={labelCls}>Full Name *</label><input id='q-fname' name='name' autoComplete='name' type='text' value={fname} required onChange={(e) => setFname(e.target.value)} placeholder="e.g. Brian O&apos;Brien" className={inputCls} /></div>
            <div><label htmlFor='q-phone' className={labelCls}>Phone / WhatsApp *</label><input id='q-phone' name='phone' autoComplete='tel' type='tel' inputMode='tel' value={number} required onChange={(e) => setNumber(e.target.value)} placeholder='+254 712 410 517' className={inputCls} /></div>
            <div><label htmlFor='q-email' className={labelCls}>Email</label><input id='q-email' name='email' autoComplete='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='you@company.com (optional)' className={inputCls} /></div>
            <div><label htmlFor='q-date' className={labelCls}>Preferred Move Date *</label><input id='q-date' name='moveDate' type='date' value={moveDate} onChange={handleDateChange} className={inputCls} /></div>
            <div><label htmlFor='q-from' className={labelCls}>Moving From *</label><input id='q-from' name='from' type='text' value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Westlands, Nairobi' className={inputCls} /></div>
            <div><label htmlFor='q-to' className={labelCls}>Moving To *</label><input id='q-to' name='to' type='text' value={destination} onChange={(e) => setDestination(e.target.value)} placeholder='Karen, Nairobi / London, UK' className={inputCls} /></div>
            <div><label htmlFor='q-type' className={labelCls}>Move Type *</label><select id='q-type' name='moveType' value={moveType} onChange={(e) => setMoveType(e.target.value)} className={inputCls}>{MOVE_TYPES.map(m=>(<option key={m} value={m}>{m}</option>))}</select></div>
            <div><label htmlFor='q-size' className={labelCls}>Property Size *</label><select id='q-size' name='bedrooms' value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={inputCls}>{BEDROOMS.map(b=>(<option key={b} value={b}>{b}</option>))}</select></div>
            <div className='md:col-span-2'><label htmlFor='q-ref' className={labelCls}>How did you hear about us?</label><select id='q-ref' name='referral' value={ref} onChange={(e) => setRef(e.target.value)} className={inputCls}>{REFS.map(r=>(<option key={r} value={r}>{r}</option>))}</select></div>
            <div className='md:col-span-2'><ReCAPTCHA ref={recaptchaRef} size='invisible' sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} /></div>
            <div className='md:col-span-2'>
              <button type='submit' disabled={isSubmitting} className='w-full bg-[#FF5000] hover:bg-[#D94300] text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50'>{isSubmitting ? 'Submitting secure request…' : 'Submit Quote Request →'}</button>
              <p className='text-[12px] text-slate-500 mt-3 text-center'>🔒 Encrypted & confidential. We never share your details. By submitting you agree to be contacted about your move.</p>
            </div>
          </form>
        </div>
        <aside className='flex flex-col gap-4'>
          <div className='bg-[#0B1B33] text-white rounded-2xl p-6'><h3 className='font-bold text-lg mb-2'>Why 40,000+ customers chose Taylor</h3><ul className='text-sm text-slate-200 space-y-2'><li>✓ IAM-certified crews & full insurance</li><li>✓ Same-day Nairobi surveys</li><li>✓ Corporate, embassy & international experts</li><li>✓ Secure storage in Emerald Business Park</li></ul><div className='mt-4 text-sm'><p className='text-slate-300'>Prefer to talk?</p><p className='font-bold text-lg'>0721 410 517</p><p className='text-slate-300 text-sm'>sales@taylorea.com</p></div></div>
          <div className='bg-white rounded-2xl border p-6'><h3 className='font-bold mb-2'>How it works</h3><ol className='text-sm text-slate-600 space-y-2'><li><b>1.</b> Submit in 60 seconds</li><li><b>2.</b> Free survey & fixed quote</li><li><b>3.</b> Professional move day</li></ol></div>
        </aside>
      </div>
    </div>
  )
}

export default Quote
