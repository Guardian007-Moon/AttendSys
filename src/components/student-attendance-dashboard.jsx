
'use client';
import { useState } from 'react';
import { Download, PlusCircle, MoreVertical, Pencil, Trash2, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { loadAttendance } from '@/lib/mock-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock function to simulate generating and downloading a CSV report.
const downloadReport = (data) => {
  const headers = ['Student Name', 'Present', 'Late', 'Present (always)', 'Absent', 'Total Sessions'];
  const csvRows = [
    headers.join(','),
    ...data.map(row => [row.name, row.present, row.late, row.presentAlways, row.absent, row.total].join(',')),
  ];
  
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'attendance_report.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


export default function StudentAttendanceDashboard({ students, sessions, onStudentUpdate, courseId }) {
  const [isStudentDialogOpen, setStudentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDeleteId, setStudentToDeleteId] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentName, setStudentName] = useState('');

  const sessionAttendance = loadAttendance();
  const attendanceData = students.map(student => {
    let present = 0;
    let late = 0;
    sessions.forEach(session => {
        const attendanceRecord = sessionAttendance[session.id] && sessionAttendance[session.id][student.id];
        if (attendanceRecord) {
            if (attendanceRecord.status === 'Present') {
                present++;
            } else if (attendanceRecord.status === 'Late') {
                late++;
            }
        }
    });
    const attended = present + late;
    const absent = sessions.length - attended;
    return {
      id: student.id,
      name: student.name,
      present: present,
      late: late,
      presentAlways: attended,
      absent: absent,
      total: sessions.length,
    };
  });

  const handleDownload = () => {
    downloadReport(attendanceData);
  }

  const openAddStudentDialog = () => {
    setEditingStudent(null);
    setStudentName('');
    setStudentDialogOpen(true);
  };

  const openEditStudentDialog = (student) => {
    setEditingStudent(student);
    setStudentName(student.name);
    setStudentDialogOpen(true);
  };

  const handleSaveStudent = () => {
    if (!studentName.trim()) return;

    if (editingStudent) {
      const updatedStudents = students.map(s =>
        s.id === editingStudent.id ? { ...s, name: studentName } : s
      );
      onStudentUpdate(updatedStudents);
    } else {
      const newStudent = { id: `S${Date.now()}`, name: studentName, status: 'Absent' };
      onStudentUpdate([...students, newStudent]);
    }
    setStudentDialogOpen(false);
    setStudentName('');
    setEditingStudent(null);
  };

  const openDeleteDialog = (studentId) => {
    setStudentToDeleteId(studentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteStudent = () => {
    if (studentToDeleteId) {
      const updatedStudents = students.filter(s => s.id !== studentToDeleteId);
      onStudentUpdate(updatedStudents);
      setStudentToDeleteId(null);
    }
    setDeleteDialogOpen(false);
  };


  return (
    <Card className="shadow-lg h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Student Roster</CardTitle>
            </div>
            <CardDescription>
                Manage students in this course and view their attendance summary.
            </CardDescription>
        </div>
        <div className="flex gap-2">
            <Button onClick={openAddStudentDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Student
            </Button>
            <Button onClick={handleDownload} disabled={sessions.length === 0} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Report
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead className="text-center">Late</TableHead>
                <TableHead className="text-center">Present (always)</TableHead>
                <TableHead className="text-center">Absent</TableHead>
                <TableHead className="text-center">Total Sessions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="7" className="h-24 text-center">
                    No students in this course yet. Click "Add Student" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                attendanceData.map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-center text-green-600 font-semibold">{student.present}</TableCell>
                    <TableCell className="text-center text-yellow-500 font-semibold">{student.late}</TableCell>
                    <TableCell className="text-center font-bold">{student.presentAlways}</TableCell>
                    <TableCell className="text-center text-red-600 font-semibold">{student.absent}</TableCell>
                    <TableCell className="text-center">{student.total}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-5 w-5" />
                                    <span className="sr-only">Student options</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditStudentDialog(student)}>
                                    <Pencil />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => openDeleteDialog(student.id)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>

      <Dialog open={isStudentDialogOpen} onOpenChange={setStudentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
            <DialogDescription>
              Enter the student's full name.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
              <Label htmlFor="student-name">Student Name</Label>
              <Input 
                id="student-name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g., 'John Doe'"
              />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStudentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveStudent}>
              {editingStudent ? 'Save Changes' : 'Add Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this student and all their attendance data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
