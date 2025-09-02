
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import QRCode from "react-qr-code";
import AttendanceCard from './attendance-card';
import { ArrowLeft, Book, QrCode, Copy, CheckCircle, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { loadStudentsByCourse, loadAttendance, loadSession, saveSession } from '@/lib/mock-data';
import { Label } from '@/components/ui/label';


export default function SessionDetails({ courseId, sessionId }) {
  const { toast } = useToast();
  
  const [students, setStudents] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const [isQrDialogOpen, setQrDialogOpen] = useState(false);
  const [checkinUrl, setCheckinUrl] = useState('');
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [session, setSession] = useState(null);
  
  const previousStudentsRef = useRef(students);

  useEffect(() => {
    setIsClient(true);
    const currentSession = loadSession(courseId, sessionId);
    setSession(currentSession);

    const studentList = loadStudentsByCourse(courseId);
    
    const getClientInitialStudentState = () => {
        const loadedAttendance = loadAttendance();
        const attendanceForSession = loadedAttendance[sessionId] || {};
        return studentList.map(student => {
            const attendanceRecord = attendanceForSession[student.id];
            return {
                ...student,
                status: attendanceRecord ? attendanceRecord.status : 'Absent',
                checkinTime: attendanceRecord ? attendanceRecord.time : null,
                distance: attendanceRecord ? attendanceRecord.distance : null,
            };
        });
    }

    const initialStudents = getClientInitialStudentState();
    setStudents(initialStudents);
    previousStudentsRef.current = initialStudents;
    
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/checkin/${courseId}/${sessionId}`;
      setCheckinUrl(url);
    }

    const interval = setInterval(() => {
      const newStudents = getClientInitialStudentState();
      
      const previousStudents = previousStudentsRef.current;
      if (JSON.stringify(previousStudents) !== JSON.stringify(newStudents)) {
        newStudents.forEach((newStudent) => {
          const oldStudent = previousStudents.find(s => s.id === newStudent.id);
          if (oldStudent && oldStudent.status !== newStudent.status && (newStudent.status === 'Present' || newStudent.status === 'Late')) {
            toast({
              title: 'Student Checked In',
              description: `${newStudent.name} has been marked as ${newStudent.status}.`,
              action: <CheckCircle className="text-green-500" />,
            });
          }
        });
        setStudents(newStudents);
        previousStudentsRef.current = newStudents;
      }
    }, 2000); 

    return () => clearInterval(interval);
  }, [sessionId, courseId, toast]);

  const handleShareLocation = () => {
    setIsSharingLocation(true);
    if (!navigator.geolocation) {
        toast({
            variant: "destructive",
            title: "Location Error",
            description: "Geolocation is not supported by your browser.",
        });
        setIsSharingLocation(false);
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const updatedSession = { ...session, teacherLocation: { latitude, longitude } };
            saveSession(courseId, updatedSession);
            setSession(updatedSession);
            toast({
                title: "Location Shared",
                description: "Your location has been set for this session.",
                action: <CheckCircle className="text-green-500" />,
            });
            setIsSharingLocation(false);
        },
        (error) => {
            toast({
                variant: "destructive",
                title: "Location Error",
                description: `Could not get location: ${error.message}`,
            });
            setIsSharingLocation(false);
        }
    );
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(checkinUrl);
    toast({
        title: "Link Copied!",
        description: "The check-in link has been copied to your clipboard.",
    });
  }

  return (
    <>
      <header className="mb-8">
        <Link href={`/courses/${courseId}`} passHref>
          <Button variant="outline" className="mb-4">
            <ArrowLeft />
            Back to Sessions
          </Button>
        </Link>
        <div className="flex items-center justify-between">
            <div>
                <div className="flex items-center gap-3">
                    <Book className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold font-headline text-primary">
                        Session: {sessionId}
                    </h1>
                </div>
                <p className="text-muted-foreground mt-1">
                    Track attendance for this session.
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={handleShareLocation} disabled={isSharingLocation || !!session?.teacherLocation}>
                    {isSharingLocation ? <Loader2 className="animate-spin" /> : <MapPin />}
                    {session?.teacherLocation ? "Location Set" : (isSharingLocation ? "Sharing..." : "Share Location")}
                </Button>
                <Button onClick={() => setQrDialogOpen(true)}>
                    <QrCode />
                    Generate QR Code
                </Button>
            </div>
        </div>
      </header>
      <div className="grid grid-cols-1">
        <AttendanceCard students={isClient ? students : []} onStudentStatusChange={() => {}} />
      </div>

       <Dialog open={isQrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Session QR Code</DialogTitle>
            <DialogDescription>
              Students can scan this code or use the link to check in. Note that scanning with a mobile device may not work in this local development environment due to network restrictions.
            </DialogDescription>
          </DialogHeader>
          {checkinUrl && (
            <div className="p-6 bg-white rounded-lg flex items-center justify-center">
                <QRCode value={checkinUrl} size={256} />
            </div>
          )}
          <div className="pt-4 space-y-2">
            <Label htmlFor="checkin-url">Check-in URL</Label>
            <div className="flex items-center space-x-2">
                <Input 
                    id="checkin-url"
                    value={checkinUrl} 
                    readOnly
                    className="flex-1" 
                />
                <Button onClick={handleCopy} size="icon" variant="outline">
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy Link</span>
                </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
