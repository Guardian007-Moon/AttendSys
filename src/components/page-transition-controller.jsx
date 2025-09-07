
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { usePageTransition } from '@/context/PageTransitionContext';

export default function PageTransitionController() {
  const { setIsTransitioning } = usePageTransition();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Hide the spinner whenever the path changes.
    // This will run on initial load and on subsequent navigations.
    setIsTransitioning(false);
  }, [pathname, searchParams, setIsTransitioning]);

  // We don't need to listen to router events for `routeChangeStart`
  // because the spinner is shown by default and hidden only when
  // the new page content is available (in the useEffect above).
  // This approach is simpler and works well with Suspense.
  // We'll keep the component name as is for clarity of purpose.

  return null;
}
