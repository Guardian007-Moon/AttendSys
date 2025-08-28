'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AttendanceCard from './attendance-card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Info, ArrowLeft, Book, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClassSessionList from './class-session-list';
import CreateClassSessionDialog from './create-class-session-dialog';

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

let sessionStore = [];

export default function Dashboard() {
  const [students, setStudents] = useState(initialStudents);
  const [sessions, setSessions] = useState(sessionStore);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const params = useParams();
  const courseId = params.courseId;

  const handleAddSession = (newSession) => {
    const newSessionWithId = { ...newSession, id: `SESS${Date.now()}` };
    sessionStore = [...sessionStore, newSessionWithId];
    setSessions(sessionStore);
    toast({
        title: "Class Session Created",
        description: `The session "${newSession.name}" has been successfully created.`,
        action: <CheckCircle className="text-green-500" />,
    });
  };

  return (
    <>
      <header className="mb-8">
        <Link href="/" passHref>
          <Button variant="outline" className="mb-4">
            <ArrowLeft />
            Back to Courses
          </Button>
        </Link>
        <div className="flex items-center justify-between">
            <div>
                <div className="flex items-center gap-3">
                    <Book className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold font-headline text-primary">
                        Course: {courseId}
                    </h1>
                </div>
                <p className="text-muted-foreground mt-1">
                    Manage class sessions and track attendance for this course.
                </p>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
                <PlusCircle />
                Create Session
            </Button>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <AttendanceCard students={students} />
        </div>
        <div className="flex flex-col gap-6 lg:gap-8">
            <ClassSessionList sessions={sessions} />
        </div>
      </div>
      <CreateClassSessionDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSessionCreate={handleAddSession}
      />
    </>
  );
}
