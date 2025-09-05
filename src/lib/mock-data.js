
export const initialCourses = [
  {
    id: 'CS101',
    name: 'Introduction to Computer Science',
    description: 'Learn the fundamentals of programming and computer science.',
    year: '1',
    bannerUrl: 'https://picsum.photos/seed/CS101/600/200',
    schedule: 'Mon/Wed/Fri 10:00-11:00',
    code: 'CS101',
  },
  {
    id: 'PHY201',
    name: 'University Physics I',
    description: 'Explore classical mechanics and thermodynamics.',
    year: '2',
    bannerUrl: 'https://picsum.photos/seed/PHY201/600/200',
    schedule: 'Tue/Thu 13:00-14:30',
    code: 'PHY201',
  },
  {
    id: 'ENG303',
    name: 'Shakespearean Literature',
    description: 'A deep dive into the works of William Shakespeare.',
    year: '3',
    bannerUrl: 'https://picsum.photos/seed/ENG303/600/200',
    schedule: 'Mon/Wed 15:00-16:30',
    code: 'ENG303',
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
