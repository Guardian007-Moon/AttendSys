
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle, ArrowRight, QrCode, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-pastel-beige text-gray-800 font-sans">
      <div className="bg-white">
        <header className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-black">AttendSys</div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/courses" className="hover:text-primary">Dashboard</Link>
            <Link href="#" className="hover:text-primary">Features</Link>
            <Link href="#" className="hover:text-primary">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login" passHref>
              <button className="hidden md:block text-black font-medium">Login</button>
            </Link>
            <Link href="/signup" passHref>
              <Button className="bg-black text-white px-6 py-2 rounded-full font-medium">Sign up</Button>
            </Link>
          </div>
        </header>
      </div>

      <main className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <span className="inline-block bg-pastel-mint text-black px-4 py-2 rounded-full text-sm font-medium mb-4">
              Smarter Attendance Tracking ✨
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-black leading-tight mb-6">
              The Simple, Modern Way to Track Attendance 🚀
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Save time, reduce paperwork, and get real-time insights into student attendance with our easy-to-use system. Perfect for modern educators.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href="/login" passHref>
                <Button className="bg-black text-white px-8 py-4 rounded-full font-semibold flex items-center space-x-2">
                  <span>Go to Dashboard</span>
                  <ArrowRight size={20} />
                </Button>
              </Link>
               <button className="bg-white text-black px-8 py-4 rounded-full font-semibold border border-gray-300 flex items-center space-x-2">
                <PlayCircle size={20} />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-pastel-mint rounded-3xl w-full aspect-square flex items-center justify-center p-8">
               <Image
                  src="https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=800&auto=format&fit=crop"
                  width={700}
                  height={700}
                  alt="Teacher using a tablet in a classroom"
                  className="rounded-2xl object-cover w-full h-full shadow-lg"
                  data-ai-hint="teacher tablet"
                />
            </div>
            <div className="absolute -bottom-8 -left-12 bg-white p-4 rounded-xl shadow-lg w-64 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center space-x-3">
                    <div>
                        <p className="font-bold">Real-time Check-in</p>
                        <p className="text-sm text-gray-500">Attendance is updated live as students check in.</p>
                    </div>
                </div>
            </div>
             <div className="absolute -top-8 -right-12 bg-white p-4 rounded-xl shadow-lg w-56 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                <p className="font-bold mb-2">Share QR Code</p>
                <div className="flex justify-center">
                    <QrCode className="w-24 h-24 text-gray-700" />
                </div>
                 <p className="text-xs text-gray-400 mt-2 text-center">Students scan to check in instantly.</p>
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
