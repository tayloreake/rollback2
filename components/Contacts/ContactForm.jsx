// ContactForm.jsx
import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

const ContactForm = () => {
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [email, setEmail] = useState("")
    const [number, setNumber] = useState("")
    const [message, setMessage] = useState("")
    const recaptchaRef = useRef(null)

    const isValidPhoneNumber = (phoneNumber) => {
        return /0\d{9}$/.test(phoneNumber)
    }

    const handleSendSMS = async () => {
        const messageContent = formatMessageContent()

        try {
            const options = {
                to: [`+254721410517`],
                message: messageContent,
                recaptchaToken: null, // Will be set after reCAPTCHA verification
            }

            const smsToken = await recaptchaRef.current.executeAsync();
            if (!smsToken) {
                throw new Error('Failed to verify reCAPTCHA for SMS');
            }
            options.recaptchaToken = smsToken;

            recaptchaRef.current.reset();
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for reset
            // Then send email
            const emailToken = await recaptchaRef.current.executeAsync();
            if (!emailToken) {
                throw new Error('Failed to verify reCAPTCHA for email');
            }
            const emailOptions = {
                to: email,
                message: messageContent,
                recaptchaToken: emailToken,
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
        <form
            onSubmit={(e) => handleSubmit(e)}
            className='flex-col'>
            <div className='flex flex-col md:flex-row w-full max-w-[800px] justify-between'>
                <div className='rounded-xl relative w-full mb-4 md:mr-2'>
                    <label className='font-[600] text-sm text-gray-600 mb-1'>
                        First Name
                    </label>
                    <input
                        type='text'
                        value={fname}
                        required
                        placeholder="First Name"
                        onChange={(e) => setFname(e.target.value)}
                        className='px-2 w-full py-2 rounded-xl'
                    />

                </div>
                <div className='relative w-full mb-4 md:mr-2'>
                    <label className='font-[600] text-sm text-gray-600 mb-1'>
                        Last Name
                    </label>
                    <input
                        type='text'
                        value={lname}
                        placeholder="Last Name"
                        onChange={(e) => setLname(e.target.value)}
                        className='px-2 w-full py-2 rounded-xl'
                    />

                </div>
            </div>
            <div className='relative w-full mb-4 md:mr-2'>
                <label className='font-[600] text-sm text-gray-600 mb-1'>
                    Email
                </label>
                <input
                    type='email'
                    value={email}
                    placeholder="example@email.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className='px-2 w-full py-2 rounded-xl'
                />

            </div>
            <div className='relative w-full mb-4 md:mr-2'>
                <label className='font-[600] text-sm text-gray-600 mb-1'>
                    Mobile Phone
                </label>
                <input
                    type='text'
                    value={number}
                    required
                    placeholder="0712345678"
                    onChange={(e) => setNumber(e.target.value)}
                    className='px-2 w-full py-2 rounded-xl'
                />

            </div>

            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                cols='30'
                rows='10'
                placeholder="Message"
                className='p-3 my-2 border border-grey-500 rounded-xl w-full max-w-[351px] md:max-w-[800px]'
            />
            <ReCAPTCHA
                ref={recaptchaRef}
                size="invisible"
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            />
            <button
                type='submit'
                className='font-bold px-4 py-2 mb-2 bg-[#F05423] text-white w-full rounded-xl'>
                Send Message
            </button>
        </form>
    )
};

export default ContactForm;
