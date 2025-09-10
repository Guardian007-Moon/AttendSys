
import CheckinForm from '@/components/checkin-form';
import { School } from 'lucide-react';

export default function CheckinPage({ params }) {
  return (
    <main className="min-h-screen font-body text-foreground flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400 p-6 relative">
       <div className="absolute top-6 left-6 flex items-center space-x-2 text-2xl font-bold text-white">
            <School className="h-8 w-8" />
            <span>AttendSys</span>
        </div>
      <CheckinForm courseId={params.courseId} sessionId={params.sessionId} />
       <footer className="absolute bottom-6 text-white/70 text-sm">
        Easy check-in system • 2025
      </footer>
    </main>
  );
}
