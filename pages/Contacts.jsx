import Image from "next/image"
import React, { useState } from "react"
import Featured from "../components/Contacts/Featured"
import Testimonials from "../components/homepage/Testimonials"
import { toast } from "react-toastify"
import PageTitle from "../components/PageTitle"

const Contacts = () => {
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [email, setEmail] = useState("")
  const [number, setNumber] = useState("")
  const [message, setMessage] = useState("")

  const isValidPhoneNumber = (phoneNumber) => {
    return /0\d{9}$/.test(phoneNumber)
  }

  const handleSendSMS = async () => {
    const messageContent = formatMessageContent()

    try {
      const options = {
        to: [`+254721410517`],
        message: messageContent,
      }

      const emailOptions = {
        to: email,
        message: messageContent,
      }
      const smsResponse = await fetch("/api/sendSms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      })
      if (!smsResponse.ok) {
        const errorData = await smsResponse.json();
        toast.error(errorData.error || errorData.message || 'Failed to send SMS')
        throw new Error(errorData.error || errorData.message || 'Failed to send SMS');
      }
      const emailResponse = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailOptions),
      })
      const smsData = await smsResponse.json()
      const emailData = await emailResponse.json()

      // toast.success("Request submitted")
      setFname("")
      setLname("")
      setEmail("")
      setMessage("")
      setNumber("")
    } catch (error) {
      console.error("Error sending SMS/email:", error)
    }
  }
  const formatMessageContent = () => {
    const msg = `
          Someone is trying to reach to you through the website contact page:
          Name: ${fname}
          Name: ${lname}
          Email: ${email}
          Phone Number: ${number}
          Message: ${message}
        `

    return msg
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!fname || !lname || !email || !number || !message)
      return toast.error("Please fill in all fields correctly")
    if (isValidPhoneNumber(number)) {
      // Phone number is valid, proceed with form submission
      handleSendSMS()
      // Add your form submission logic here
      toast.success("Your message has been sent")
    } else {
      // Phone number does not match the required format, show error message
      toast.error("Phone number does not match the required format +254...")
    }
  }

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <PageTitle title={"Contact Us"} />
      <div className='w-full h-full flex flex-col items-center justify-center max-w-[1440px]'>
        <div className='py-12  flex flex-col px-4'>
          <h1 className='mb-4 md:mb-12 text-xl'>Feel Free To Contact Us</h1>
          <p>
            We are here to assist you with any inquiries you may have regarding
            Taylor Movers and the services we provide. Please feel free to
            contact us by filling out the form below, and we will respond to
            your message as promptly as possible.
          </p>
          <div className='my-4 py-4 flex flex-col md:flex-row justify-between'>
            <div className='flex flex-col'>
              <h3 className='mb-4 text-lg text-gray-500'>
                Main Office Contact Details
              </h3>
              <p className='mb-2 text-[#DB421B]'>Nairobi Office: </p>
              <p className='mb-4 text-sm'>
                Nazarene Complex Suite 1, Central Church of The Nazarene
                <br />
                Ngong Road,
                <br />
                Nairobi, Kenya
                <br />
                Tel: 0721410517
                <br />
                Email: info@taylorea.com
              </p>
              <p className='mb-2 text-[#DB421B]'>Mombasa Office: </p>
              <p className='mb-2 text-sm'>
                Moi Avenue,
                <br />
                Ivory Building, 2nd Floor
                <br />
                Mombasa Kenya.
                <br />
                Tel: 0758590998
                <br />
                Email: msacc@taylorea.com
              </p>
            </div>
            <Image
              src='/assets/Contacts/map2.png'
              alt='map'
              width={669}
              height={368}
              className=' w-full md:max-w-[669px]  my-4'
            />
          </div>
        </div>
        <div className='flwe flex-col w-full px-4 mb-4'>
          <h3 className='text-lg mb-4'>Contact Us</h3>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className='w-full flex flex-col'>
            <div className='flex flex-col md:flex-row w-full max-w-[800px] justify-between'>
              <div className='border border-slate-300 rounded-xl relative w-full max-w-[351px] mb-4 md:mr-2'>
                <input
                  type='text'
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  className='px-4 w-full py-2 rounded-xl'
                />
                <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-400'>
                  First Name
                </label>
              </div>
              <div className='border border-slate-300 rounded-xl relative w-full max-w-[351px] mb-4 md:mr-2'>
                <input
                  type='text'
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  className='px-4 w-full py-2 rounded-xl'
                />
                <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-400'>
                  Last Name
                </label>
              </div>
            </div>
            <div className='flex flex-col md:flex-row w-full max-w-[800px] justify-between'>
              <div className='border border-slate-300 rounded-xl relative w-full max-w-[351px] mb-4 md:mr-2'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='px-4 w-full py-2 rounded-xl'
                />
                <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-400'>
                  Email
                </label>
              </div>
              <div className='border border-slate-300 rounded-xl relative w-full max-w-[351px] mb-4 md:mr-2'>
                <input
                  type='text'
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className='px-4 w-full py-2 rounded-xl'
                />
                <label className='absolute top-[-8px] bg-white left-5 text-xs px-2 text-gray-400'>
                  Phone Number
                </label>
              </div>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              cols='30'
              rows='10'
              className='p-3 my-4 border border-grey-500 rounded-xl w-full max-w-[351px] md:max-w-[800px]'
            />

            <button
              type='submit'
              className='px-4 py-2 bg-[#E25B3B] text-white max-w-[130px]'>
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className='mt-8 w-full'>
        <Testimonials />
      </div>
    </div>
  )
}

export default Contacts
