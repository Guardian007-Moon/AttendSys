
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from "react-qr-code";
import AttendanceCard from './attendance-card';
import { ArrowLeft, Book, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { courseStudents, sessionAttendance } from '@/lib/mock-data';


export default function SessionDetails({ courseId, sessionId }) {
  const initialStudents = courseStudents[courseId] || [];
  
  // Initialize student state for this session
  const getInitialStudentState = () => {
    const sessionStudents = courseStudents[courseId] || [];
    const attendanceForSession = sessionAttendance[sessionId] || {};
    return sessionStudents.map(student => ({
      ...student,
      status: attendanceForSession[student.id] || 'Absent',
    }));
  };
  
  const [students, setStudents] = useState(getInitialStudentState);
  const [isQrDialogOpen, setQrDialogOpen] = useState(false);
  
  // Poll for attendance updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStudents(getInitialStudentState());
    }, 2000); // Check for updates every 2 seconds

    return () => clearInterval(interval);
  }, [sessionId, courseId]);

  const handleStudentStatusChange = (studentId, newStatus) => {
    if (!sessionAttendance[sessionId]) {
        sessionAttendance[sessionId] = {};
    }
    sessionAttendance[sessionId][studentId] = newStatus;
    setStudents(getInitialStudentState());
  };

  const getCheckinUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/checkin/${courseId}/${sessionId}`;
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
              Students can scan this code to check in for the session.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 bg-white rounded-lg flex items-center justify-center">
            <QRCode value={getCheckinUrl()} size={256} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
