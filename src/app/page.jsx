
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle, ArrowRight, QrCode, CheckCircle, School } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-pastel-beige text-gray-800 font-sans">
      <div className="bg-white animate-fade-in">
        <header className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-2xl font-bold text-black">
            <School className="h-8 w-8 text-blue-600" />
            <span>AttendSys</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login" passHref>
              <Button variant="ghost" className="hidden md:block text-black font-medium hover:bg-blue-600 hover:text-white">Login</Button>
            </Link>
            <Link href="/signup" passHref>
              <Button className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-blue-600 hover:text-white">Sign up</Button>
            </Link>
          </div>
        </header>
      </div>

      <main className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left animate-fade-in">
            <span 
              className="inline-block bg-pastel-mint text-black px-4 py-2 rounded-full text-sm font-medium mb-4"
            >
              Smarter Attendance Tracking ✨
            </span>
            <h1 
              className="text-5xl md:text-6xl font-extrabold text-black leading-tight mb-6 flex items-center justify-center md:justify-start"
            >
              The Simple, Modern Way to Track Attendance 📋
            </h1>
            <p 
              className="text-lg text-gray-600 mb-8"
            >
              Save time, reduce paperwork, and get real-time insights into student attendance with our easy-to-use system. Perfect for modern educators.
            </p>
            <div 
              className="flex justify-center md:justify-start items-center space-x-4"
            >
               <Link href="/learn-more" passHref>
                 <Button className="bg-black text-white rounded-full px-8 py-6 text-lg hover:bg-blue-600 hover:text-white">
                    Learn more
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
               </Link>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="bg-pastel-mint rounded-3xl w-full aspect-square flex items-center justify-center p-8">
               <Image
                  src="https://files.structurae.net/files/photos/2768/00031.jpg"
                  width={700}
                  height={700}
                  alt="Teacher using a tablet in a classroom"
                  className="rounded-2xl object-cover w-full h-full shadow-lg"
                  data-ai-hint="teacher classroom"
                />
            </div>
            <div 
              className="absolute -bottom-8 -left-12 bg-white p-4 rounded-xl shadow-lg w-64 animate-fade-in" 
            >
                <div className="flex items-center space-x-3">
                    <CheckCircle className="text-green-500 h-8 w-8" />
                    <div>
                        <p className="font-bold">Real-time Check-in</p>
                        <p className="text-sm text-gray-500">Attendance is updated live as students check in.</p>
                    </div>
                </div>
            </div>
             <div 
              className="absolute -top-8 -right-12 bg-white p-4 rounded-xl shadow-lg w-64 animate-fade-in" 
            >
                <div className="flex items-center space-x-3">
                    <QrCode className="text-gray-700 h-8 w-8" />
                  <div>
                    <p className="font-bold">Share QR Code</p>
                    <p className="text-sm text-gray-500">Students scan a unique code to check in instantly.</p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </main>
      <style jsx>{`
        body {
          background-color: hsl(var(--pastel-beige));
        }
        .font-sans {
          font-family: 'Inter', sans-serif;
        }
        .bg-pastel-beige {
            background-color: hsl(var(--pastel-beige));
        }
        .bg-pastel-mint {
            background-color: hsl(var(--pastel-mint));
        }
      `}</style>
    </div>
  );
}
