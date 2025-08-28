'use client';

import { useState } from 'react';
import AttendanceCard from './attendance-card';
import SessionCard from './session-card';
import RemediationCard from './remediation-card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Info } from 'lucide-react';

type Student = {
  id: string;
  name: string;
  status: 'Present' | 'Absent';
};

const initialStudents: Student[] = [
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

export default function Dashboard() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const { toast } = useToast();

  const handleStartSession = () => {
    setIsSessionActive(true);
    // Simulate some students scanning the QR code
    setTimeout(() => {
      setStudents(prevStudents =>
        prevStudents.map(s =>
          Math.random() > 0.4 ? { ...s, status: 'Present' } : s
        )
      );
    }, 1500);
    toast({
      title: 'Session Started',
      description: 'Attendance tracking is now active.',
      action: <CheckCircle className="text-green-500" />,
    });
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    toast({
      title: 'Session Ended',
      description: 'Attendance has been finalized.',
      action: <Info className="text-primary" />,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-2">
        <AttendanceCard students={students} />
      </div>
      <div className="flex flex-col gap-6 lg:gap-8">
        <SessionCard
          isSessionActive={isSessionActive}
          onStart={handleStartSession}
          onEnd={handleEndSession}
        />
        <RemediationCard />
      </div>
    </div>
  );
}
