
'use client';

import Link from 'next/link';
import { usePageTransition } from '@/context/PageTransitionContext';
import { usePathname } from 'next/navigation';

const PageTransitionLink = ({ href, children, ...props }) => {
  const { setIsTransitioning } = usePageTransition();
  const pathname = usePathname();

  const handleClick = (e) => {
    // If the link is to the current page, don't trigger the transition
    if (href === pathname) return;

    // Set transitioning to true when the link is clicked
    setIsTransitioning(true);
  };

  return (
    <Link href={href} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default PageTransitionLink;
