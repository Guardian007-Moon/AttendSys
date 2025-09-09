
'use client';

import { useState, useEffect, useRef } from 'react';
import PageTransitionLink from './PageTransitionLink';
import QRCode from "react-qr-code";
import AttendanceCard from './attendance-card';
import { ArrowLeft, Book, QrCode, Copy, CheckCircle, MapPin, Loader2, Calendar, Clock, Users, Wifi, WifiOff } from 'lucide-react';
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
import { loadStudentsByCourse, loadAttendance, loadSession, saveSession, initialCourses } from '@/lib/mock-data';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function SessionDetails({ courseId, sessionId }) {
  const { toast } = useToast();
  
  const [students, setStudents] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isQrDialogOpen, setQrDialogOpen] = useState(false);
  const [checkinUrl, setCheckinUrl] = useState('');
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [session, setSession] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  
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
      
      // Check online status
      setIsOnline(navigator.onLine);
      window.addEventListener('online', () => setIsOnline(true));
      window.addEventListener('offline', () => setIsOnline(false));
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
              className: "border-l-4 border-l-green-500"
            });
          }
        });
        setStudents(newStudents);
        previousStudentsRef.current = newStudents;
      }
    }, 2000); 

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, [sessionId, courseId, toast]);

  const handleShareLocation = () => {
    setIsSharingLocation(true);
    if (!navigator.geolocation) {
        toast({
            variant: "destructive",
            title: "Location Error",
            description: "Geolocation is not supported by your browser.",
            className: "border-l-4 border-l-red-500"
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
                className: "border-l-4 border-l-green-500"
            });
            setIsSharingLocation(false);
        },
        (error) => {
            toast({
                variant: "destructive",
                title: "Location Error",
                description: `Could not get location: ${error.message}`,
                className: "border-l-4 border-l-red-500"
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
        className: "border-l-4 border-l-blue-500"
    });
  }

  // Calculate attendance stats
  const presentCount = students.filter(s => s.status === 'Present').length;
  const lateCount = students.filter(s => s.status === 'Late').length;
  const absentCount = students.filter(s => s.status === 'Absent').length;
  const attendancePercentage = students.length > 0 
    ? Math.round(((presentCount + lateCount) / students.length) * 100) 
    : 0;

  return (
    <>
      <header className="mb-8">
        <PageTransitionLink href={`/courses/${courseId}`} passHref>
          <Button variant="outline" className="mb-4 rounded-lg gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Course
          </Button>
        </PageTransitionLink>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
           <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-primary/10 p-2 rounded-xl">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Session: {session ? session.name : 'Loading...'}
              </h1>
            </div>
            <p className="text-muted-foreground ml-11">
              Code: {session ? session.id : `Session ID: ${sessionId}`}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setQrDialogOpen(true)} 
              className="bg-primary hover:bg-primary/90 shadow-md rounded-lg gap-2"
            >
              <QrCode className="h-4 w-4" />
              Show Check-in QR
            </Button>
          </div>
        </div>
      </header>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600">{presentCount}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Late</p>
                <p className="text-2xl font-bold text-amber-600">{lateCount}</p>
              </div>
              <Badge variant="outline" className="text-amber-600 border-amber-300">{lateCount}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              </div>
              <Badge variant="outline" className="text-red-600 border-red-300">{absentCount}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Progress */}
      <Card className="mb-6 border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Attendance Progress
          </CardTitle>
          <CardDescription>
            {attendancePercentage}% of students have checked in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={attendancePercentage} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>0%</span>
            <span>{attendancePercentage}%</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Card */}
      <div className="grid grid-cols-1">
        <AttendanceCard students={isClient ? students : []} onStudentStatusChange={() => {}} />
      </div>

      {/* QR Code Dialog */}
      <Dialog open={isQrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-0 shadow-xl">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
            <DialogHeader className="text-left">
              <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Session Check-in
              </DialogTitle>
              <DialogDescription className="text-white/90">
                Share your location and provide students with the QR code to check in
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-5">
            <Button 
              onClick={handleShareLocation} 
              disabled={isSharingLocation || !!session?.teacherLocation} 
              className="w-full rounded-lg gap-2 py-3"
            >
              {isSharingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : session?.teacherLocation ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              {session?.teacherLocation ? "Location Set" : (isSharingLocation ? "Sharing Location..." : "Share Your Location")}
            </Button>

            {!session?.teacherLocation && (
              <Alert variant="destructive" className="rounded-lg border-l-4 border-l-red-500">
                <AlertTitle>Action Required</AlertTitle>
                <AlertDescription>
                  You must share your location before students can check in.
                </AlertDescription>
              </Alert>
            )}
           
            <div className="p-4 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
              <QRCode value={checkinUrl} size={200} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="checkin-url" className="text-sm font-medium">Check-in URL</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="checkin-url"
                  value={checkinUrl} 
                  readOnly
                  className="rounded-lg flex-1" 
                />
                <Button onClick={handleCopy} size="icon" variant="outline" className="rounded-lg">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isOnline ? (
                <Wifi className="h-3 w-3 text-green-500" />
              ) : (
                <WifiOff className="h-3 w-3 text-red-500" />
              )}
              <span>{isOnline ? "Online" : "Offline"} - QR scanning requires an internet connection</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
