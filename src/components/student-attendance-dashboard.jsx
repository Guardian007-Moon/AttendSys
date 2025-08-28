import { Download } from 'lucide-react';
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

// Mock function to simulate generating and downloading a CSV report.
const downloadReport = (data) => {
  const headers = ['Student Name', 'Present', 'Absent', 'Total Sessions'];
  const csvRows = [
    headers.join(','),
    ...data.map(row => [row.name, row.present, row.absent, row.total].join(',')),
  ];
  
  const blob = new Blob([csvRows.join('\\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'attendance_report.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


export default function StudentAttendanceDashboard({ students, sessions }) {
  // In a real app, this data would be fetched and calculated from session records.
  // For this prototype, we'll generate some mock data.
  const attendanceData = students.map(student => {
    const present = Math.floor(Math.random() * (sessions.length + 1));
    const absent = sessions.length - present;
    return {
      name: student.name,
      present: present,
      absent: absent,
      total: sessions.length,
    };
  });

  const handleDownload = () => {
    downloadReport(attendanceData);
  }

  return (
    <Card className="shadow-lg h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="font-headline">Student Attendance</CardTitle>
            <CardDescription>
                Overall attendance summary for all students in this course.
            </CardDescription>
        </div>
        <Button onClick={handleDownload} disabled={sessions.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead className="text-center">Absent</TableHead>
                <TableHead className="text-center">Total Sessions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="4" className="h-24 text-center">
                    No sessions created yet. Create a session to see attendance data.
                  </TableCell>
                </TableRow>
              ) : (
                attendanceData.map(student => (
                  <TableRow key={student.name}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-center text-green-600 font-semibold">{student.present}</TableCell>
                    <TableCell className="text-center text-red-600 font-semibold">{student.absent}</TableCell>
                    <TableCell className="text-center">{student.total}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
