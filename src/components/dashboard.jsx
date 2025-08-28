
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ArrowLeft, Book, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClassSessionList from './class-session-list';
import CreateClassSessionDialog from './create-class-session-dialog';
import EditClassSessionDialog from './edit-class-session-dialog';
import StudentAttendanceDashboard from './student-attendance-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { courseStudents } from '@/lib/mock-data';


let sessionStore = [];

export default function Dashboard({ courseId }) {
  const [sessions, setSessions] = useState(sessionStore);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionToDeleteId, setSessionToDeleteId] = useState(null);
  const { toast } = useToast();
  
  const students = courseStudents[courseId] || [];

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

  const handleOpenEditDialog = (session) => {
    setSelectedSession(session);
    setEditDialogOpen(true);
  };

  const handleUpdateSession = (updatedSession) => {
    sessionStore = sessionStore.map(s =>
      s.id === updatedSession.id ? updatedSession : s
    );
    setSessions(sessionStore);
    setSelectedSession(null);
  };

  const handleOpenDeleteDialog = (sessionId) => {
    setSessionToDeleteId(sessionId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSession = () => {
    if (sessionToDeleteId) {
      sessionStore = sessionStore.filter(s => s.id !== sessionToDeleteId);
      setSessions(sessionStore);
      setSessionToDeleteId(null);
    }
    setDeleteDialogOpen(false);
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
          <ClassSessionList
            sessions={sessions}
            courseId={courseId}
            onEdit={handleOpenEditDialog}
            onDelete={handleOpenDeleteDialog}
          />
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
      {selectedSession && (
        <EditClassSessionDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSessionUpdate={handleUpdateSession}
          session={selectedSession}
        />
      )}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              class session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSession}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
