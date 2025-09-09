
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const CourseBannerImage = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Generate a fallback URL with the alt text encoded, so it's descriptive
  const fallbackSrc = `https://placehold.co/600x200/e2e8f0/475569?text=${encodeURIComponent(alt)}`;

  useEffect(() => {
    // When the src prop changes, reset the state
    setImageSrc(src);
    setHasError(false);
  }, [src]);


  const handleError = () => {
    // Only set the fallback if an error hasn't already been handled for the current src
    if (!hasError) {
      setImageSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <Image
      // Use the state-managed image source, which will be the original or the fallback
      src={imageSrc || fallbackSrc}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
};

export default CourseBannerImage;
