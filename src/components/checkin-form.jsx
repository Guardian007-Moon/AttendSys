
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { loadStudentsByCourse, loadAttendance, saveAttendance, loadSession } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CheckCircle, Loader2, MapPin, User, Hash, Book, CheckSquare, BarChart3, FileText, Smartphone } from 'lucide-react';
import { getDistance } from 'geolib';

const checkinSchema = z.object({
  studentId: z.string().min(1, 'Please enter your student ID.'),
  name: z.string().min(3, 'Please enter your full name.'),
});

export default function CheckinForm({ courseId, sessionId }) {
  const { toast } = useToast();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const session = loadSession(courseId, sessionId);
    setSessionInfo(session);
  }, [courseId, sessionId]);

  const form = useForm({
    resolver: zodResolver(checkinSchema),
    defaultValues: { studentId: '', name: '' },
  });

  const getStudentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position.coords),
          (err) => reject(new Error(`Could not get location: ${err.message}`))
        );
      }
    });
  };

  const onSubmit = async (values) => {
    setIsCheckingIn(true);
    const session = loadSession(courseId, sessionId);

    if (!session || !session.teacherLocation) {
      toast({
        variant: "destructive",
        title: "Check-in Not Active",
        description: "The teacher has not started the check-in session yet.",
      });
      setIsCheckingIn(false);
      return;
    }

    try {
      const studentCoords = await getStudentLocation();
      const distance = getDistance(
        { latitude: session.teacherLocation.latitude, longitude: session.teacherLocation.longitude },
        { latitude: studentCoords.latitude, longitude: studentCoords.longitude }
      );
      const maxDistance = session.maxDistance || 100;

      if (distance > maxDistance) {
        toast({
          variant: "destructive",
          title: "Check-in Failed",
          description: `You are too far from the classroom. You are ${distance} meters away.`,
        });
        setIsCheckingIn(false);
        return;
      }

      const studentList = loadStudentsByCourse(courseId);
      const student = studentList.find(
        s => s.id.toLowerCase() === values.studentId.toLowerCase() && s.name.toLowerCase() === values.name.toLowerCase()
      );

      if (student) {
        const currentAttendance = loadAttendance();
        if (!currentAttendance[sessionId]) {
          currentAttendance[sessionId] = {};
        }

        let studentStatus = 'Present';
        if (session && session.startTime && session.checkinTimeLimit >= 0) {
          const now = new Date();
          const sessionDate = new Date(session.date);
          const [hours, minutes] = session.startTime.split(':');
          const deadline = new Date(sessionDate.getTime());
          deadline.setHours(hours, minutes, 0, 0);
          deadline.setMinutes(deadline.getMinutes() + session.checkinTimeLimit);

          if (now > deadline) {
            studentStatus = 'Late';
          }
        }

        currentAttendance[sessionId][student.id] = {
          status: studentStatus,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          distance: distance,
        };
        saveAttendance(currentAttendance);

        toast({
          title: 'Check-in Successful!',
          description: `Welcome, ${student.name}. You are marked as ${studentStatus}.`,
          action: <CheckCircle className="text-green-500" />,
        });
        setIsCheckedIn(true);
      } else {
        toast({
          variant: 'destructive',
          title: 'Check-in Failed',
          description: 'Your ID or name was not found on the class roster.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Location Error',
        description: error.message,
      });
    } finally {
      setIsCheckingIn(false);
      form.reset();
    }
  };

  if (isCheckedIn) {
    return (
      <div className="bg-card text-card-foreground rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-12 text-center flex flex-col items-center">
        <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold mb-3">Check-in Complete!</h1>
        <p className="text-muted-foreground mb-8">
          Your attendance has been recorded. You can now close this page.
        </p>
        <Button onClick={() => window.location.reload()}>Check-in Another Student</Button>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      
      {/* Left side: Check-in Form */}
      <div className="p-8 md:p-12 flex flex-col justify-center bg-slate-900/80 text-white">
        <div className="flex items-center gap-3 mb-6">
          <Book className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">Class Check-in</h1>
        </div>
        {isClient && sessionInfo ? (
          <p className="text-sm mb-6 text-gray-300">
            Enter your details for <span className="font-semibold">{sessionInfo.name}</span>
          </p>
        ) : (
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Enter your student ID"
                        className="pl-10 bg-white/10 border border-gray-500 rounded-lg text-white placeholder-gray-400"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Enter your full name"
                        className="pl-10 bg-white/10 border border-gray-500 rounded-lg text-white placeholder-gray-400"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center text-gray-300 text-xs pt-2">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Your location will be used to verify attendance</span>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isCheckingIn}>
              {isCheckingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking In...
                </>
              ) : (
                'Check In'
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Right side: Info & Image */}
      <div className="relative bg-cover bg-center hidden md:flex flex-col justify-center p-10 text-white"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Streamline Your Classroom</h2>
          <p className="text-sm text-gray-200 mb-6">
            Manage attendance with our intuitive platform designed for educators.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <CheckSquare className="h-5 w-5 text-green-400" /> Track student attendance
            </li>
            <li className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-yellow-400" /> Analyze student behavior
            </li>
            <li className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-400" /> Generate reports
            </li>
            <li className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-pink-400" /> Mobile access
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
