
import CheckinForm from '@/components/checkin-form';

export default function CheckinPage({ params }) {
  return (
    <main className="min-h-screen bg-background font-body text-foreground flex items-center justify-center p-4">
      <CheckinForm courseId={params.courseId} sessionId={params.sessionId} />
    </main>
  );
}
