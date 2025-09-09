
import PageTransitionLink from './PageTransitionLink';
import { Clock, Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hour, minute] = timeString.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = hourNum % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
}

const getSessionStatus = (session) => {
    const now = new Date();
    const sessionDate = new Date(session.date);
    
    const [startHour, startMinute] = session.startTime.split(':');
    const sessionStart = new Date(sessionDate.getTime());
    sessionStart.setHours(startHour, startMinute, 0, 0);

    const [endHour, endMinute] = session.endTime.split(':');
    const sessionEnd = new Date(sessionDate.getTime());
    sessionEnd.setHours(endHour, endMinute, 0, 0);

    if (now > sessionEnd) {
        return { text: "Finished", className: "bg-gray-500" };
    } else if (now >= sessionStart && now <= sessionEnd) {
        return { text: "Active", className: "bg-green-500 animate-pulse" };
    } else {
        return { text: "Not Started", className: "" };
    }
};


export default function ClassSessionList({ sessions, courseId, onEdit, onDelete }) {
  const [sessionStatuses, setSessionStatuses] = useState({});

  useEffect(() => {
    const updateStatuses = () => {
      const newStatuses = {};
      sessions.forEach(session => {
        newStatuses[session.id] = getSessionStatus(session);
      });
      setSessionStatuses(newStatuses);
    };

    updateStatuses();
    const interval = setInterval(updateStatuses, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [sessions]);


  if (sessions.length === 0) {
    return (
      <Card className="shadow-lg h-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Class Sessions</CardTitle>
          </div>
          <CardDescription>
            No active or past sessions for this course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mt-2">
              Click "Create Session" to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Class Sessions</CardTitle>
        </div>
        <CardDescription>
          View active and past class sessions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
            <div className="space-y-4">
                {sessions.map(session => {
                    const status = sessionStatuses[session.id] || getSessionStatus(session);
                    return (
                        <div key={session.id} className="p-3 rounded-lg border flex justify-between items-center">
                            <div>
                                <p className="font-medium">{session.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(session.date).toLocaleDateString()} - {formatTime(session.startTime)} to {formatTime(session.endTime)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className={cn(status.className)}>{status.text}</Badge>
                                <PageTransitionLink href={`/courses/${courseId}/sessions/${session.id}`} passHref>
                                    <Button variant="outline" size="icon">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </PageTransitionLink>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-5 w-5" />
                                            <span className="sr-only">Session options</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEdit(session)}>
                                            <Pencil />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onDelete(session.id)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    )
                })}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
