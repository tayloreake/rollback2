import React, { useState, useEffect } from "react"
import QuoteForm from "./Form"
import { gtmTrackButtonClick } from '../../utils/gtm'

const QuoteModal = ({ quotebtn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    // Track quote modal open
    gtmTrackButtonClick('Request Quote Modal Open', 'quote_modal', {
      modal_type: 'Quote Request',
      button_color: quotebtn
    });
    setIsModalOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  const closeModal = () => {
    setIsModalOpen(false);
    // Restore body scroll when modal is closed
    document.body.style.overflow = 'unset';
  }

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isModalOpen]);

  // Clean up body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      <button
        onClick={showModal}
        className={`quote-modal-trigger my-4 mx-auto btn text-white ${quotebtn == "orange" ? "!bg-[#FF5000]" : "!bg-[#313D39]"} rounded-2xl font-[600] px-4 py-3`}>
        REQUEST QUOTE
      </button>
      
      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-sm mx-4">
            <div className="bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
              {/* Close Button */}
              <div className="flex justify-end p-3 border-b border-gray-100">
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-light p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              
              {/* Scrollable Content */}
              <div 
                className="flex-1 overflow-y-auto overflow-x-hidden"
                style={{
                  maxHeight: 'calc(90vh - 60px)', // Account for close button
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth'
                }}
              >
                <QuoteForm />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default QuoteModal
