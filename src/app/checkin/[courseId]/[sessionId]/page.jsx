
import CheckinForm from '@/components/checkin-form';

export default function CheckinPage({ params }) {
  return (
    <main className="min-h-screen bg-background font-body text-foreground flex items-center justify-center">
      <div className="container max-w-md mx-auto p-4 sm:p-6 lg:p-8">
        <CheckinForm courseId={params.courseId} sessionId={params.sessionId} />
      </div>
    </main>
  );
}
