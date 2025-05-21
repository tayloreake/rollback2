import { Modal } from "antd"
import Image from "next/image"
import React, { useState, useRef } from "react"
import QuoteForm from "./Form"
// import ReCAPTCHA from "react-google-recaptcha"
// import ReviewsForm from "./reviews-form"

const QuoteModal = ({isModalOpen}) => {
//   const [isModalOpen, setIsModalOpen] = useState(false)
  
  const showModal = () => {
    setIsModalOpen(true);
  }
  

  return (
    
      <Modal
        title={null}
        open={isModalOpen}
        footer={null}
        width={380}>
        <QuoteForm />
      </Modal>
  )
}

export default QuoteModal
