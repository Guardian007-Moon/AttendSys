import Courses from '@/components/courses';

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-background font-body text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Courses />
      </div>
    </main>
  );
}
