
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Book, PlusCircle, Search, Filter, Calendar, Users, Clock, Edit3, Trash2, ArrowUp, ArrowDown, ChevronsUpDown, BarChart3, TrendingUp, Award, Target, CheckSquare, Edit, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateCourseDialog from './create-course-dialog';
import EditCourseDialog from './edit-course-dialog';
import EditProfileDialog from './edit-profile-dialog';
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
import { initialCourses, initialCourseStudents as allStudents, loadAttendance } from '@/lib/mock-data';
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

const getInitialProfile = () => {
    if (typeof window === 'undefined') {
        return { name: 'Professor', summary: "Here's your dashboard to manage courses, track attendance, and gain insights into student engagement. Have a productive day!", imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop' };
    }
    const storedProfile = localStorage.getItem('teacherProfile');
    return storedProfile ? JSON.parse(storedProfile) : { name: 'Professor', summary: "Here's your dashboard to manage courses, track attendance, and gain insights into student engagement. Have a productive day!", imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop' };
}

let courseStore = [];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [profile, setProfile] = useState({ name: '', summary: '', imageUrl: ''});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseToDeleteId, setCourseToDeleteId] = useState(null);

  useEffect(() => {
    courseStore = getInitialCourses();
    setCourses(courseStore);
    setProfile(getInitialProfile());
  }, []);

  const filteredAndSortedCourses = useMemo(() => {
    let results = courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.code && course.code.toLowerCase().includes(searchTerm.toLowerCase()))
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
    return results;
  }, [searchTerm, courses, sortOption]);
  
  const groupedCourses = useMemo(() => {
      const groups = {};
      filteredAndSortedCourses.forEach(course => {
          const year = course.year || 'Uncategorized';
          if(!groups[year]) {
              groups[year] = [];
          }
          groups[year].push(course);
      });
      return groups;
  }, [filteredAndSortedCourses]);

  const calculateAverageAttendance = () => {
    if (typeof window === 'undefined' || courses.length === 0) return 0;
    
    const allAttendance = loadAttendance();
    let totalCoursesWithSessions = 0;
    const totalAverageAttendance = courses.reduce((courseSum, course) => {
      const storedSessions = localStorage.getItem(`sessions_${course.id}`);
      const sessions = storedSessions ? JSON.parse(storedSessions) : [];
      
      if (sessions.length > 0) {
        let totalPresentInCourse = 0;
        sessions.forEach(session => {
          const sessionAttendance = allAttendance[session.id] || {};
          const presentCount = Object.values(sessionAttendance).filter(
            record => record.status === 'Present' || record.status === 'Late'
          ).length;
          totalPresentInCourse += presentCount;
        });
        
        totalCoursesWithSessions++;
        return courseSum + (totalPresentInCourse / sessions.length);
      }
      
      return courseSum;
    }, 0);

    if (totalCoursesWithSessions === 0) return 0;
    return (totalAverageAttendance / totalCoursesWithSessions).toFixed(1);
  };


  // Calculate summary statistics
  const totalStudents = courses.reduce((sum, course) => sum + (course.studentCount || 0), 0);
  const averageAttendance = calculateAverageAttendance();
  const mostPopularCourse = courses.length > 0 
    ? courses.reduce((max, course) => (course.studentCount > max.studentCount ? course : max), courses[0])
    : null;

  const updateLocalStorage = (newCourses) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('courses', JSON.stringify(newCourses));
    }
  };
  
  const updateProfileLocalStorage = (newProfile) => {
      if(typeof window !== 'undefined') {
          localStorage.setItem('teacherProfile', JSON.stringify(newProfile));
      }
  }

  const handleAddCourse = newCourse => {
    const newCourseWithId = { 
      ...newCourse, 
      id: `C${Date.now()}`, 
      studentCount: 0,
      code: newCourse.code || `CRS${Date.now().toString().slice(-4)}`
    };
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

  const handleUpdateProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    updateProfileLocalStorage(updatedProfile);
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

  const getSortLabel = () => {
    switch(sortOption) {
      case 'name-asc': return 'Name (A-Z)';
      case 'name-desc': return 'Name (Z-A)';
      case 'students-desc': return 'Students (Most)';
      case 'students-asc': return 'Students (Fewest)';
      default: return 'Sort by';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/80 to-green-50/80 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Teacher Profile Section */}
        <Card className="mb-8 card card-hover rounded-xl border-0 overflow-hidden animate-fade-in">
            <CardContent className="p-5 flex items-center gap-6">
                <Image
                src={profile.imageUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop"}
                width={80}
                height={80}
                alt="Teacher Profile Picture"
                className="rounded-full border-4 border-white shadow-md object-cover"
                data-ai-hint="teacher profile"
                />
                <div className="flex-1">
                <h2 className="text-2xl font-bold">Welcome Back, {profile.name}!</h2>
                <p className="text-muted-foreground mt-1">
                    {profile.summary}
                </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setProfileDialogOpen(true)}>
                    <Edit className="h-5 w-5" />
                </Button>
            </CardContent>
        </Card>
      
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Book className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-3xl font-bold font-headline text-gradient">
                My Courses
              </h1>
            </div>
            <p className="text-muted-foreground ml-12">
              Manage your courses and track attendance.
            </p>
          </div>
          <Button 
            onClick={() => setCreateDialogOpen(true)} 
            className="btn-primary shadow-glow px-5 py-2.5 rounded-xl flex items-center gap-2 animate-fade-in"
          >
            <PlusCircle size={18} />
            Create Course
          </Button>
        </header>

        {/* Summary Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Card className="card card-hover rounded-xl border-0 overflow-hidden animate-fade-in">
            <CardContent className="p-5 flex items-center">
              <div className="bg-primary/10 p-3 rounded-xl mr-4">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <h3 className="text-2xl font-bold">{courses.length}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="card card-hover rounded-xl border-0 overflow-hidden animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-5 flex items-center">
              <div className="bg-green-500/10 p-3 rounded-xl mr-4">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <h3 className="text-2xl font-bold">{totalStudents}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="card card-hover rounded-xl border-0 overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-5 flex items-center">
              <div className="bg-blue-500/10 p-3 rounded-xl mr-4">
                <CheckSquare className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Attendance</p>
                <h3 className="text-2xl font-bold">{averageAttendance}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="card card-hover rounded-xl border-0 overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-5 flex items-center">
              <div className="bg-amber-500/10 p-3 rounded-xl mr-4">
                <Award className="h-6 w-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Most Popular</p>
                <h3 className="text-lg font-bold">
                  {mostPopularCourse ? mostPopularCourse.name : 'N/A'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {mostPopularCourse ? `${mostPopularCourse.studentCount} students` : ''}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 card p-5 rounded-xl animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 py-2.5 rounded-xl w-full"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 rounded-xl">
                  <Filter size={16} />
                  {getSortLabel()}
                  <ChevronsUpDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl w-56">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
                  <DropdownMenuRadioItem value="name-asc" className="cursor-pointer">
                    <ArrowUp size={14} className="mr-2" />
                    Course Name (A-Z)
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name-desc" className="cursor-pointer">
                    <ArrowDown size={14} className="mr-2" />
                    Course Name (Z-A)
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="students-desc" className="cursor-pointer">
                    <Users size={14} className="mr-2" />
                    Students (Most to Fewest)
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="students-asc" className="cursor-pointer">
                    <Users size={14} className="mr-2" />
                    Students (Fewest to Most)
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Courses Grid */}
        {Object.keys(groupedCourses).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedCourses).map(([year, coursesInYear]) => (
              <div key={year} className="animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="h-6 w-6 text-primary/80" />
                  <h2 className="text-xl font-bold text-foreground">{year}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesInYear.map((course, index) => (
                    <Card 
                      key={course.id} 
                      className="card card-hover overflow-hidden border-0 rounded-xl"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <CardHeader className="pb-4 gradient-primary text-white p-5">
                        <div className="flex justify-between items-start">
                          <Link href={`/courses/${course.id}`} className="block flex-1">
                            <CardTitle className="text-white text-xl font-semibold">{course.name}</CardTitle>
                            <CardDescription className="text-white/90 mt-1">{course.code}</CardDescription>
                          </Link>
                          <div className="glass p-2 rounded-lg">
                            <Book size={20} className="text-white" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-12">
                          {course.description || "No description available."}
                        </p>
                        
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span>{course.schedule || "Schedule not set"}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm border-t pt-4">
                          <div className="flex items-center text-muted-foreground">
                            <Users className="h-4 w-4 mr-2 text-primary" />
                            <span>{course.studentCount || 0} students</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenEditDialog(course)}
                              className="h-9 w-9 rounded-lg hover:bg-primary/10"
                            >
                              <Edit3 size={16} className="text-primary" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenDeleteDialog(course.id)}
                              className="h-9 w-9 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16 rounded-xl animate-fade-in">
            <div className="glass p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Book className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm ? 'Try adjusting your search term' : 'Get started by creating your first course'}
            </p>
            <Button 
              onClick={() => setCreateDialogOpen(true)} 
              className="btn-primary shadow-glow"
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

      {profile && (
          <EditProfileDialog
            isOpen={isProfileDialogOpen}
            onOpenChange={setProfileDialogOpen}
            onProfileUpdate={handleUpdateProfile}
            profile={profile}
            />
      )}
      
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent className="card rounded-xl border-0 p-6 max-w-md">
          <AlertDialogHeader>
            <div className="bg-red-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold text-foreground">
              Delete Course
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete the course "{courses.find(c => c.id === courseToDeleteId)?.name}" and all its attendance records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3 mt-6">
            <AlertDialogCancel className="btn-secondary rounded-lg flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCourse}
              className="btn bg-red-500 hover:bg-red-600 text-white rounded-lg flex-1"
            >
              Delete Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
