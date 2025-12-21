import React, { useState, useEffect, useRef } from 'react';

/**
 * WelcomeModal - An automatic welcome popup modal for IZHAIYAM brand
 * 
 * @param {string} logoSrc - Path to logo image (default: logo from assets)
 * @param {string} brandName - Brand name to display (default: "IZHAIYAM")
 * @param {boolean} showOnMount - Whether to show modal on component mount (default: true)
 */
const WelcomeModal = ({
  logoSrc = require('../../assets/logo.jpg'), // Change logo path here if needed
  brandName = 'IZHAIYAM', // Change brand name here if needed
  showOnMount = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const enterButtonRef = useRef(null);
  const modalRef = useRef(null);

  // Show modal on mount
  useEffect(() => {
    if (showOnMount) {
      setIsOpen(true);
    }
  }, [showOnMount]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus the enter button for accessibility
      setTimeout(() => {
        if (enterButtonRef.current) {
          enterButtonRef.current.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Welcome to ${brandName}`}
      style={{ padding: '5vh 1rem' }}
    >
      {/* Modal Container - Responsive max width */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md md:max-w-2xl mx-auto my-auto transform transition-all duration-300 scale-100 animate-fadeIn"
      >
        {/* Close Button - Top Right */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-10 h-10 flex items-center justify-center transition-all duration-200 text-white hover:text-gray-200 hover:scale-110"
          aria-label="Close welcome modal"
        >
          <span className="text-3xl font-light leading-none">&times;</span>
        </button>

        {/* Modal Content Card */}
        <div className="bg-[#93a267] rounded-2xl shadow-2xl overflow-hidden">
          {/* Desktop Layout - Compact square-ish design */}
          <div className="hidden md:flex" style={{ height: '380px' }}>
            {/* Left Side - Logo */}
            <div className="w-1/2 flex items-center justify-center p-6">
              <img
                src={logoSrc}
                alt={`${brandName} logo`}
                className="w-full h-full object-contain max-w-xs"
              />
            </div>

            {/* Right Side - Content */}
            <div className="w-1/2 flex flex-col items-center justify-center p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">
                Welcome to
              </h2>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wider">
                {brandName}
              </h1>
              <p className="text-white text-base mb-6 max-w-sm leading-relaxed opacity-90">
                Discover timeless elegance and craftsmanship in our curated collection of premium furniture
              </p>
              <button
                ref={enterButtonRef}
                onClick={handleClose}
                className="px-8 py-3 bg-white text-[#93a267] font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                aria-label={`Enter ${brandName} store`}
              >
                Enter Store
              </button>
            </div>
          </div>

          {/* Mobile Layout - Square-ish design with logo at top, content centered */}
          <div className="md:hidden flex flex-col items-center justify-center" style={{ height: '420px', maxHeight: '85vh' }}>
            {/* Logo Section - At Top */}
            <div className="flex items-center justify-center pt-8 pb-4">
              <img
                src={logoSrc}
                alt={`${brandName} logo`}
                className="w-32 h-32 object-contain"
              />
            </div>

            {/* Content Section - Centered */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 text-center">
              <h2 className="text-lg font-bold text-white mb-1">
                Welcome to
              </h2>
              <h1 className="text-2xl font-bold text-white mb-3 tracking-wider">
                {brandName}
              </h1>
              <p className="text-white text-sm mb-5 leading-relaxed px-2 opacity-90">
                Discover timeless elegance and craftsmanship
              </p>
              <button
                ref={enterButtonRef}
                onClick={handleClose}
                className="px-6 py-2.5 bg-white text-[#93a267] font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                aria-label={`Enter ${brandName} store`}
              >
                Enter Store
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom fade-in animation */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WelcomeModal;

/* ============================================
   USAGE EXAMPLE
   ============================================
   
   In your App.jsx or homepage:
   
   import WelcomeModal from './components/welcomeModal/WelcomeModal';
   
   function App() {
     return (
       <div className="App">
         <WelcomeModal />
         
         // Or with custom props:
         <WelcomeModal 
           logoSrc="/assets/izhaiyam-logo.png"
           brandName="IZHAIYAM"
           showOnMount={true}
         />
         
         // Rest of your app
       </div>
     );
   }
   
   ============================================ */
