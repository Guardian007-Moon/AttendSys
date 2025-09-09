
'use client';

import { usePageTransition } from '@/context/PageTransitionContext';
import { School } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

function Spinner() {
  const { isTransitioning } = usePageTransition();
  const [shouldRender, setShouldRender] = useState(false);

  // This effect ensures the spinner doesn't cause a hydration mismatch
  // and correctly handles the fade-out animation.
  useEffect(() => {
    let timeout;
    if (isTransitioning) {
      setShouldRender(true);
    } else {
      // Delay hiding to allow for the fade-out animation to complete
      timeout = setTimeout(() => setShouldRender(false), 500);
    }
    return () => clearTimeout(timeout);
  }, [isTransitioning]);

  // Don't render anything on the server or if it shouldn't be visible.
  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm transition-opacity duration-500 ease-in-out',
        // We control visibility with the isTransitioning state
        isTransitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
        <div className="relative flex items-center justify-center h-40 w-40">
             {/* Pulsing background circles */}
            <div className="absolute h-full w-full bg-blue-500/20 rounded-full animate-ping delay-100"></div>
            <div className="absolute h-2/3 w-2/3 bg-blue-500/20 rounded-full animate-ping delay-300"></div>
            
            {/* Logo container */}
            <div className="relative h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <School className="h-12 w-12 text-blue-600 animate-pulse" />
            </div>
        </div>
      <p className="mt-6 text-lg font-medium text-gray-700 animate-fade-in" style={{animationDelay: '0.5s'}}>
        Loading your dashboard...
      </p>
    </div>
  );
}

// Wrapper to prevent SSR issues with the spinner
export default function PageTransitionSpinner() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <Spinner /> : null;
}
