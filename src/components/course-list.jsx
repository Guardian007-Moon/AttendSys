import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CourseList({ courses }) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <h2 className="text-xl font-semibold">No Courses Yet</h2>
        <p className="text-muted-foreground mt-2">
          Click "Create Course" to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{course.name}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow" />
          <CardFooter>
            <Link href={`/courses/${course.id}`} passHref className="w-full">
              <Button variant="outline" className="w-full">
                View Course
                <ArrowRight />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
