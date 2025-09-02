
'use client';
import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const statusStyles = {
  Present: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
  Absent: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
  Late: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
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
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isClient ? (
                students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-right">
                       <Badge
                        variant="outline"
                        className={cn(
                          'font-semibold',
                          statusStyles[student.status] || statusStyles['Absent']
                        )}
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-5 w-3/4" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-6 w-16" />
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
