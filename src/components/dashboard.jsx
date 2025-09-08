
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ArrowLeft, Book, PlusCircle, Calendar, Users, BarChart3, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClassSessionList from './class-session-list';
import CreateClassSessionDialog from './create-class-session-dialog';
import EditClassSessionDialog from './edit-class-session-dialog';
import StudentAttendanceDashboard from './student-attendance-dashboard';
import AnalyticsDashboard from './analytics-dashboard';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { initialCourseStudents, loadAttendance, saveAttendance, initialSessions } from '@/lib/mock-data';

const getInitialSessions = (courseId) => {
  if (typeof window === 'undefined') return [];
  const storedSessions = localStorage.getItem(`sessions_${courseId}`);
  if (storedSessions) {
    return JSON.parse(storedSessions);
  }
  // If no sessions in local storage, check our initial mock data
  if (initialSessions[courseId]) {
    localStorage.setItem(`sessions_${courseId}`, JSON.stringify(initialSessions[courseId]));
    return initialSessions[courseId];
  }
  return [];
};

const getInitialStudents = (courseId) => {
  if (typeof window === 'undefined') return initialCourseStudents[courseId] || [];
  const storedStudents = localStorage.getItem(`students_${courseId}`);
  return storedStudents ? JSON.parse(storedStudents) : (initialCourseStudents[courseId] || []);
}

let sessionStore = [];
let studentStore = [];

export default function Dashboard({ courseId }) {
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionToDeleteId, setSessionToDeleteId] = useState(null);
  const { toast } = useToast();
  
  useEffect(() => {
    sessionStore = getInitialSessions(courseId);
    setSessions(sessionStore);
    studentStore = getInitialStudents(courseId);
    setStudents(studentStore);
  }, [courseId]);

  const updateSessionsLocalStorage = (newSessions) => {
    localStorage.setItem(`sessions_${courseId}`, JSON.stringify(newSessions));
  };
  
  const updateStudentsLocalStorage = (newStudents) => {
    localStorage.setItem(`students_${courseId}`, JSON.stringify(newStudents));
  }

  const handleAddSession = (newSession) => {
    const newSessionWithId = { ...newSession, id: `SESS${Date.now()}` };
    sessionStore = [...sessionStore, newSessionWithId];
    setSessions(sessionStore);
    updateSessionsLocalStorage(sessionStore);
    toast({
        title: "Class Session Created",
        description: `The session "${newSession.name}" has been successfully created.`,
        action: <CheckCircle className="text-green-500" />,
        className: "border-l-4 border-l-green-500"
    });
  };

  const handleOpenEditDialog = (session) => {
    setSelectedSession(session);
    setEditDialogOpen(true);
  };

  const reevaluateAttendanceForSession = (updatedSession) => {
    const allAttendance = loadAttendance();
    const sessionAttendance = allAttendance[updatedSession.id];

    if (!sessionAttendance) return; // No attendance for this session yet

    const sessionDate = new Date(updatedSession.date);
    const [hours, minutes] = updatedSession.startTime.split(':');
    const deadline = new Date(sessionDate.getTime());
    deadline.setHours(hours, minutes, 0, 0);
    deadline.setMinutes(deadline.getMinutes() + updatedSession.checkinTimeLimit);

    for (const studentId in sessionAttendance) {
        const record = sessionAttendance[studentId];
        // We only re-evaluate for students who have already checked in
        if (record.time) {
            const checkinTimeParts = record.time.match(/(\d+):(\d+):(\d+) (AM|PM)/);
            if (checkinTimeParts) {
                let [_, chour, cmin, csec, campm] = checkinTimeParts;
                let checkinHour = parseInt(chour, 10);

                if (campm === 'PM' && checkinHour < 12) {
                    checkinHour += 12;
                } else if (campm === 'AM' && checkinHour === 12) {
                    checkinHour = 0;
                }

                const checkinDateTime = new Date(sessionDate.getTime());
                checkinDateTime.setHours(checkinHour, parseInt(cmin, 10), parseInt(csec, 10), 0);

                const newStatus = checkinDateTime > deadline ? 'Late' : 'Present';
                
                if(record.status !== newStatus) {
                    allAttendance[updatedSession.id][studentId].status = newStatus;
                }
            }
        }
    }
    saveAttendance(allAttendance);
};

  const handleUpdateSession = (updatedSession) => {
    sessionStore = sessionStore.map(s =>
      s.id === updatedSession.id ? updatedSession : s
    );
    setSessions(sessionStore);
    updateSessionsLocalStorage(sessionStore);
    
    // Re-evaluate attendance statuses based on new deadline
    reevaluateAttendanceForSession(updatedSession);

    setSelectedSession(null);
     toast({
        title: "Class Session Updated",
        description: `The session "${updatedSession.name}" has been successfully updated.`,
        action: <CheckCircle className="text-green-500" />,
        className: "border-l-4 border-l-green-500"
    });
  };

  const handleOpenDeleteDialog = (sessionId) => {
    setSessionToDeleteId(sessionId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSession = () => {
    if (sessionToDeleteId) {
      sessionStore = sessionStore.filter(s => s.id !== sessionToDeleteId);
      setSessions(sessionStore);
      updateSessionsLocalStorage(sessionStore);
      setSessionToDeleteId(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleStudentUpdate = (updatedStudents) => {
    studentStore = updatedStudents;
    setStudents(studentStore);
    updateStudentsLocalStorage(studentStore);
  };

  // Calculate statistics
  const totalSessions = sessions.length;
  const upcomingSessions = sessions.filter(session => new Date(session.date) >= new Date()).length;
  const totalStudents = students.length;
  const averageAttendance = sessions.length > 0 ? Math.round((sessions.reduce((acc, session) => {
    const attendance = loadAttendance()[session.id] || {};
    return acc + (Object.keys(attendance).filter(id => attendance[id].status !== 'Absent').length / students.length) * 100;
  }, 0) / sessions.length)) : 0;

  return (
    <>
      <header className="mb-8">
        <Link href="/courses" passHref>
          <Button variant="outline" className="mb-4 rounded-lg gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary/10 p-2 rounded-xl">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {courseId} Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground ml-11">
              Manage class sessions and track attendance for this course
            </p>
          </div>
          
          <Button 
            onClick={() => setCreateDialogOpen(true)} 
            className="bg-primary hover:bg-primary/90 shadow-md rounded-lg gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Session
          </Button>
        </div>
      </header>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{totalSessions}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-green-600">{upcomingSessions}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-purple-600">{totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Attendance</p>
                <p className="text-2xl font-bold text-amber-600">{averageAttendance}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-amber-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Progress */}
      {sessions.length > 0 && (
        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Overall Attendance Rate
            </CardTitle>
            <CardDescription>
              Average attendance across all sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={averageAttendance} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>0%</span>
              <span>{averageAttendance}%</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs Navigation */}
      <Tabs defaultValue="sessions" className="mb-6">
        <TabsList className="bg-muted/50 p-1 rounded-lg">
          <TabsTrigger value="sessions" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Calendar className="h-4 w-4 mr-2" />
            Class Sessions
          </TabsTrigger>
          <TabsTrigger value="attendance" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Users className="h-4 w-4 mr-2" />
            Student Roster
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions" className="mt-6">
          <ClassSessionList
            sessions={sessions}
            courseId={courseId}
            onEdit={handleOpenEditDialog}
            onDelete={handleOpenDeleteDialog}
          />
        </TabsContent>
        
        <TabsContent value="attendance" className="mt-6">
          <StudentAttendanceDashboard 
            students={students} 
            sessions={sessions}
            onStudentUpdate={handleStudentUpdate}
            courseId={courseId}
          />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsDashboard 
            students={students} 
            sessions={sessions}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
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
        <AlertDialogContent className="bg-white rounded-2xl border-0 p-0 overflow-hidden max-w-md shadow-xl">
          <div className="p-6 text-center">
            <div className="mx-auto bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-5">
              <div className="bg-red-500 p-2 rounded-full">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <AlertDialogHeader className="text-center">
              <AlertDialogTitle className="text-xl font-bold text-gray-900 mb-2">
                Delete Session
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 text-base">
                Are you sure you want to delete this session? This action cannot be undone and will remove all attendance records for this session.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
            <AlertDialogAction 
              onClick={handleDeleteSession}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              Delete Session
            </AlertDialogAction>
            <AlertDialogCancel className="flex-1 bg-white hover:bg-green-500 hover:text-white text-gray-700 py-3 px-4 rounded-lg font-medium border border-gray-300 transition-colors duration-200">
              Cancel
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
