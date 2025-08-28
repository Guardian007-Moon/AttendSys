
'use client';

import { useState } from 'react';
import { Book, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateCourseDialog from './create-course-dialog';
import EditCourseDialog from './edit-course-dialog';
import CourseList from './course-list';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { initialCourses } from '@/lib/mock-data';

let courseStore = [...initialCourses];

export default function Courses() {
  const [courses, setCourses] = useState(courseStore);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseToDeleteId, setCourseToDeleteId] = useState(null);

  const handleAddCourse = newCourse => {
    const newCourseWithId = { ...newCourse, id: `C${Date.now()}` };
    courseStore = [...courseStore, newCourseWithId];
    setCourses(courseStore);
  };

  const handleOpenEditDialog = course => {
    setSelectedCourse(course);
    setEditDialogOpen(true);
  };

  const handleUpdateCourse = updatedCourse => {
    courseStore = courseStore.map(c =>
      c.id === updatedCourse.id ? updatedCourse : c
    );
    setCourses(courseStore);
    setSelectedCourse(null);
  };

  const handleOpenDeleteDialog = courseId => {
    setCourseToDeleteId(courseId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCourse = () => {
    if (courseToDeleteId) {
      courseStore = courseStore.filter(c => c.id !== courseToDeleteId);
      setCourses(courseStore);
      setCourseToDeleteId(null);
    }
    setDeleteDialogOpen(false);
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
      <CourseList
        courses={courses}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
      />
      <CreateCourseDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCourseCreate={handleAddCourse}
      />
      {selectedCourse && (
        <EditCourseDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setEditDialogOpen}
          onCourseUpdate={handleUpdateCourse}
          course={selectedCourse}
        />
      )}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
