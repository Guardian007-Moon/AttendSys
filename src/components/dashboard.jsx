'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ArrowLeft, Book, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClassSessionList from './class-session-list';
import CreateClassSessionDialog from './create-class-session-dialog';
import StudentAttendanceDashboard from './student-attendance-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


let sessionStore = [];

const students = [
  { id: 'S001', name: 'Amelia Harris' },
  { id: 'S002', name: 'Benjamin Carter' },
  { id: 'S003', name: 'Charlotte Davis' },
  { id: 'S004', name: 'Daniel Evans' },
  { id: 'S005', name: 'Emily Garcia' },
  { id: 'S006', name: 'Finn Miller' },
  { id: 'S007', name: 'Grace Rodriguez' },
  { id: 'S008', name: 'Henry Wilson' },
  { id: 'S009', name: 'Isabella Moore' },
  { id: 'S010', name: 'Jack Taylor' },
];

export default function Dashboard({ courseId }) {
  const [sessions, setSessions] = useState(sessionStore);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

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
       <Tabs defaultValue="sessions">
        <TabsList className="mb-4">
          <TabsTrigger value="sessions">Class Sessions</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Dashboard</TabsTrigger>
        </TabsList>
        <TabsContent value="sessions">
          <ClassSessionList sessions={sessions} courseId={courseId} />
        </TabsContent>
        <TabsContent value="attendance">
          <StudentAttendanceDashboard students={students} sessions={sessions} />
        </TabsContent>
      </Tabs>
      <CreateClassSessionDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSessionCreate={handleAddSession}
      />
    </>
  );
}
