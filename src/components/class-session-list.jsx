import { Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ClassSessionList({ sessions }) {
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
        <ScrollArea className="h-[450px]">
            <div className="space-y-4">
                {sessions.map(session => (
                    <div key={session.id} className="p-3 rounded-lg border flex justify-between items-center">
                        <div>
                            <p className="font-medium">{session.name}</p>
                            <p className="text-sm text-muted-foreground">{new Date(session.date).toLocaleDateString()}</p>
                        </div>
                        <Badge>Not Started</Badge>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
