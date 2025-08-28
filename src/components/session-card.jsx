'use client';

import Image from 'next/image';
import { PlayCircle, StopCircle, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SessionCard({
  isSessionActive,
  onStart,
  onEnd,
}) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <QrCode className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Attendance Session</CardTitle>
        </div>
        <CardDescription>
          Control the QR code display for student check-in.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        {isSessionActive ? (
          <>
            <div className="p-4 bg-white rounded-lg shadow-inner">
              <Image
                src="https://placehold.co/200x200/ffffff/3498db?text=Scan+Me"
                alt="QR Code for attendance"
                width={200}
                height={200}
                className="rounded-lg"
                data-ai-hint="qr code"
              />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Session is active. Students can scan the code to mark their attendance.
            </p>
            <Button onClick={onEnd} className="w-full" variant="destructive">
              <StopCircle />
              End Session
            </Button>
          </>
        ) : (
          <>
            <div className="w-[200px] h-[200px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Session is not active</p>
            </div>
             <p className="text-sm text-center text-muted-foreground">
              Click the button below to start a new attendance session.
            </p>
            <Button onClick={onStart} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlayCircle />
              Start Session
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
