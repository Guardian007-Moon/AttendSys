
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { loadStudentsByCourse, loadAttendance, saveAttendance, loadSession } from '@/lib/mock-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { CheckCircle, Loader2, MapPin, User, Hash, Calendar, Clock, Book } from 'lucide-react';
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
  }

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
                description: `You are too far from the classroom to check in. You are ${distance} meters away.`,
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
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
              distance: distance,
          };
          saveAttendance(currentAttendance);

          toast({
              title: 'Check-in Successful!',
              description: `Welcome, ${student.name}. You've been marked as ${studentStatus}.`,
              action: <CheckCircle className="text-green-500" />,
          });
          setIsCheckedIn(true);
        } else {
          toast({
              variant: 'destructive',
              title: 'Check-in Failed',
              description: 'Your ID or name was not found on the class roster. Please check your details and try again.',
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
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center p-6">
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto bg-white/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Check-in Complete</CardTitle>
              <CardDescription className="text-white/90">
                You can now close this window.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center p-6">
              <p className="text-lg font-semibold text-white mb-2">You are all set!</p>
              <p className="text-white/80">Your attendance has been recorded successfully.</p>
            </CardContent>
          </Card>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Side - Check-in Form */}
        <div className="w-full md:w-1/2 bg-white/10 backdrop-blur-md p-8 flex flex-col justify-center">
          <div className="mb-8 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Book className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">AttendSys</h1>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-2">Class Check-in</h2>
          <p className="text-white/80 mb-6">Enter your details to mark your attendance</p>

          {isClient && sessionInfo ? (
            <div className="bg-white/10 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2 text-white/90 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{new Date(sessionInfo.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{sessionInfo.startTime}</span>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 p-4 rounded-lg mb-6 h-[72px] flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-white animate-spin" />
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Student ID</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input 
                          placeholder="Enter your student ID" 
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-200" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input 
                          placeholder="Enter your full name" 
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-200" />
                  </FormItem>
                )}
              />

              <div className="flex items-center text-white/80 text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Your location will be used to verify classroom attendance</span>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-white text-blue-600 hover:bg-blue-50 font-medium py-2.5 mt-4"
                disabled={isCheckingIn}
              >
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

        {/* Right Side - Information Panel */}
        <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Streamline Your Classroom</h3>
          <p className="text-gray-600 mb-6">
            Manage attendance with our intuitive platform designed specifically for educators.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full mt-0.5">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Track student attendance</h4>
                <p className="text-sm text-gray-500">Monitor attendance in real-time with geolocation verification</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full mt-0.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Analyze student's behavior</h4>
                <p className="text-sm text-gray-500">Gain insights into attendance patterns and trends</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-full mt-0.5">
                <CheckCircle className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Generate reports</h4>
                <p className="text-sm text-gray-500">Export detailed attendance reports for administration</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full mt-0.5">
                <CheckCircle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Mobile access</h4>
                <p className="text-sm text-gray-500">Check in from any device with internet access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
