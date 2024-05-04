'use client';

import { useEffect, useState } from 'react';
import noImage from '../public/images/no-image.svg';

export default function useImageSize(src: string) {
  const [imageWithSize, setImageWithSize] = useState({
    width: 0,
    height: 0,
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onerror = () => setError(true);
    img.onload = () => {
      setImageWithSize({ width: img.width, height: img.height });
    };
    img.src = error ? noImage.src : src;
  }, [src, error]);

  return { imageWithSize, error };
}
