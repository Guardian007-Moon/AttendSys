'use client';

import { useState } from 'react';
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


const initialStudents = [
  { id: 'S001', name: 'Amelia Harris', status: 'Absent' },
  { id: 'S002', name: 'Benjamin Carter', status: 'Absent' },
  { id: 'S003', name: 'Charlotte Davis', status: 'Absent' },
  { id: 'S004', name: 'Daniel Evans', status: 'Absent' },
  { id: 'S005', name: 'Emily Garcia', status: 'Absent' },
  { id: 'S006', name: 'Finn Miller', status: 'Absent' },
  { id: 'S007', name: 'Grace Rodriguez', status: 'Absent' },
  { id: 'S008', name: 'Henry Wilson', status: 'Absent' },
  { id: 'S009', name: 'Isabella Moore', status: 'Absent' },
  { id: 'S010', name: 'Jack Taylor', status: 'Absent' },
];

export default function SessionDetails({ courseId, sessionId }) {
  const [students, setStudents] = useState(initialStudents);
  const [isQrDialogOpen, setQrDialogOpen] = useState(false);

  const handleStudentStatusChange = (studentId, newStatus) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
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
