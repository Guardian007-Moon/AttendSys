
'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const PageTransitionContext = createContext();

export const PageTransitionProvider = ({ children }) => {
  // Start with transitioning as false. We will set it to true on navigation.
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  return (
    <PageTransitionContext.Provider value={{ isTransitioning, setIsTransitioning }}>
      {children}
    </PageTransitionContext.Provider>
  );
};

export const usePageTransition = () => {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider');
  }
  return context;
};
