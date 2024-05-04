'use client';

import { useEffect, useState } from 'react';

export default function UpButton() {
  const [isButtonUp, setIsButtonUp] = useState(false);

  const handleUpButtonClick = () => {
    setIsButtonUp(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      window.scrollY > 1000 ? setIsButtonUp(true) : setIsButtonUp(false);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    isButtonUp && (
      <svg
        onClick={handleUpButtonClick}
        width='48px'
        height='48px'
        strokeWidth='1.5'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        color='#878383'
      >
        <path
          d='M6 20L18 20'
          stroke='#878383'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        ></path>
        <path
          d='M12 16V4M12 4L15.5 7.5M12 4L8.5 7.5'
          stroke='#878383'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        ></path>
      </svg>
    )
  );
}
