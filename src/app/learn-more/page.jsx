
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, QrCode, UserCheck } from 'lucide-react';

const StepCard = ({ icon, title, description, colorClass, delay }) => (
  <div 
    className={`p-6 rounded-2xl flex items-start space-x-4 animate-fade-in ${colorClass}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="flex-shrink-0 text-black/70">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-lg text-black">{title}</h3>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  </div>
);

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-pastel-beige font-sans">
        <header className="container mx-auto px-6 py-4 flex justify-between items-center bg-white">
          <div className="text-2xl font-bold text-black">AttendSys</div>
        </header>
        
        <main className="container mx-auto px-6 py-12">
            <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                 <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 leading-tight">
                    How It Works
                </h1>
                <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                    A simple, three-step process to streamline your classroom attendance.
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-16 items-center">
                 <div className="relative h-full animate-fade-in" style={{ animationDelay: '1.7s', animationDuration: '3s' }}>
                    <Image
                        src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop"
                        width={800}
                        height={1200}
                        alt="Person working on a laptop"
                        className="rounded-3xl object-cover h-full shadow-lg"
                        data-ai-hint="person laptop"
                    />
                    <div className="absolute -bottom-8 -right-8 bg-white p-4 rounded-xl shadow-lg w-72 animate-fade-in" style={{ animationDelay: '1.7s', animationDuration: '3s' }}>
                        <div className="flex items-center space-x-3">
                            <UserCheck className="text-blue-500 h-8 w-8" />
                            <div>
                                <p className="font-bold">Effortless for Students</p>
                                <p className="text-sm text-gray-500">Scan, enter name, and they're done. It's that simple.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <StepCard 
                      icon={<PlusCircle size={32} />}
                      title="Step 1: Create a Session"
                      description="From your dashboard, create a new class session. Set the date, time, and how close students need to be to check in."
                      colorClass="bg-pastel-lavender"
                      delay={0.2}
                    />
                    <StepCard 
                      icon={<QrCode size={32} />}
                      title="Step 2: Share the QR Code"
                      description="A unique QR code is generated for each session. Display it on screen or share the link with your students."
                      colorClass="bg-pastel-green"
                      delay={0.2}
                    />
                    <StepCard 
                      icon={<UserCheck size={32} />}
                      title="Step 3: Track in Real-Time"
                      description="As students scan the code and check in, your attendance dashboard updates instantly. See who's present, late, or absent at a glance."
                      colorClass="bg-pastel-yellow"
                      delay={0.2}
                    />
                </div>
            </div>

            <div className="text-center mt-20 animate-fade-in" style={{ animationDelay: '1s' }}>
                <h2 className="text-3xl font-bold text-black">Ready to Simplify Attendance?</h2>
                <p className="text-gray-600 mt-3 mb-6">Join hundreds of educators who are saving time and reducing classroom admin.</p>
                 <Link href="/" passHref>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-10 py-6 text-lg">
                        Get Started
                    </Button>
                </Link>
            </div>
        </main>
         <style jsx>{`
            .bg-pastel-beige {
                background-color: hsl(var(--pastel-beige));
            }
            .bg-pastel-lavender {
                background-color: hsl(var(--pastel-lavender));
            }
            .bg-pastel-green {
                background-color: hsl(var(--pastel-green));
            }
            .bg-pastel-yellow {
                background-color: hsl(var(--pastel-yellow));
            }
        `}</style>
    </div>
  )
}
