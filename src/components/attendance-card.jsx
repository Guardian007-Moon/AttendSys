
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function AttendanceCard({ students, onStudentStatusChange }) {
  const [presentCount, setPresentCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setPresentCount(students.filter(s => s.status === 'Present').length);
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
                      <div className="flex items-center justify-end gap-2">
                         <Label
                          htmlFor={`status-switch-${student.id}`}
                          className={cn(
                            student.status === 'Present'
                              ? 'text-accent'
                              : 'text-muted-foreground'
                          )}
                        >
                          {student.status}
                        </Label>
                        <Switch
                          id={`status-switch-${student.id}`}
                          checked={student.status === 'Present'}
                          onCheckedChange={isChecked =>
                            onStudentStatusChange(
                              student.id,
                              isChecked ? 'Present' : 'Absent'
                            )
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Show skeleton loaders on the server and initial client render
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-5 w-3/4" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-6 w-11" />
                      </div>
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
