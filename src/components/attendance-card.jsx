
'use client';
import { useState, useEffect } from 'react';
import { Users, Smile, Frown, Meh } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const statusDisplay = {
    Present: (
        <div className="flex items-center justify-end gap-2 text-green-500 font-medium">
            <Smile className="h-6 w-6" />
            <span>Present</span>
        </div>
    ),
    Absent: (
        <div className="flex items-center justify-end gap-2 text-red-500 font-medium">
            <Frown className="h-6 w-6" />
            <span>Absent</span>
        </div>
    ),
    Late: (
        <div className="flex items-center justify-end gap-2 text-yellow-500 font-medium">
            <Meh className="h-6 w-6" />
            <span>Late</span>
        </div>
    ),
};


export default function AttendanceCard({ students, onStudentStatusChange }) {
  const [presentCount, setPresentCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setPresentCount(students.filter(s => s.status === 'Present' || s.status === 'Late').length);
      setTotalCount(students.length);
    }
  }, [students, isClient]);

  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Classroom Attendance</CardTitle>
        </div>
        <CardDescription>
          Live view of student check-ins.{' '}
          {isClient ? (
            <>
              {presentCount} of {totalCount} students present.
            </>
          ) : (
            'Loading attendance...'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-center">Check-in Time</TableHead>
                <TableHead className="text-center">Distance</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isClient ? (
                students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-center">
                        {student.checkinTime || 'N/A'}
                    </TableCell>
                    <TableCell className="text-center">
                        {student.distance != null ? `${student.distance}m` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {statusDisplay[student.status] || statusDisplay['Absent']}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-5 w-3/4" />
                    </TableCell>
                     <TableCell className="text-center">
                      <Skeleton className="h-5 w-20 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-5 w-20 mx-auto" />
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
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
