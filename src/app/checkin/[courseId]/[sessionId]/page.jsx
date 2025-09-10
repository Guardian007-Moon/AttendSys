
import CheckinForm from '@/components/checkin-form';

export default function CheckinPage({ params }) {
  return (
    <main className="min-h-screen font-body text-foreground flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400 p-6">
      <CheckinForm courseId={params.courseId} sessionId={params.sessionId} />
    </main>
  );
}
