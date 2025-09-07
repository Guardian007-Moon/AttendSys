
'use client';

import { usePageTransition } from '@/context/PageTransitionContext';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PageTransitionSpinner() {
  const { isTransitioning } = usePageTransition();

  return (
    <div
      className={cn(
        'fixed inset-0 z-[999] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300',
        isTransitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
