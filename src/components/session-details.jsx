

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import QRCode from "react-qr-code";
import AttendanceCard from './attendance-card';
import { ArrowLeft, Book, QrCode, Copy, CheckCircle } from 'lucide-react';
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
import { loadStudentsByCourse, loadAttendance, saveAttendance } from '@/lib/mock-data';
import { Label } from '@/components/ui/label';


export default function SessionDetails({ courseId, sessionId }) {
  const { toast } = useToast();
  
  const getInitialStudentState = useCallback(() => {
    // This function will now be defined within useEffect to avoid re-creation issues
    // and ensure it captures the correct state.
    if (typeof window === 'undefined') {
        const studentList = loadStudentsByCourse(courseId);
         return studentList.map(student => ({
            ...student,
            status: 'Absent',
        }));
    }
    const loadedAttendance = loadAttendance();
    const studentList = loadStudentsByCourse(courseId);
    const sessionStudents = studentList || [];
    const attendanceForSession = loadedAttendance[sessionId] || {};
    return sessionStudents.map(student => ({
      ...student,
      status: attendanceForSession[student.id] || 'Absent',
    }));
  }, [courseId, sessionId]);
  
  const [students, setStudents] = useState([]);
  const [isQrDialogOpen, setQrDialogOpen] = useState(false);
  const [checkinUrl, setCheckinUrl] = useState('');
  
  const previousStudentsRef = useRef(students);

  useEffect(() => {
    const studentList = loadStudentsByCourse(courseId);
    // Load initial data from localStorage on client-side only
    const loadedAttendance = loadAttendance();
    
    const getClientInitialStudentState = () => {
        const attendanceForSession = loadedAttendance[sessionId] || {};
        return studentList.map(student => ({
        ...student,
        status: attendanceForSession[student.id] || 'Absent',
        }));
    }

    const initialStudents = getClientInitialStudentState();
    setStudents(initialStudents);
    previousStudentsRef.current = initialStudents;
    
    // Set initial check-in URL
    const placeholderUrl = `https://your-public-url.com/checkin/${courseId}/${sessionId}`;
    setCheckinUrl(placeholderUrl);

    const interval = setInterval(() => {
      const currentAttendance = loadAttendance();
      const newStudents = getClientInitialStudentState();
      
      const previousStudents = previousStudentsRef.current;
      if (JSON.stringify(previousStudents) !== JSON.stringify(newStudents)) {
        newStudents.forEach((newStudent) => {
          const oldStudent = previousStudents.find(s => s.id === newStudent.id);
          if (oldStudent && oldStudent.status !== newStudent.status && newStudent.status === 'Present') {
            toast({
              title: 'Student Checked In',
              description: `${newStudent.name} has been marked as Present.`,
              action: <CheckCircle className="text-green-500" />,
            });
          }
        });
        setStudents(newStudents);
        previousStudentsRef.current = newStudents;
      }
    }, 2000); 

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, courseId]);

  const handleStudentStatusChange = (studentId, newStatus) => {
    const currentAttendance = loadAttendance();
    if (!currentAttendance[sessionId]) {
        currentAttendance[sessionId] = {};
    }
    currentAttendance[sessionId][studentId] = newStatus;
    saveAttendance(currentAttendance); // Save changes to localStorage
    const studentList = loadStudentsByCourse(courseId);
    
    const getClientInitialStudentState = () => {
        const attendanceForSession = currentAttendance[sessionId] || {};
        return studentList.map(student => ({
            ...student,
            status: attendanceForSession[student.id] || 'Absent',
        }));
    }
    const updatedStudents = getClientInitialStudentState();
    setStudents(updatedStudents);
    
    const student = students.find(s => s.id === studentId);
    if (student) {
        toast({
            title: `Status Updated for ${student.name}`,
            description: `${student.name} is now marked as ${newStatus}.`,
        });
    }
    // Update ref after state change is processed
    previousStudentsRef.current = updatedStudents;
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
            <Button onClick={() => setQrDialogOpen(true)}>
                <QrCode className="mr-2 h-4 w-4" />
                Generate QR Code
            </Button>
        </div>
      </header>
      <div className="grid grid-cols-1">
        <AttendanceCard students={students} onStudentStatusChange={handleStudentStatusChange} />
      </div>

       <Dialog open={isQrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Session QR Code</DialogTitle>
            <DialogDescription>
              Students can scan this code or use the link to check in. For mobile testing, replace the URL with your computer's local IP address.
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
                    onChange={(e) => setCheckinUrl(e.target.value)}
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
