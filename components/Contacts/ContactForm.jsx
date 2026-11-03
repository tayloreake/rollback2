// ContactForm.jsx
import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import ReCAPTCHA from "../SafeRecaptcha"
import AttributionHiddenFields from "../AttributionHiddenFields"
import { getAttribution, getFormAttribution } from "../../utils/attribution"
import { gtmPushLead } from "../../utils/gtm"

const ContactForm = () => {
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [email, setEmail] = useState("")
    const [number, setNumber] = useState("")
    const [message, setMessage] = useState("")
    const recaptchaRef = useRef(null)
    const router = useRouter()

    const isValidPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return false
        const v = phoneNumber.trim()
        // International: optional + then digits with spaces, dashes, dots or parentheses; 7-15 digits total (E.164)
        if (!/^\+?[0-9][0-9\s().-]{5,20}$/.test(v)) return false
        const digits = v.replace(/\D/g, "")
        return digits.length >= 7 && digits.length <= 15
    }

    const handleSendSMS = async () => {
        const messageContent = formatMessageContent()
        const att = getAttribution()
        const formAtt = getFormAttribution()

        // 1. Email + Zoho first — that is the system of record. The internal
        // SMS alert must never block a lead from reaching the CRM.
        let emailOk = false
        try {
            const emailToken = await recaptchaRef.current?.executeAsync?.();
            if (!emailToken) {
                throw new Error('Failed to verify reCAPTCHA for email');
            }
            const emailOptions = {
                message: messageContent,
                recaptchaToken: emailToken,
                confirmTo: email,
                inquiry: {
                  name: `${fname} ${lname}`.trim(),
                  email: email,
                  phone: number,
                  source: "Contact Form",
                  // Full first-touch attribution (UTMs, campaign_id, landing, referrer) + Google Ads
                  // click id + SalesIQ visitor id, so the CRM record ties to the ad click and visit history
                  attribution: { ...att, ...formAtt },
                  gclid: att.gclid || formAtt.gclid || "",
                  siq_visitor_id: att.siq_visitor_id || formAtt.siq_visitor_id || "",
                  notes: `Contact via website | From: ${fname} ${lname} | ${message.slice(0, 150)}`,
                },
            }
            const emailResponse = await fetch("/api/sendEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(emailOptions),
            })
            const emailData = await emailResponse.json().catch(() => ({}))
            if (!emailResponse.ok) {
                toast.error(emailData.error || emailData.message || "Failed to send your message")
            } else {
                emailOk = true
            }
        } catch (error) {
            console.error("Error sending contact email:", error)
            toast.error("We couldn't send your message. Please call us on +254 721 410 517.")
        }

        // 2. Best-effort internal SMS alert (owner notification only).
        try {
            recaptchaRef.current.reset();
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for reset
            const smsToken = await recaptchaRef.current?.executeAsync?.();
            if (smsToken) {
                const smsResponse = await fetch("/api/sendSms", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        to: [`+254721410517`],
                        message: messageContent,
                        recaptchaToken: smsToken,
                    }),
                })
                if (!smsResponse.ok) {
                    console.warn("Contact SMS notification failed:", smsResponse.status)
                }
            }
        } catch (error) {
            console.warn("Contact SMS notification failed:", error)
        }

        if (emailOk) {
            setFname("")
            setLname("")
            setEmail("")
            setMessage("")
            setNumber("")
            // Success: send the visitor to the thank-you page
            router.push("/ThankYou")
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
            // T6/T7 — lead push with campaign attribution (GTM → GA4/Ads)
            gtmPushLead({
                formId: "contact",
                referral: "",
                attribution: getFormAttribution(),
            })
            // Phone number is valid, proceed with form submission
            handleSendSMS()
        } else {
            // Phone number does not match the required format, show error message
            toast.error("Please enter a valid phone number with country code (e.g. +254 721 410 517 or +44 20 7946 0958)")
        }
    }
    return (
        <form
            onSubmit={(e) => handleSubmit(e)}
            className='flex-col'>
          {/* Filled by Zoho zcga.js with the Google Ads click id */}
          <input type="hidden" id="zc_gad" name="zc_gad" defaultValue="" />
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
                    placeholder="+254 721 410 517 / +44 20 7946 0958"
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
            {/* T7 — hidden UTM/GCLID/Campaign_ID attribution fields */}
            <AttributionHiddenFields />
        </form>
    )
};

export default ContactForm;
