import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Pencil, Trash2 } from 'lucide-react';

export default function CourseList({ courses, onEdit, onDelete }) {
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
      {courses.map(course => (
        <Card key={course.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{course.name}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow" />
          <CardFooter className="flex justify-between gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(course)}
              aria-label="Edit course"
            >
              <Pencil className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(course.id)}
              className="text-destructive hover:text-destructive"
              aria-label="Delete course"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
            <Link href={`/courses/${course.id}`} passHref className="flex-grow">
              <Button variant="outline" className="w-full">
                View
                <ArrowRight />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
