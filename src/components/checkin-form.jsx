
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { loadStudentsByCourse, loadAttendance, saveAttendance } from '@/lib/mock-data';
import jsQR from 'jsqr';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Camera } from 'lucide-react';

const checkinSchema = z.object({
  name: z.string().min(3, 'Please enter your full name.'),
});


export default function CheckinForm({ courseId, sessionId }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isScannerOpen, setScannerOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(checkinSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (!isScannerOpen) {
      // Stop camera stream when scanner is closed
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      return;
    }

    let animationFrameId;

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    const scanQrCode = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
        });
        
        if (code) {
           if(code.data.includes('/checkin/')){
                router.push(code.data);
                setScannerOpen(false);
           }
        }
      }
      animationFrameId = requestAnimationFrame(scanQrCode);
    };

    getCameraPermission().then(() => {
        animationFrameId = requestAnimationFrame(scanQrCode);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isScannerOpen, router, toast]);

  const onSubmit = (values) => {
    const studentList = loadStudentsByCourse(courseId);
    const student = studentList.find(
      s => s.name.toLowerCase() === values.name.toLowerCase()
    );

    if (student) {
      const currentAttendance = loadAttendance();
      if (!currentAttendance[sessionId]) {
        currentAttendance[sessionId] = {};
      }
      // Set student status to Present for this session
      currentAttendance[sessionId][student.id] = 'Present';
      saveAttendance(currentAttendance); // Save the updated attendance to localStorage

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
    <>
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
                         <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                Or
                                </span>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => setScannerOpen(true)}
                        >
                            <Camera className="mr-2 h-4 w-4" />
                            Scan QR with Camera
                        </Button>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Check In
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
        <Dialog open={isScannerOpen} onOpenChange={setScannerOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Scan QR Code</DialogTitle>
                    <DialogDescription>Point your camera at the QR code.</DialogDescription>
                </DialogHeader>
                <div className="p-4">
                    <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />

                    { hasCameraPermission === false && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access to use this feature. You may need to change permissions in your browser settings.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    </>
  );
}