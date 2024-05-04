import { useState, useEffect } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

export default function useScroll(): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
  });

  const handleScroll = () => {
    setScrollPosition({
      x: window.scrollX,
      y: window.scrollY,
    });
  };

  useEffect(() => {
    document.body.addEventListener('scroll', handleScroll);
    return () => {
      document.body.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollPosition;
}
