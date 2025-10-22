import React, { useState, useEffect, useRef } from "react"
import QuoteForm from "./Form"
import { gtmTrackButtonClick } from '../../utils/gtm'
import ErrorBoundary from '../ErrorBoundary'

const QuoteModal = ({ quotebtn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [modalError, setModalError] = useState(null)
  const modalRef = useRef(null)
  const openTimeoutRef = useRef(null)

  const showModal = async () => {
    // Clear any previous timeout
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
    }

    try {
      setIsLoading(true);
      setModalError(null);

      // Track quote modal open with timeout
      const trackingPromise = gtmTrackButtonClick('Request Quote Modal Open', 'quote_modal', {
        modal_type: 'Quote Request',
        button_color: quotebtn
      });

      // Add timeout for tracking (don't let it block modal opening)
      const timeoutPromise = new Promise((resolve) => {
        openTimeoutRef.current = setTimeout(resolve, 2000);
      });

      // Race between tracking and timeout
      await Promise.race([trackingPromise, timeoutPromise]);

      // Open modal
      setIsModalOpen(true);
      
      // Prevent body scroll when modal is open
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
      }
    } catch (error) {
      console.error('Error opening modal:', error);
      setModalError('Failed to open quote form. Please try again.');
      // Still attempt to open the modal
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }

  const closeModal = () => {
    try {
      setIsModalOpen(false);
      setModalError(null);
      
      // Clear any pending timeouts
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
        openTimeoutRef.current = null;
      }
      
      // Restore body scroll when modal is closed
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'unset';
        document.body.classList.remove('modal-open');
      }
    } catch (error) {
      console.error('Error closing modal:', error);
      setIsModalOpen(false); // Still close the modal even if there's an error
    }
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

  // Clean up body overflow and timeouts on unmount
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'unset';
        document.body.classList.remove('modal-open');
      }
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
      }
    };
  }, []);

  // Handle click outside to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }

  return (
    <>
      <button
        onClick={showModal}
        disabled={isLoading}
        className={`quote-modal-trigger my-4 mx-auto btn text-white ${quotebtn == "orange" ? "!bg-[#FF5000]" : "!bg-[#313D39]"} rounded-2xl font-[600] px-4 py-3 hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}>
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Loading...</span>
          </div>
        ) : (
          'REQUEST QUOTE'
        )}
      </button>
      
      {/* Enhanced Custom Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          {/* Modal Container - Centered and Scrollable */}
          <div className="flex items-start justify-center min-h-screen p-2 sm:p-4 pt-4 sm:pt-8 pb-4">
            <div 
              ref={modalRef}
              className="relative w-full max-w-md bg-white rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxHeight: '95vh',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Close Button - Fixed Header */}
              <div className="flex justify-end p-3 border-b border-gray-100 bg-white rounded-t-xl flex-shrink-0">
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-light p-1 hover:bg-gray-100 rounded-full transition-colors w-8 h-8 flex items-center justify-center"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              
              {/* Scrollable Content Area */}
              <div 
                className="flex-1 overflow-hidden quote-modal-scroll"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth',
                  overscrollBehavior: 'contain',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0
                }}
              >
                <div className="quote-form-scroll-wrapper" style={{ minHeight: '100%' }}>
                  {modalError ? (
                    <div className="p-6 bg-red-50 border border-red-200 rounded-lg m-4">
                      <div className="text-red-800 font-medium mb-2">Error</div>
                      <div className="text-red-700 text-sm mb-4">{modalError}</div>
                      <button
                        onClick={() => setModalError(null)}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <ErrorBoundary>
                      <QuoteForm />
                    </ErrorBoundary>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default QuoteModal
