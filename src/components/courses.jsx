

'use client';

import { useState, useEffect, useMemo } from 'react';
import PageTransitionLink from './PageTransitionLink';
import Image from 'next/image';
import { Book, PlusCircle, Search, Filter, Calendar, Users, Clock, Edit3, Trash2, ArrowUp, ArrowDown, ChevronsUpDown, BarChart3, TrendingUp, Award, Target, CheckSquare, Edit, GraduationCap, X, Check, CheckCircle } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { initialCourses, initialCourseStudents as allStudents, loadAttendance } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import CourseBannerImage from './CourseBannerImage';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from "@/components/ui/toast"


const getInitialCourses = () => {
    if (typeof window === 'undefined') return initialCourses;
    
    const storedCoursesRaw = localStorage.getItem('courses');
    const storedCourses = storedCoursesRaw ? JSON.parse(storedCoursesRaw) : [];
    const storedCourseIds = new Set(storedCourses.map(c => c.id));

    // Filter out initial courses that are already in local storage
    const newInitialCourses = initialCourses.filter(c => !storedCourseIds.has(c.id));
    
    const courses = [...storedCourses, ...newInitialCourses];

    // Attach student counts
    return courses.map(course => ({
        ...course,
        studentCount: (allStudents[course.id] || []).length
    }));
};

const getInitialProfile = () => {
    if (typeof window === 'undefined') {
        return { name: 'Professor', summary: "You could write some introduction about yourself, your wisdoms for today or things to do. Have a productive day!", imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf_hA0y1cQ_H8FCo_H2yX49J1H2kRGAE0ORQ&s' };
    }
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    const storedProfileRaw = localStorage.getItem('teacherProfile');
    
    let profile = storedProfileRaw 
        ? JSON.parse(storedProfileRaw)
        : { 
              name: 'Professor', 
              summary: "You could write some introduction about yourself, your wisdoms for today or things to do. Have a productive day!", 
              imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf_hA0y1cQ_H8FCo_H2yX49J1H2kRGAE0ORQ&s' 
          };

    if (loggedInUsername) {
        // If a new user logs in, we update the name but keep the other potentially customized profile fields.
        // If there's no existing profile, this just adds the name to the default profile.
        profile.name = loggedInUsername;
        localStorage.setItem('teacherProfile', JSON.stringify(profile));
        localStorage.removeItem('loggedInUsername'); // Clear the temporary username
    }

    return profile;
}


let courseStore = [];

const Sorter = ({ onCheckedChange, checked, children }) => (
  <DropdownMenuCheckboxItem
    onCheckedChange={onCheckedChange}
    checked={checked}
    onSelect={(e) => e.preventDefault()}
    className="cursor-pointer"
  >
    {children}
  </DropdownMenuCheckboxItem>
);

const CourseCard = ({ course, onEdit, onDelete, index }) => {
    return (
        <div className="flex-shrink-0 w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]">
            <PageTransitionLink href={`/courses/${course.id}`} className="block h-full">
                <Card 
                    className="card card-hover overflow-hidden border-0 rounded-xl h-full flex flex-col"
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                    <div className="relative">
                        <CourseBannerImage
                            src={course.bannerUrl}
                            width={600}
                            height={200}
                            alt={`${course.name} banner`}
                            className="w-full h-32 object-cover"
                            data-ai-hint="course banner"
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                    <CardHeader className="pt-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <CardTitle className="text-xl font-semibold">{course.name}</CardTitle>
                                <CardDescription className="mt-1">{course.code}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-2 flex-grow flex flex-col">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10 flex-grow">
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
                                    onClick={(e) => onEdit(e, course)}
                                    className="h-9 w-9 rounded-lg hover:bg-primary/10"
                                >
                                    <Edit3 size={16} className="text-primary" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={(e) => onDelete(e, course.id)}
                                    className="h-9 w-9 rounded-lg hover:bg-red-50"
                                >
                                    <Trash2 size={16} className="text-red-500" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </PageTransitionLink>
        </div>
    );
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [profile, setProfile] = useState({ name: '', summary: '', imageUrl: ''});
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortOptions, setSortOptions] = useState([
    { key: 'year', order: 'asc' },
    { key: 'name', order: 'asc' },
  ]);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false);
  const [isImagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseToDeleteId, setCourseToDeleteId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    courseStore = getInitialCourses();
    setCourses(courseStore);
    updateLocalStorage(courseStore); // Save the potentially merged list back to storage
    setProfile(getInitialProfile());
  }, []);
  
  const handleSortChange = (key, order) => {
    setSortOptions(prev => {
      const existing = prev.find(opt => opt.key === key && opt.order === order);
      if (existing) {
        return prev.filter(opt => !(opt.key === key && opt.order === order));
      } else {
        // Remove any other sorts for the same key
        const otherRemoved = prev.filter(opt => opt.key !== key);
        return [...otherRemoved, { key, order }];
      }
    });
  };
  
  const getSortState = (key, order) => {
    return sortOptions.some(opt => opt.key === key && opt.order === order);
  };

  const availableYears = useMemo(() => {
    const years = new Set(courses.map(c => c.year).filter(Boolean));
    return ['all', ...Array.from(years).sort()];
  }, [courses]);

  const filteredAndSortedCourses = useMemo(() => {
    let results = courses.filter(course =>
      (course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.code && course.code.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (yearFilter === 'all' || course.year === yearFilter)
    );

    results.sort((a, b) => {
      for (const sortOption of sortOptions) {
        const { key, order } = sortOption;
        const valA = a[key];
        const valB = b[key];
        
        let comparison = 0;
        if (key === 'year' || key === 'studentCount') {
          comparison = (parseInt(valA) || 0) - (parseInt(valB) || 0);
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        }

        if (comparison !== 0) {
          return order === 'asc' ? comparison : -comparison;
        }
      }
      return 0;
    });
    
    return results;
  }, [searchTerm, courses, sortOptions, yearFilter]);
  
  const groupedCourses = useMemo(() => {
      const groups = new Map();
      filteredAndSortedCourses.forEach(course => {
          const year = course.year || 'Uncategorized';
          if (!groups.has(year)) {
              groups.set(year, []);
          }
          groups.get(year).push(course);
      });

      const sortedGroupKeys = Array.from(groups.keys());
      const primarySortKey = sortOptions.length > 0 ? sortOptions[0].key : null;

      if (primarySortKey === 'year' && yearFilter === 'all') {
          const yearSortOrder = sortOptions[0].order;
          sortedGroupKeys.sort((a, b) => {
              if (a === 'Uncategorized') return 1;
              if (b === 'Uncategorized') return -1;
              
              const numA = parseInt(a);
              const numB = parseInt(b);

              if (isNaN(numA) && isNaN(numB)) return a.localeCompare(b);
              if (isNaN(numA)) return 1;
              if (isNaN(numB)) return -1;

              const comparison = numA - numB;
              return yearSortOrder === 'asc' ? comparison : -comparison;
          });
          return new Map(sortedGroupKeys.map(key => [key, groups.get(key)]));
      }

      // If not sorting by year, return the groups in the order they were found, which respects the primary sort
      return groups;
  }, [filteredAndSortedCourses, sortOptions, yearFilter]);

  const calculateAverageAttendance = () => {
    if (typeof window === 'undefined' || courses.length === 0) return 0;
    
    const allAttendance = loadAttendance();
    let totalPresent = 0;
    let totalSessionsWithAttendance = 0;

    courses.forEach(course => {
        const storedSessions = localStorage.getItem(`sessions_${course.id}`);
        const sessions = storedSessions ? JSON.parse(storedSessions) : [];

        sessions.forEach(session => {
            const sessionAttendance = allAttendance[session.id] || {};
            const presentCount = Object.values(sessionAttendance).filter(
                record => record.status === 'Present' || record.status === 'Late'
            ).length;
            
            if(Object.keys(sessionAttendance).length > 0) {
                totalPresent += presentCount;
                totalSessionsWithAttendance++;
            }
        });
    });

    if (totalSessionsWithAttendance === 0) return 0;
    const average = totalPresent / totalSessionsWithAttendance;
    return average.toFixed(1);
  };


  const getMostEngagingCourse = () => {
    if (typeof window === 'undefined' || courses.length === 0) return null;
    
    const allAttendance = loadAttendance();
    
    const courseEngagement = courses.map(course => {
        const storedSessions = localStorage.getItem(`sessions_${course.id}`);
        const sessions = storedSessions ? JSON.parse(storedSessions) : [];
        let totalPresent = 0;

        sessions.forEach(session => {
            const sessionAttendance = allAttendance[session.id] || {};
            const presentCount = Object.values(sessionAttendance).filter(
                record => record.status === 'Present'
            ).length;
            totalPresent += presentCount;
        });

        return { ...course, totalPresent };
    });

    if (courseEngagement.length === 0) return null;

    return courseEngagement.sort((a,b) => b.totalPresent - a.totalPresent)[0];
  }

  // Calculate summary statistics
  const totalStudents = courses.reduce((sum, course) => sum + (course.studentCount || 0), 0);
  const averageAttendance = calculateAverageAttendance();
  const mostEngagingCourse = getMostEngagingCourse();

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
    const newCourseId = `C${Date.now()}`;
    const banner = newCourse.bannerUrl || `https://picsum.photos/seed/${newCourseId}/600/200`;
    const newCourseWithId = { 
      ...newCourse, 
      id: newCourseId, 
      studentCount: 0,
      bannerUrl: banner,
      code: newCourse.code || `CRS${Date.now().toString().slice(-4)}`,
    };
    courseStore = [...courseStore, newCourseWithId];
    setCourses(courseStore);
    updateLocalStorage(courseStore);
    toast({
        title: "Course Created",
        description: `The course "${newCourseWithId.name}" has been successfully created.`,
        action: <CheckCircle className="text-green-500" />,
    });
  };

  const handleOpenEditDialog = (e, course) => {
    e.stopPropagation();
    e.preventDefault();
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
    toast({
        title: "Course Updated",
        description: `The course "${updatedCourse.name}" has been successfully updated.`,
        action: <CheckCircle className="text-green-500" />,
    });
  };

  const handleUpdateProfile = (updatedProfile) => {
    const profileToSave = { ...updatedProfile };
    if (!profileToSave.imageUrl) {
        profileToSave.imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf_hA0y1cQ_H8FCo_H2yX49J1H2kRGAE0ORQ&s';
    }
    setProfile(profileToSave);
    updateProfileLocalStorage(profileToSave);
  };

  const handleOpenDeleteDialog = (e, courseId) => {
    e.stopPropagation();
    e.preventDefault();
    setCourseToDeleteId(courseId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCourse = () => {
    if (courseToDeleteId) {
        const courseToDelete = courseStore.find(c => c.id === courseToDeleteId);
        if (!courseToDelete) return;

        const originalCourses = [...courseStore];
        const courseName = courseToDelete.name;

        // Optimistically update UI
        courseStore = courseStore.filter(c => c.id !== courseToDeleteId);
        setCourses(courseStore);
        updateLocalStorage(courseStore);
        setCourseToDeleteId(null);
        
        const handleUndo = () => {
            courseStore = originalCourses;
            setCourses(courseStore);
            updateLocalStorage(courseStore);
            toast({
                title: "Undo Successful",
                description: `The course "${courseName}" has been restored.`,
            });
        };

        toast({
            title: "Course Deleted",
            description: `Successfully deleted "${courseName}".`,
            variant: "destructive",
            action: (
                <ToastAction altText="Undo" onClick={handleUndo}>
                    Undo
                </ToastAction>
            ),
        });
    }
    setDeleteDialogOpen(false);
};


  const getSortLabel = (option) => {
    switch(`${option.key}-${option.order}`) {
      case 'name-asc': return 'Name (A-Z)';
      case 'name-desc': return 'Name (Z-A)';
      case 'studentCount-asc': return 'Students (Fewest to Most)';
      case 'studentCount-desc': return 'Students (Most to Fewest)';
      case 'year-asc': return 'Year (Asc)';
      case 'year-desc': return 'Year (Desc)';
      default: return '';
    }
  };

  const openImagePreview = (imageUrl) => {
    setPreviewImageUrl(imageUrl);
    setImagePreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/80 to-green-50/80">
      {/* Teacher Profile Section */}
      <div className="bg-pastel-beige py-6">
          <div className="max-w-7xl mx-auto px-6">
              <Card className="card card-hover rounded-xl border-0 overflow-hidden animate-fade-in">
                  <CardContent className="p-5 flex items-center gap-6">
                      <button onClick={() => openImagePreview(profile.imageUrl)} className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full">
                        <CourseBannerImage
                            src={profile.imageUrl}
                            width={80}
                            height={80}
                            alt="Teacher Profile Picture"
                            className="rounded-full border-4 border-white shadow-md object-cover"
                            data-ai-hint="teacher profile"
                        />
                      </button>
                      <div className="flex-1">
                      <h2 className="text-2xl font-bold">Welcome Back, professor {profile.name}!</h2>
                      <p className="text-muted-foreground mt-1">
                          {profile.summary}
                      </p>
                      </div>
                      <div>
                        <Button variant="ghost" size="icon" onClick={() => setProfileDialogOpen(true)}>
                            <Edit className="h-5 w-5" />
                        </Button>
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Book className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-4xl font-bold font-headline text-foreground">
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
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Course with Most Present</p>
                <h3 className="text-lg font-bold whitespace-normal">
                  {mostEngagingCourse ? mostEngagingCourse.name : 'N/A'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {mostEngagingCourse ? `${mostEngagingCourse.totalPresent} total present` : ''}
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
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 rounded-xl">
                    <Filter size={16} />
                    Filter by Year
                    {yearFilter !== 'all' && <Badge variant="secondary">Year {yearFilter}</Badge>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl w-48">
                  <DropdownMenuLabel>Filter by Year</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={yearFilter} onValueChange={setYearFilter}>
                    {availableYears.map(year => (
                      <DropdownMenuRadioItem key={year} value={year} className="cursor-pointer">
                        {year === 'all' ? 'All Years' : `Year ${year}`}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 rounded-xl">
                    <ChevronsUpDown size={16} />
                    Sort
                    {sortOptions.length > 0 && <Badge variant="secondary">{sortOptions.length}</Badge>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl w-64">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                   <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">Name</DropdownMenuLabel>
                   <Sorter onCheckedChange={() => handleSortChange('name', 'asc')} checked={getSortState('name', 'asc')}>
                      <ArrowUp size={14} className="mr-2" /> Name (A-Z)
                   </Sorter>
                   <Sorter onCheckedChange={() => handleSortChange('name', 'desc')} checked={getSortState('name', 'desc')}>
                      <ArrowDown size={14} className="mr-2" /> Name (Z-A)
                   </Sorter>
                   <DropdownMenuSeparator />
                   <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">Students</DropdownMenuLabel>
                   <Sorter onCheckedChange={() => handleSortChange('studentCount', 'desc')} checked={getSortState('studentCount', 'desc')}>
                      <Users size={14} className="mr-2" /> Students (Most to Fewest)
                   </Sorter>
                   <Sorter onCheckedChange={() => handleSortChange('studentCount', 'asc')} checked={getSortState('studentCount', 'asc')}>
                      <Users size={14} className="mr-2" /> Students (Fewest to Most)
                   </Sorter>
                   <DropdownMenuSeparator />
                   <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">Year</DropdownMenuLabel>
                   <Sorter onCheckedChange={() => handleSortChange('year', 'asc')} checked={getSortState('year', 'asc')}>
                     <GraduationCap size={14} className="mr-2" /> Year (Ascending)
                   </Sorter>
                   <Sorter onCheckedChange={() => handleSortChange('year', 'desc')} checked={getSortState('year', 'desc')}>
                     <GraduationCap size={14} className="mr-2" /> Year (Descending)
                   </Sorter>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
            {sortOptions.length > 0 && (
                <div className="flex items-center flex-wrap gap-2 mt-4">
                  <span className="text-sm font-medium">Active Sorts:</span>
                  {sortOptions.map(opt => (
                    <Badge key={`${opt.key}-${opt.order}`} variant="secondary" className="gap-1.5 pr-1">
                      {getSortLabel(opt)}
                      <button
                        onClick={() => handleSortChange(opt.key, opt.order)}
                        className="rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5"
                        aria-label={`Remove ${getSortLabel(opt)} sort`}
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
            )}
        </div>

        {/* Courses Grid */}
        {groupedCourses.size > 0 ? (
          <div className="space-y-8">
            {Array.from(groupedCourses.entries()).map(([year, coursesInYear]) => (
              <div key={year} className="animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="h-6 w-6 text-primary/80" />
                  <h2 className="text-xl font-bold text-foreground">{year === 'Uncategorized' ? 'Uncategorized' : `Year ${year}`}</h2>
                </div>
                <div className="flex overflow-x-auto gap-6 pb-4 -mx-6 px-6">
                  {coursesInYear.map((course, index) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        onEdit={handleOpenEditDialog}
                        onDelete={handleOpenDeleteDialog}
                        index={index}
                    />
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
              {searchTerm ? 'Try adjusting your search term or year filter' : 'Get started by creating your first course'}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              course "{courses.find(c => c.id === courseToDeleteId)?.name}".
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

      <Dialog open={isImagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="max-w-xl p-0">
           <DialogHeader className="sr-only">
            <DialogTitle>Teacher profile preview</DialogTitle>
          </DialogHeader>
          <Image
            src={previewImageUrl}
            width={800}
            height={800}
            alt="Teacher profile preview"
            className="rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
