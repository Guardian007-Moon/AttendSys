
'use client';

import { createContext, useState, useContext } from 'react';

const PageTransitionContext = createContext();

export const PageTransitionProvider = ({ children }) => {
  // Start with transitioning as false. It will be set to true on link clicks.
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
