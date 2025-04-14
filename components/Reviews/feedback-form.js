import { Modal, notification } from "antd";
import Image from "next/image";
import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Feedback from "../../pages/Feedback";


const FeedbackForm = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [finalized, setFinalized] = useState(null);
    const [ratings, setRatings] = useState(Array(9).fill(0));
    const [referralLikelihood, setReferralLikelihood] = useState(0);
    const [comments, setComments] = useState("");
    const [howHeard, setHowHeard] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const recaptchaRef = useRef(null);
    const [captchaValue, setCaptchaValue] = useState(null);

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    const handleRatingChange = (index, value) => {
        const newRatings = [...ratings];
        newRatings[index] = value;
        setRatings(newRatings);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOk = async () => {
        // if (!captchaValue) {
        //     notification.error({
        //         message: "Please complete the CAPTCHA",
        //         description: "You must verify you are human before submitting.",
        //         placement: "topRight",
        //     });
        //     return;
        // }

        setIsSubmitting(true);

        try {
            // Submit logic here
            setSuccess(true);
            setError("");
            setIsModalOpen(false);

            notification.success({
                message: "Thank you for your feedback!",
                description: "We appreciate you sharing your experience with us.",
                placement: "topRight",
            });
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6">
                Share Your Moving Experience
            </h2>
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-[#DB421B] text-white rounded-full hover:bg-[#c13914]"
            >
                Leave a Review
            </button>

            
                <div className="p-6">
                    {/* Your whole form goes here, no changes needed inside */}
                    {/* First Name */}
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name *"
                        className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#DB421B]"
                    />

                    {/* Last Name */}
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#DB421B]"
                    />

                    {/* Email */}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email *"
                        className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#DB421B]"
                    />

                    {/* Mobile */}
                    <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Mobile Number *"
                        className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-[#DB421B]"
                    />

                    {/* Was the Removal finalized? */}
                    

                    {/* Likelihood to refer */}
                    <div className="mb-6">
                        <p className="mb-2 font-medium">How likely are you to refer us (1-10)?</p>
                        <div className="flex flex-wrap gap-3">
                            {Array.from({ length: 10 }, (_, i) => (
                                <label key={i + 1} className="flex items-center gap-1">
                                    <input
                                        type="radio"
                                        name="referralLikelihood"
                                        value={i + 1}
                                        onChange={() => setReferralLikelihood(i + 1)}
                                    />
                                    {i + 1}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Additional Comments */}
                    <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Any recommendations, suggestions or comments?"
                        className="w-full p-3 border rounded-lg mb-6 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#DB421B]"
                    />

                    {/* How did you get to know us? */}
                    <div className="mb-6">
                        <p className="mb-2 font-medium">How did you get to know us?</p>
                        <div className="flex flex-wrap gap-6">
                            {["Referral", "Online", "Saw Our Truck", "Others"].map((option) => (
                                <label key={option} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="howHeard"
                                        value={option}
                                        onChange={() => setHowHeard(option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* reCAPTCHA */}
                    <div className="mb-6 flex justify-center">
                        {/* <ReCAPTCHA
                            ref={recaptchaRef}
                            size="normal"
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                            onChange={handleCaptchaChange}
                        /> */}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleOk}
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-[#DB421B] text-white rounded-full hover:bg-[#c13914]"
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </div>

        </div>
    );
};

export default FeedbackForm;
