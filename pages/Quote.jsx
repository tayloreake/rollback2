import React, { useState, useRef } from "react"
import Featured from "../components/Quote/Featured"
import { toast } from "react-toastify"
import { createQuote } from "../sanity/sanity-utils"
import PhoneInput from "react-phone-input-2"
import ReCAPTCHA from "react-google-recaptcha"
import PageTitle from "../components/PageTitle"
import getPageMetadata from "../SEO/seo"
import Head from 'next/head'

const Quote = () => {
  const [fname, setFname] = useState("")
  const [email, setEmail] = useState("")
  const [location, setLocation] = useState("")
  const [destination, setDestination] = useState("")
  const [number, setNumber] = useState("")
  const [moveType, setMoveType] = useState("Local House Move")
  const [bedrooms, setBedrooms] = useState("1br")
  const [moveDate, setMoveDate] = useState(getCurrentDate())
  const [ref, setRef] = useState("Referal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0)
  const recaptchaRef = useRef(null)

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    return /^\0\d{9}$/.test(phoneNumber)
  }

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

      // First send SMS
      const smsToken = await recaptchaRef.current.executeAsync();
      if (!smsToken) {
        throw new Error('Failed to verify reCAPTCHA for SMS');
      }

      // the default phone number
      // 254743505069
      const smsResponse = await fetch("/api/sendSms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: ["+254721410517"],
          message: tayloreaMessageContent,
          recaptchaToken: smsToken
        }),
      });

      if (!smsResponse.ok) {
        const errorData = await smsResponse.json();
        // throw new Error(errorData.error || errorData.message || 'Failed to send SMS');
      }

      // Reset reCAPTCHA for email
      // Reset reCAPTCHA for email
      recaptchaRef.current.reset();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for reset

      // Then send email
      const emailToken = await recaptchaRef.current.executeAsync();
      if (!emailToken) {
        throw new Error('Failed to verify reCAPTCHA for email');
      }


      const emailResponse = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          message: userMessageContent,
          recaptchaToken: "emailToken"
        }),
      });

      const salesMailResponse = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "sales@taylorea.com",
          message: tayloreaMessageContent,
          recaptchaToken: "emailToken"
        }),
      });
      
      if (!emailResponse.ok || !salesMailResponse.ok) {
        const errorData = await emailResponse.json();
        throw new Error(errorData.message || 'Failed to send email');
      }

      

      // Save to Sanity
      // await createQuote(
      //   fname,
      //   email,
      //   number,
      //   location,
      //   destination,
      //   bedrooms,
      //   moveType,
      //   moveDate
      // );

      setLastSubmissionTime(now);
      toast.success("Quote request submitted successfully! We'll contact you soon.");
      
      // Reset form
      setFname("");
      setEmail("");
      setLocation("");
      setDestination("");
      setNumber("");
      
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
    
    if (!email || !isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (isValidPhoneNumber(number)) {
      toast.error(`Please enter a valid phone number (07/01XXXXXXXX), ${number + " " + isValidPhoneNumber(number)}`);
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
      const recaptchaValue = await recaptchaRef.current.executeAsync();
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

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:type" content={seoData.openGraph.type} />
      </Head>
      <PageTitle title={"Get Free Quote"} />
      <div className='w-full h-full flex flex-col items-center justify-center max-w-[1440px]'>
        <div className='py-12 max-w-[840px] flex flex-col px-4 mx-auto'>
          <h2 className='mb-4 md:mb-7 text-xl font-bold'>Feel Free To Ask</h2>
          <p>
            Please feel free to
            contact us by filling out the form below, and we will respond to
            your message as promptly as possible.
          </p>
        </div>
        <div className='flwe flex-col w-full px-4 mb-4'>
          {/* <h3 className='text-lg mb-4'>Contact Us</h3> */}
          <form
            onSubmit={handleSubmit}
            className='w-full flex flex-col items-center justify-center'>
            <div className='flex flex-col md:flex-row w-full max-w-[800px] justify-between'>
              <div className='border border-slate-300 rounded-xl relative w-full max-w-[351px] mb-4 md:mr-2'>
                <input
                  type='text'
                  value={fname}
                  required
                  onChange={(e) => setFname(e.target.value)}
                  className='px-4 py-2 w-full rounded-xl'
                />
                <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-400'>
                  First Name
                </label>
              </div>
              <div className='border border-slate-300 rounded-xl relative w-full max-w-[351px] mb-4 md:mr-2'>
                {/* <PhoneInput
                  country={"ke"}
                  value={number}
                  onChange={(number) => setNumber(number)}
                  className='px-4 py-2 w-full rounded-xl'
                /> */}
                <input
                  type='text'
                  value={number}
                  required
                  onChange={(e) => setNumber(e.target.value)}
                  className='px-4 py-2 w-full rounded-xl'
                  placeholder="0700000000"
                />
                <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-400'>
                  Phone Number
                </label>
              </div>
            </div>
            <div className='flex flex-col md:flex-row w-full max-w-[800px] justify-between'>
              <div className='border border-slate-300 rounded-xl relative w-full max-w-[351px] mb-4 md:mr-2'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='px-4 py-2 w-full rounded-xl'
                />
                <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-400'>
                  Email
                </label>
              </div>
              <div className='border border-slate-300 rounded-xl relative w-full max-w-[351px] mb-4 md:mr-2'>
                <input
                  type='text'
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className='px-4 py-2 w-full rounded-xl'
                />
                <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-400'>
                  Current Location
                </label>
              </div>
            </div>
            <div className='flex flex-col md:flex-row w-full max-w-[800px] justify-between'>
              <div className='border border-slate-300 rounded-xl relative w-full max-w-[351px] mb-4 md:mr-2'>
                <input
                  type='text'
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className='px-4 py-2 w-full rounded-xl'
                />
                <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-400'>
                  Destination Location
                </label>
              </div>
              <div className='border border-slate-300 rounded-xl relative w-full max-w-[351px] mb-4 md:mr-2'>
                <select
                  onChange={(e) => setMoveType(e.target.value)}
                  value={moveType}
                  className='px-4 py-2 w-full rounded-xl'>
                  <option onClick={() => setMoveType("Local House Move")}>
                    {" "}
                    Local House Move{" "}
                  </option>
                  <option onClick={() => setMoveType("International Move")}>
                    {" "}
                    International Move{" "}
                  </option>
                  <option onClick={() => setMoveType("Business Move")}>
                    {" "}
                    Business Move{" "}
                  </option>
                  <option onClick={() => setMoveType("Other")}> Other </option>
                </select>
                <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-400'>
                  Move Type
                </label>
              </div>
            </div>
            <div className='flex flex-col md:flex-row w-full max-w-[800px] justify-between'>
              <div className='border border-slate-300 rounded-xl relative w-full max-w-[351px] mb-4 md:mr-2'>
                {/* <input type='text' value={email} onChange={() => setEmail(email)} className='px-4 py-2 rounded-xl' /> */}
                <select
                  onChange={(e) => setBedrooms(e.target.value)}
                  value={bedrooms}
                  className='px-4 py-2 w-full rounded-xl'>
                  <option onClick={() => setBedrooms("1br")}> 1br </option>
                  <option onClick={() => setBedrooms("2br")}> 2br </option>
                  <option onClick={() => setBedrooms("3br")}> 3br </option>
                  <option onClick={() => setBedrooms("4br")}> 4br </option>
                  <option onClick={() => setBedrooms("5br")}> 5br </option>
                  <option onClick={() => setBedrooms("6br")}> 6br </option>
                  <option onClick={() => setBedrooms("More than 6br")}>
                    {" "}
                    More than 6br{" "}
                  </option>
                  <option onClick={() => setBedrooms("studio")}> Studio Apartment</option>

                </select>
                <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-400'>
                  Number of bedrooms
                </label>
              </div>
              <div className='border border-slate-300 rounded-xl relative w-full max-w-[351px] mb-4 md:mr-2'>
                <input
                  type='date'
                  value={moveDate}
                  onChange={handleDateChange}
                  className='px-4 py-2 w-full rounded-xl'
                />
                <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-400'>
                  Move Date
                </label>
              </div>
            </div>
            <div className='flex flex-col md:flex-row w-full max-w-[800px] justify-between'>
              <div className='border border-slate-300 rounded-xl relative w-full max-w-[351px] mb-4 md:mr-2'>
                <select
                  onChange={(e) => setRef(e.target.value)}
                  value={ref}
                  className='px-4 py-2 w-full rounded-xl'>
                  <option onClick={() => setRef("Referals")}> Referals </option>
                  <option onClick={() => setRef("Social Media Pages")}>
                    {" "}
                    Social Media Pages{" "}
                  </option>
                  <option onClick={() => setRef("Internet Search")}>
                    {" "}
                    Internet Search{" "}
                  </option>
                  <option onClick={() => setRef("Door To Door Marketing")}>
                    {" "}
                    Door To Door Marketing{" "}
                  </option>
                  <option onClick={() => setRef("Taylor Mover Trucks")}>
                    {" "}
                    Taylor Mover Trucks{" "}
                  </option>
                  <option onClick={() => setRef("Previous Interactions")}>
                    {" "}
                    Previous Interactions{" "}
                  </option>
                </select>
                <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-400'>
                  How did you hear about us
                </label>
              </div>
            </div>

            {/* <textarea value={message} onChange={() => setMessage(message)} cols="30" rows="10" className='my-4 border border-grey-500 rounded-xl w-full max-w-[351px] md:max-w-[800px]'/> */}

            <div className="mb-6">
              <ReCAPTCHA
                ref={recaptchaRef}
                size="invisible"
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              />
            </div>
            <button
              type='submit'
              disabled={isSubmitting}
              className='bg-[#DB421B] text-white px-6 py-3 rounded-xl hover:bg-[#c13817] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
              {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Quote
