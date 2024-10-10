import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed p-3 text-white transition duration-300 rounded-full shadow-lg bg-indigoBlue bottom-10 left-10 hover:bg-blue-600 focus:outline-none"
          style={{ zIndex: 1000 }}
          aria-label="Back to top"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
};

export default BackToTop;
