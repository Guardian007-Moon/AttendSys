'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ArrowLeft, Book, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClassSessionList from './class-session-list';
import CreateClassSessionDialog from './create-class-session-dialog';

let sessionStore = [];

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
      <div className="grid grid-cols-1">
        <ClassSessionList sessions={sessions} courseId={courseId} />
      </div>
      <CreateClassSessionDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSessionCreate={handleAddSession}
      />
    </>
  );
}
