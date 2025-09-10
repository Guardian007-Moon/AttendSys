
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
  CardFooter,
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
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Check-in Complete</CardTitle>
            <CardDescription>
              You can now close this window.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center p-6 pt-0">
            <p className="text-lg font-semibold text-foreground mb-2">You are all set!</p>
            <p className="text-muted-foreground">Your attendance has been recorded successfully.</p>
          </CardContent>
        </Card>
      )
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
             <div className="flex items-center gap-3 mb-2">
                <Book className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl font-bold">Class Check-in</CardTitle>
            </div>
          <CardDescription>
            {isClient && sessionInfo ? `Enter your details for ${sessionInfo.name}` : "Loading session details..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isClient && sessionInfo ? (
                <div className="bg-muted/50 p-3 rounded-lg mb-6 text-sm">
                    <div className="flex items-center gap-2 text-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(sessionInfo.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{sessionInfo.startTime}</span>
                    </div>
                </div>
            ) : (
                <div className="bg-muted/50 p-4 rounded-lg mb-6 h-[76px] flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
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
                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input placeholder="Enter your student ID" className="pl-10" {...field} />
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
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input placeholder="Enter your full name" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center text-muted-foreground text-xs pt-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>Your location will be used to verify classroom attendance</span>
                  </div>
                   <Button type="submit" className="w-full" disabled={isCheckingIn}>
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
        </CardContent>
    </Card>
  );
}
