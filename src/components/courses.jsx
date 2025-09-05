'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, PlusCircle, Search, Filter, Calendar, Users, Clock, Edit3, Trash2, ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateCourseDialog from './create-course-dialog';
import EditCourseDialog from './edit-course-dialog';
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
import { initialCourses, initialCourseStudents as allStudents } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getInitialCourses = () => {
  if (typeof window === 'undefined') return initialCourses;
  const storedCourses = localStorage.getItem('courses');
  const courses = storedCourses ? JSON.parse(storedCourses) : initialCourses;
  // Attach student counts
  return courses.map(course => ({
    ...course,
    studentCount: (allStudents[course.id] || []).length
  }));
};

let courseStore = [];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseToDeleteId, setCourseToDeleteId] = useState(null);

  useEffect(() => {
    courseStore = getInitialCourses();
    setCourses(courseStore);
  }, []);

  useEffect(() => {
    let results = courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOption) {
      case 'name-asc':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        results.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'students-desc':
        results.sort((a, b) => (b.studentCount || 0) - (a.studentCount || 0));
        break;
      case 'students-asc':
        results.sort((a, b) => (a.studentCount || 0) - (b.studentCount || 0));
        break;
      default:
        break;
    }

    setFilteredCourses(results);
  }, [searchTerm, courses, sortOption]);

  const updateLocalStorage = (newCourses) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('courses', JSON.stringify(newCourses));
    }
  };

  const handleAddCourse = newCourse => {
    const newCourseWithId = { ...newCourse, id: `C${Date.now()}`, studentCount: 0 };
    courseStore = [...courseStore, newCourseWithId];
    setCourses(courseStore);
    updateLocalStorage(courseStore);
  };

  const handleOpenEditDialog = course => {
    setSelectedCourse(course);
    setEditDialogOpen(true);
  };

  const handleUpdateCourse = updatedCourse => {
    courseStore = courseStore.map(c =>
      c.id === updatedCourse.id ? { ...c, ...updatedCourse } : c
    );
    setCourses(courseStore);
    updateLocalStorage(courseStore);
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
      updateLocalStorage(courseStore);
      setCourseToDeleteId(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Book className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-3xl font-bold font-headline text-primary">
                My Courses
              </h1>
            </div>
            <p className="text-muted-foreground ml-12">
              Manage your courses and track attendance.
            </p>
          </div>
          <Button 
            onClick={() => setCreateDialogOpen(true)} 
            className="bg-primary hover:bg-primary/90 shadow-md px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Create Course
          </Button>
        </header>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-2 rounded-lg border-gray-200 focus:border-primary w-full"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border-gray-200">
                  <Filter size={16} />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
                  <DropdownMenuRadioItem value="name-asc">Course Name (A-Z)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name-desc">Course Name (Z-A)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="students-desc">Students (Most to Fewest)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="students-asc">Students (Fewest to Most)</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
               <Card key={course.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-3 bg-gradient-to-r from-primary to-primary/80 text-white">
                    <div className="flex justify-between items-start">
                        <Link href={`/courses/${course.id}`} className="block">
                            <CardTitle className="text-white text-xl group-hover:underline">{course.name}</CardTitle>
                            <CardDescription className="text-white/80">{course.id}</CardDescription>
                        </Link>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Book size={20} className="text-white" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-4">
                    <p className="text-sm text-muted-foreground mb-4 h-10">{course.description}</p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground border-t pt-4">
                       <div className="flex items-center">
                         <Users className="h-4 w-4 mr-2" />
                         <span>{course.studentCount || 0} students</span>
                       </div>
                        <div className="flex gap-2">
                           <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenEditDialog(course)}
                              className="h-8 w-8 hover:bg-primary/10"
                            >
                              <Edit3 size={16} className="text-primary" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenDeleteDialog(course.id)}
                              className="h-8 w-8 hover:bg-red-50"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <Book className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No courses found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm ? 'Try adjusting your search term' : 'Get started by creating your first course'}
            </p>
            <Button 
              onClick={() => setCreateDialogOpen(true)} 
              className="bg-primary hover:bg-primary/90"
            >
              <PlusCircle size={16} className="mr-2" />
              Create Course
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs */}
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
        <AlertDialogContent className="bg-white rounded-xl border-0 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">Delete Course</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              This action cannot be undone. This will permanently delete this course and all its attendance records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 hover:bg-gray-50">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCourse}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
