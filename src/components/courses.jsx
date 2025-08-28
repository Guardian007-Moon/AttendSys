'use client';

import { useState } from 'react';
import { Book, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateCourseDialog from './create-course-dialog';
import CourseList from './course-list';

const initialCourses = [
  {
    id: 'CS101',
    name: 'Introduction to Computer Science',
    description: 'Learn the fundamentals of programming and computer science.',
  },
  {
    id: 'PHY201',
    name: 'University Physics I',
    description: 'Explore classical mechanics and thermodynamics.',
  },
  {
    id: 'ENG303',
    name: 'Shakespearean Literature',
    description: 'A deep dive into the works of William Shakespeare.',
  },
];

// In-memory store for courses to persist across navigation
let courseStore = [...initialCourses];

export default function Courses() {
  // We use a state to trigger re-renders, but the source of truth is courseStore
  const [courses, setCourses] = useState(courseStore);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const handleAddCourse = (newCourse) => {
    const newCourseWithId = { ...newCourse, id: `C${Date.now()}` };
    courseStore = [...courseStore, newCourseWithId];
    setCourses(courseStore);
  };

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
           <div className="flex items-center gap-3">
            <Book className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline text-primary">
              My Courses
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Manage your courses and track attendance.
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle />
          Create Course
        </Button>
      </header>
      <CourseList courses={courses} />
      <CreateCourseDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCourseCreate={handleAddCourse}
      />
    </>
  );
}
