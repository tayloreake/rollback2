import { Modal } from "antd"
import Image from "next/image"
import React, { useState, useRef, useEffect } from "react"
import QuoteForm from "./Form"
// import ReCAPTCHA from "react-google-recaptcha"
// import ReviewsForm from "./reviews-form"

const QuoteModal = ({ quotebtn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true);
  }


  return (
    <>

      <button
        onClick={() => setIsModalOpen(true)}
        className={`quote-modal-trigger my-4 mx-auto btn text-white ${quotebtn == "orange" ? "!bg-[#FF5000]" : "!bg-[#313D39]"} rounded-2xl font-[600] px-4 py-3`}>
        REQUEST QUOTE
      </button>
      <Modal
        title={null}
        open={isModalOpen}
        footer={null}
        className="no-pad-modal"
        onClose={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        width={320}>
        {/* <span onClick={() => setIsModalOpen(false)}>Close</span> */}
        <QuoteForm />
        <div className="pb-3"></div>
      </Modal>
    </>

  )
}

export default QuoteModal
