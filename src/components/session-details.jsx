'use client';

import { useState } from 'react';
import Link from 'next/link';
import AttendanceCard from './attendance-card';
import { ArrowLeft, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        </div>
      </header>
      <div className="grid grid-cols-1">
        <AttendanceCard students={students} />
      </div>
    </>
  );
}
