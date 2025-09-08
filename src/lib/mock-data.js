
export const initialCourses = [
  {
    id: 'CS101',
    name: 'Introduction to Computer Science',
    description: 'Learn the fundamentals of programming and computer science.',
    year: '1',
    bannerUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600&auto=format&fit=crop',
    schedule: 'Mon/Wed/Fri 10:00-11:00',
    code: 'CS101',
  },
  {
    id: 'PHY201',
    name: 'University Physics I',
    description: 'Explore classical mechanics and thermodynamics.',
    year: '2',
    bannerUrl: 'https://images.unsplash.com/photo-1532187863486-abf9db5a90e3?q=80&w=600&auto=format&fit=crop',
    schedule: 'Tue/Thu 13:00-14:30',
    code: 'PHY201',
  },
  {
    id: 'ENG303',
    name: 'Shakespearean Literature',
    description: 'A deep dive into the works of William Shakespeare.',
    year: '3',
    bannerUrl: 'https://images.unsplash.com/photo-1590487995123-918a531e830c?q=80&w=600&auto=format&fit=crop',
    schedule: 'Mon/Wed 15:00-16:30',
    code: 'ENG303',
  },
  {
    id: 'HIS101',
    name: 'World History: Ancient Civilizations',
    description: 'Survey of major world civilizations from prehistory to 500 CE.',
    year: '1',
    bannerUrl: 'https://images.unsplash.com/photo-1583373808469-2f7b4e34ce37?q=80&w=600&auto=format&fit=crop',
    schedule: 'Tue/Thu 9:00-10:30',
    code: 'HIS101',
  },
  {
    id: 'MTH210',
    name: 'Calculus I',
    description: 'An introduction to differential calculus.',
    year: '2',
    bannerUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop',
    schedule: 'Mon/Wed/Fri 11:00-12:00',
    code: 'MTH210',
  },
  {
    id: 'CHM350',
    name: 'Organic Chemistry',
    description: 'Fundamental concepts of organic chemistry, including structure, bonding, and reactivity.',
    year: '3',
    bannerUrl: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?q=80&w=600&auto=format&fit=crop',
    schedule: 'Tue/Thu 14:00-15:30',
    code: 'CHM350',
  },
];

export const initialCourseStudents = {
  CS101: [
    { id: 'S001', name: 'Amelia Harris', status: 'Absent' },
    { id: 'S002', name: 'Benjamin Carter', status: 'Absent' },
    { id: 'S003', name: 'Charlotte Davis', status: 'Absent' },
    { id: 'S004', name: 'Daniel Evans', status: 'Absent' },
    { id: 'S005', name: 'Emily Garcia', status: 'Absent' },
  ],
  PHY201: [
    { id: 'S006', name: 'Finn Miller', status: 'Absent' },
    { id: 'S007', name: 'Grace Rodriguez', status: 'Absent' },
    { id: 'S008', name: 'Henry Wilson', status: 'Absent' },
    { id: 'S009', name: 'Isabella Moore', status: 'Absent' },
    { id: 'S010', name: 'Jack Taylor', status: 'Absent' },
  ],
  ENG303: [
    { id: 'S001', name: 'Amelia Harris', status: 'Absent' },
    { id: 'S003', name: 'Charlotte Davis', status: 'Absent' },
    { id: 'S007', name: 'Grace Rodriguez', status: 'Absent' },
    { id: 'S010', name: 'Jack Taylor', status: 'Absent' },
  ],
  HIS101: [
    { id: 'S011', name: 'Liam Johnson', status: 'Absent' },
    { id: 'S012', name: 'Olivia Williams', status: 'Absent' },
    { id: 'S013', name: 'Noah Brown', status: 'Absent' },
    { id: 'S014', name: 'Emma Jones', status: 'Absent' },
    { id: 'S015', name: 'Oliver Garcia', status: 'Absent' },
  ],
  MTH210: [
    { id: 'S002', name: 'Benjamin Carter', status: 'Absent' },
    { id: 'S005', name: 'Emily Garcia', status: 'Absent' },
    { id: 'S006', name: 'Finn Miller', status: 'Absent' },
    { id: 'S009', name: 'Isabella Moore', status: 'Absent' },
  ],
  CHM350: [
    { id: 'S016', name: 'Sophia Smith', status: 'Absent' },
    { id: 'S017', name: 'Mason Davis', status: 'Absent' },
    { id: 'S018', name: 'Harper Rodriguez', status: 'Absent' },
    { id: 'S019', name: 'Evelyn Martinez', status: 'Absent' },
    { id: 'S020', name: 'Logan Hernandez', status: 'Absent' },
  ],
};

const ATTENDANCE_STORAGE_KEY = 'sessionAttendance';

// This is now the single source of truth for loading from localStorage
export const loadAttendance = () => {
    if (typeof window === 'undefined') {
        return {};
    }
    const storedAttendance = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    return storedAttendance ? JSON.parse(storedAttendance) : {};
};

// This is now the single source of truth for saving to localStorage
export const saveAttendance = (attendanceData) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(attendanceData));
};

export const loadStudentsByCourse = (courseId) => {
    if (typeof window === 'undefined') return initialCourseStudents[courseId] || [];
    const storedStudents = localStorage.getItem(`students_${courseId}`);
    return storedStudents ? JSON.parse(storedStudents) : (initialCourseStudents[courseId] || []);
};

export const loadSession = (courseId, sessionId) => {
    if (typeof window === 'undefined') return null;
    const storedSessions = localStorage.getItem(`sessions_${courseId}`);
    if (!storedSessions) return null;
    const sessions = JSON.parse(storedSessions);
    return sessions.find(s => s.id === sessionId) || null;
}

export const saveSession = (courseId, updatedSession) => {
    if (typeof window === 'undefined') return;
    const storedSessions = localStorage.getItem(`sessions_${courseId}`);
    if (!storedSessions) return;
    let sessions = JSON.parse(storedSessions);
    sessions = sessions.map(s => s.id === updatedSession.id ? updatedSession : s);
    localStorage.setItem(`sessions_${courseId}`, JSON.stringify(sessions));
}
