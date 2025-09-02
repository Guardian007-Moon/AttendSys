'use client';

import { useState } from 'react';
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
  CardFooter
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
import { CheckCircle, Loader2 } from 'lucide-react';
import { getDistance } from 'geolib';


const checkinSchema = z.object({
  name: z.string().min(3, 'Please enter your full name.'),
});

const MAX_DISTANCE_METERS = 100;

export default function CheckinForm({ courseId, sessionId }) {
  const { toast } = useToast();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const form = useForm({
    resolver: zodResolver(checkinSchema),
    defaultValues: { name: '' },
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

        if (distance > MAX_DISTANCE_METERS) {
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
        s => s.name.toLowerCase() === values.name.toLowerCase()
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
        };
        saveAttendance(currentAttendance); // Save the updated attendance to localStorage

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
            description: 'Your name was not found on the class roster. Please check the name and try again.',
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
         <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Check-in Complete</CardTitle>
                <CardDescription>You can now close this window.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center p-10">
                <CheckCircle className="w-24 h-24 text-green-500 mb-4" />
                <p className="text-lg font-semibold">You are all set!</p>
            </CardContent>
         </Card>
      )
  }


  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Class Check-in</CardTitle>
            <CardDescription>
            Enter your full name to mark your attendance. Your location will be used to verify you are in the classroom.
            </CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 'Amelia Harris'" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isCheckingIn}>
                        {isCheckingIn && <Loader2 className="animate-spin" />}
                        {isCheckingIn ? "Verifying..." : "Check In"}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
