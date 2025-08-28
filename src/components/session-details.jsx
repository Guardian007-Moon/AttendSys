
'use client';

import { useState, useEffect, useRef } from 'react';
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
import { courseStudents, sessionAttendance, loadAttendance, saveAttendance } from '@/lib/mock-data';


export default function SessionDetails({ courseId, sessionId }) {
  const { toast } = useToast();
  
  const getInitialStudentState = () => {
    loadAttendance(); // Load the latest attendance data
    const sessionStudents = courseStudents[courseId] || [];
    const attendanceForSession = sessionAttendance[sessionId] || {};
    return sessionStudents.map(student => ({
      ...student,
      status: attendanceForSession[student.id] || 'Absent',
    }));
  };
  
  const [students, setStudents] = useState(getInitialStudentState);
  const [isQrDialogOpen, setQrDialogOpen] = useState(false);
  
  // Use a ref to hold the previous students array for comparison
  const previousStudentsRef = useRef(students);

  // Poll for attendance updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newStudents = getInitialStudentState();
      
      // Compare with the previous state to detect changes
      const previousStudents = previousStudentsRef.current;
      if (JSON.stringify(previousStudents) !== JSON.stringify(newStudents)) {
        newStudents.forEach((newStudent, index) => {
          const oldStudent = previousStudents[index];
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
    }, 2000); // Check for updates every 2 seconds

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, courseId]);

  const handleStudentStatusChange = (studentId, newStatus) => {
    if (!sessionAttendance[sessionId]) {
        sessionAttendance[sessionId] = {};
    }
    sessionAttendance[sessionId][studentId] = newStatus;
    saveAttendance(); // Save changes to localStorage
    const updatedStudents = getInitialStudentState();
    setStudents(updatedStudents);
    previousStudentsRef.current = updatedStudents; // Update ref immediately

    const student = students.find(s => s.id === studentId);
    if (student) {
        toast({
            title: `Status Updated for ${student.name}`,
            description: `${student.name} is now marked as ${newStatus}.`,
        });
    }
  };

  const getCheckinUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/checkin/${courseId}/${sessionId}`;
  }
  
  const checkinUrl = getCheckinUrl();
  
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
              Students can scan this code or use the link below to check in.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 bg-white rounded-lg flex items-center justify-center">
            <QRCode value={checkinUrl} size={256} />
          </div>
          <div className="pt-4">
            <p className="text-sm text-center text-muted-foreground mb-2">Or share this link:</p>
            <div className="flex items-center space-x-2">
                <Input value={checkinUrl} readOnly className="flex-1" />
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
