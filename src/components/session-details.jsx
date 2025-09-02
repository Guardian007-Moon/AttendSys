

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
import { loadStudentsByCourse, loadAttendance, saveAttendance } from '@/lib/mock-data';
import { Label } from '@/components/ui/label';


export default function SessionDetails({ courseId, sessionId }) {
  const { toast } = useToast();
  
  const [students, setStudents] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const [isQrDialogOpen, setQrDialogOpen] = useState(false);
  const [checkinUrl, setCheckinUrl] = useState('');
  
  const previousStudentsRef = useRef(students);

  useEffect(() => {
    setIsClient(true);
    const studentList = loadStudentsByCourse(courseId);
    
    const getClientInitialStudentState = () => {
        const loadedAttendance = loadAttendance();
        const attendanceForSession = loadedAttendance[sessionId] || {};
        return studentList.map(student => ({
        ...student,
        status: attendanceForSession[student.id] || 'Absent',
        }));
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

  const handleStudentStatusChange = (studentId, newStatus) => {
    // This function is kept for potential future use but is not active
    // since the switch is removed.
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
        <AttendanceCard students={isClient ? students : []} onStudentStatusChange={handleStudentStatusChange} />
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
