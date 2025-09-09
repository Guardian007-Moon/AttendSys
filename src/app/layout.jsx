
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { PageTransitionProvider } from '@/context/PageTransitionContext';
import PageTransitionSpinner from '@/components/page-transition-spinner';
import PageTransitionController from '@/components/page-transition-controller';
import { Suspense } from 'react';

export const metadata = {
  title: 'QTrack',
  description: 'A simple and modern attendance tracking application.',
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <PageTransitionProvider>
          {/* The controller is now a direct child of the provider */}
          <PageTransitionController>
            {children}
          </PageTransitionController>
          <PageTransitionSpinner />
          <Toaster />
        </PageTransitionProvider>
      </body>
    </html>
  );
}
