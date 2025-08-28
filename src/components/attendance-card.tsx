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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

type Student = {
  id: string;
  name: string;
  status: 'Present' | 'Absent';
};

type AttendanceCardProps = {
  students: Student[];
};

export default function AttendanceCard({ students }: AttendanceCardProps) {
  const presentCount = students.filter(s => s.status === 'Present').length;
  const totalCount = students.length;

  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Classroom Attendance</CardTitle>
        </div>
        <CardDescription>
          Live view of student check-ins. {presentCount} of {totalCount} students present.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(student => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      className={
                        student.status === 'Present'
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
