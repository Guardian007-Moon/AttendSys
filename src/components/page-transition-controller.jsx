'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { usePageTransition } from '@/context/PageTransitionContext';

// This component now wraps the children and hides the spinner when the path changes.
export default function PageTransitionController({ children }) {
  const { setIsTransitioning } = usePageTransition();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Hide the spinner whenever the path changes.
    // This will run on initial load and on subsequent navigations.
    setIsTransitioning(false);
  }, [pathname, searchParams, setIsTransitioning]);

  return <>{children}</>;
}
