
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const CourseBannerImage = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset image source when the src prop changes
    setImageSrc(src);
    setHasError(false);
  }, [src]);

  const fallbackSrc = `https://placehold.co/600x200/e2e8f0/475569?text=${encodeURIComponent(alt)}`;

  const handleError = () => {
    // Only set the fallback if an error hasn't already been handled
    if (!hasError) {
      setImageSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <Image
      src={imageSrc || fallbackSrc}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
};

export default CourseBannerImage;

    