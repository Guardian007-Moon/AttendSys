import { QrCode } from 'lucide-react';
import Dashboard from '@/components/dashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-body text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <QrCode className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline text-primary">
              QTrack
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Welcome to your attendance tracking dashboard.
          </p>
        </header>
        <Dashboard />
      </div>
    </main>
  );
}
