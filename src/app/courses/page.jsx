'use client';
import { useState, useEffect } from 'react';
import { Book, Clock, Users, Star, Search, Filter, ChevronRight } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch courses
    const fetchCourses = () => {
      setTimeout(() => {
        const mockCourses = [
          {
            id: 1,
            title: 'Mathematics 101',
            instructor: 'Dr. Sarah Johnson',
            description: 'Introduction to basic mathematical concepts and problem-solving techniques.',
            category: 'math',
            students: 125,
            duration: '10 weeks',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 2,
            title: 'Literature & Composition',
            instructor: 'Prof. Michael Chen',
            description: 'Explore classic literature and improve your writing skills through analysis and practice.',
            category: 'english',
            students: 89,
            duration: '12 weeks',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 3,
            title: 'Introduction to Physics',
            instructor: 'Dr. Amanda Rodriguez',
            description: 'Discover the fundamental laws that govern the physical world around us.',
            category: 'science',
            students: 142,
            duration: '14 weeks',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 4,
            title: 'World History',
            instructor: 'Prof. James Wilson',
            description: 'Journey through the major events and civilizations that shaped our world.',
            category: 'history',
            students: 78,
            duration: '15 weeks',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 5,
            title: 'Digital Arts',
            instructor: 'Ms. Emily Parker',
            description: 'Learn digital illustration, design principles, and creative expression.',
            category: 'arts',
            students: 95,
            duration: '8 weeks',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 6,
            title: 'Advanced Calculus',
            instructor: 'Dr. Robert Kim',
            description: 'Dive deep into advanced mathematical concepts and applications.',
            category: 'math',
            students: 63,
            duration: '16 weeks',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
          }
        ];
        setCourses(mockCourses);
        setFilteredCourses(mockCourses);
        setLoading(false);
      }, 1000);
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let results = courses;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(course => course.category === selectedCategory);
    }
    
    setFilteredCourses(results);
  }, [searchTerm, selectedCategory, courses]);

  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'english', name: 'English' },
    { id: 'history', name: 'History' },
    { id: 'arts', name: 'Arts' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Courses</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Manage and track all your courses in one place. Stay organized with our intuitive course management system.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, instructors, or topics..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="text-gray-500" />
              <select 
                className="border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                <div className="relative">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {course.category.toUpperCase()}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="flex items-center mr-4">
                      <Users className="mr-1" /> {course.students} students
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-1" /> {course.duration}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={i < Math.floor(course.rating) ? "fill-current" : ""} 
                          />
                        ))}
                      </div>
                      <span className="text-gray-700 font-semibold">{course.rating}</span>
                    </div>
                    
                    <button className="flex items-center text-primary font-semibold hover:text-primary-dark transition-colors">
                      View Details <ChevronRight className="ml-1" />
                    </button>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-white">
                      {course.instructor.split(' ').map(name => name[0]).join('')}
                    </div>
                    <span className="ml-2 text-sm text-gray-700">{course.instructor}</span>
                  </div>
                  <Book className="text-gray-400" />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Book className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No courses found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
