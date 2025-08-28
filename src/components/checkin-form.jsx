
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { courseStudents, sessionAttendance, saveAttendance } from '@/lib/mock-data';
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
import { CheckCircle, XCircle } from 'lucide-react';

const checkinSchema = z.object({
  name: z.string().min(3, 'Please enter your full name.'),
});


export default function CheckinForm({ courseId, sessionId }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const form = useForm({
    resolver: zodResolver(checkinSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = (values) => {
    const studentList = courseStudents[courseId] || [];
    const student = studentList.find(
      s => s.name.toLowerCase() === values.name.toLowerCase()
    );

    if (student) {
      if (!sessionAttendance[sessionId]) {
        sessionAttendance[sessionId] = {};
      }
      // Set student status to Present for this session
      sessionAttendance[sessionId][student.id] = 'Present';
      saveAttendance(); // Save the updated attendance to localStorage

      toast({
        title: 'Check-in Successful!',
        description: `Welcome, ${student.name}. You've been marked as present.`,
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
    form.reset();
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
            Enter your full name to mark your attendance for session {sessionId}.
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
                    <Button type="submit" className="w-full">
                        Check In
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
