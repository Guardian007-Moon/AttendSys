
'use client';

import { usePageTransition } from '@/context/PageTransitionContext';
import { School } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function Spinner() {
  const { isTransitioning, setIsTransitioning } = usePageTransition();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Hide the spinner whenever the path changes, which means the new page is ready.
    setIsTransitioning(false);
  }, [pathname, searchParams, setIsTransitioning]);


  return (
    <div
      className={cn(
        'fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm transition-opacity duration-300 ease-in-out',
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

// Wrapper to prevent SSR issues and hydration errors.
export default function PageTransitionSpinner() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <Spinner /> : null;
}
