import { Modal } from "antd"
import Image from "next/image"
import React, { useState, useRef } from "react"
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
        width={500}>
        <div className="text-4xl">Some class is here</div>
      </Modal>
  )
}

export default QuoteModal
