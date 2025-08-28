import Dashboard from '@/components/dashboard';

export default function CoursePage() {
  // In a real app, you would fetch course data based on the courseId
  return (
    <main className="min-h-screen bg-background font-body text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Dashboard />
      </div>
    </main>
  );
}
