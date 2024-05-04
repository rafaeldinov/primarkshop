'use client';

import Image from 'next/image';
import styles from './picture.module.scss';
import noImage from '../../public/images/no-image.svg';
import { useEffect, useState } from 'react';

export default function Picture({ src, alt }: { src: string; alt: string }) {
  const [imageWithSize, setImageWithSize] = useState({
    width: 0,
    height: 0,
  });
  const [error, setError] = useState(false);

  const url = error || !src ? noImage.src : src;

  useEffect(() => {
    const img = new window.Image();
    img.onerror = () => setError(true);
    img.onload = () => {
      setImageWithSize({ width: img.width, height: img.height });
    };
    img.src = src;
  }, [src]);

  return (
    <div className={styles.picture}>
      <img
        src={url}
        className={styles.image}
        alt={alt}
        width={!error ? imageWithSize.width : noImage.width}
        height={!error ? imageWithSize.height : noImage.height}
      />
    </div>
  );
}
