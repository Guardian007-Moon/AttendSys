
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
import { CheckCircle, Loader2, MapPin, User, Hash } from 'lucide-react';
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
  const [confirmationMessage, setConfirmationMessage] = useState('Check-in Complete!');

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

        // Check if student is already checked in
        if (currentAttendance[sessionId][student.id]) {
            toast({
                title: 'Already Checked In',
                description: `You have already been marked as ${currentAttendance[sessionId][student.id].status}.`,
                action: <CheckCircle className="text-blue-500" />,
            });
            setConfirmationMessage('You have already checked-in!');
            setIsCheckedIn(true);
            setIsCheckingIn(false);
            form.reset();
            return; // Stop execution
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
        setConfirmationMessage('Check-in Complete!');
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
        <h1 className="text-3xl font-bold mb-3">{confirmationMessage}</h1>
        <p className="text-muted-foreground mb-8">
          Your attendance has been recorded. You can now close this page.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Class Check-in</h1>
         {isClient && sessionInfo ? (
          <p className="text-muted-foreground">
            Enter your details for <span className="font-semibold">{sessionInfo.name}</span>
          </p>
        ) : (
            <div className="space-y-2 mt-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <Hash className="h-4 w-4 mr-2" />
                  Student ID
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your student ID"
                    {...field}
                  />
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
                <FormLabel className="flex items-center">
                   <User className="h-4 w-4 mr-2" />
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center text-muted-foreground text-xs pt-2">
            <MapPin className="h-4 w-4 mr-2" />
            <span>Your location will be used to verify your attendance</span>
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
    </div>
  );
}
