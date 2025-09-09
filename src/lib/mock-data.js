

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
  {
    id: 'HIS101',
    name: 'World History: Ancient Civilizations',
    description: 'Survey of major world civilizations from prehistory to 500 CE.',
    year: '1',
    bannerUrl: 'https://picsum.photos/seed/HIS101/600/200',
    schedule: 'Tue/Thu 9:00-10:30',
    code: 'HIS101',
  },
  {
    id: 'MTH210',
    name: 'Calculus I',
    description: 'An introduction to differential calculus.',
    year: '2',
    bannerUrl: 'https://picsum.photos/seed/MTH210/600/200',
    schedule: 'Mon/Wed/Fri 11:00-12:00',
    code: 'MTH210',
  },
  {
    id: 'CHM350',
    name: 'Organic Chemistry',
    description: 'Fundamental concepts of organic chemistry, including structure, bonding, and reactivity.',
    year: '3',
    bannerUrl: 'https://picsum.photos/seed/CHM350/600/200',
    schedule: 'Tue/Thu 14:00-15:30',
    code: 'CHM350',
  },
  {
    id: 'ADS401',
    name: 'Applied Data Science',
    description: 'A practical approach to data science with real-world case studies.',
    year: '4',
    bannerUrl: 'https://picsum.photos/seed/ADS401/600/200',
    schedule: 'Tue/Thu 10:00-11:30',
    code: 'ADS401',
  },
];

export const initialCourseStudents = {
  CS101: [
    { id: 'S001', name: 'Amelia Harris', status: 'Absent', sex: 'Female' },
    { id: 'S002', name: 'Benjamin Carter', status: 'Absent', sex: 'Male' },
    { id: 'S003', name: 'Charlotte Davis', status: 'Absent', sex: 'Female' },
    { id: 'S004', name: 'Daniel Evans', status: 'Absent', sex: 'Male' },
    { id: 'S005', name: 'Emily Garcia', status: 'Absent', sex: 'Female' },
  ],
  PHY201: [
    { id: 'S006', name: 'Finn Miller', status: 'Absent', sex: 'Male' },
    { id: 'S007', name: 'Grace Rodriguez', status: 'Absent', sex: 'Female' },
    { id: 'S008', name: 'Henry Wilson', status: 'Absent', sex: 'Male' },
    { id: 'S009', name: 'Isabella Moore', status: 'Absent', sex: 'Female' },
    { id: 'S010', name: 'Jack Taylor', status: 'Absent', sex: 'Male' },
  ],
  ENG303: [
    { id: 'S001', name: 'Amelia Harris', status: 'Absent', sex: 'Female' },
    { id: 'S003', name: 'Charlotte Davis', status: 'Absent', sex: 'Female' },
    { id: 'S007', name: 'Grace Rodriguez', status: 'Absent', sex: 'Female' },
    { id: 'S010', name: 'Jack Taylor', status: 'Absent', sex: 'Male' },
  ],
  HIS101: [
    { id: 'S011', name: 'Liam Johnson', status: 'Absent', sex: 'Male' },
    { id: 'S012', name: 'Olivia Williams', status: 'Absent', sex: 'Female' },
    { id: 'S013', name: 'Noah Brown', status: 'Absent', sex: 'Male' },
    { id: 'S014', name: 'Emma Jones', status: 'Absent', sex: 'Female' },
    { id: 'S015', name: 'Oliver Garcia', status: 'Absent', sex: 'Male' },
  ],
  MTH210: [
    { id: 'S002', name: 'Benjamin Carter', status: 'Absent', sex: 'Male' },
    { id: 'S005', name: 'Emily Garcia', status: 'Absent', sex: 'Female' },
    { id: 'S006', name: 'Finn Miller', status: 'Absent', sex: 'Male' },
    { id: 'S009', name: 'Isabella Moore', status: 'Absent', sex: 'Female' },
  ],
  CHM350: [
    { id: 'S016', name: 'Sophia Smith', status: 'Absent', sex: 'Female' },
    { id: 'S017', name: 'Mason Davis', status: 'Absent', sex: 'Male' },
    { id: 'S018', name: 'Harper Rodriguez', status: 'Absent', sex: 'Female' },
    { id: 'S019', name: 'Evelyn Martinez', status: 'Absent', sex: 'Female' },
    { id: 'S020', name: 'Logan Hernandez', status: 'Absent', sex: 'Male' },
  ],
  ADS401: [
    { id: 'S021', name: 'Mia Anderson', status: 'Absent', sex: 'Female' },
    { id: 'S022', name: 'James Thomas', status: 'Absent', sex: 'Male' },
    { id: 'S023', name: 'Evelyn White', status: 'Absent', sex: 'Female' },
    { id: 'S024', name: 'Lucas Martin', status: 'Absent', sex: 'Male' },
    { id: 'S025', name: 'Chloe Thompson', status: 'Absent', sex: 'Female' },
  ]
};

const ATTENDANCE_STORAGE_KEY = 'sessionAttendance';
const SESSIONS_STORAGE_PREFIX = 'sessions_';

// Helper to get a date in the past
const getDateInPast = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
};

export const initialSessions = {
    ADS401: [
        { id: 'SESS_ADS01', name: 'Week 1: Introduction', date: getDateInPast(21), startTime: '10:00', endTime: '11:30', checkinTimeLimit: 15, maxDistance: 100 },
        { id: 'SESS_ADS02', name: 'Week 2: Data Wrangling', date: getDateInPast(14), startTime: '10:00', endTime: '11:30', checkinTimeLimit: 15, maxDistance: 100 },
        { id: 'SESS_ADS03', name: 'Week 3: Visualization', date: getDateInPast(7), startTime: '10:00', endTime: '11:30', checkinTimeLimit: 15, maxDistance: 100 },
        { id: 'SESS_ADS04', name: 'Week 4: Mid-term Review', date: getDateInPast(1), startTime: '10:00', endTime: '11:30', checkinTimeLimit: 15, maxDistance: 100 },
    ]
};

export const initialAttendance = {
    SESS_ADS01: {
        S021: { status: 'Present', time: '10:02:15 AM', distance: 15 },
        S022: { status: 'Present', time: '10:05:30 AM', distance: 25 },
        S023: { status: 'Late', time: '10:17:00 AM', distance: 10 },
        S024: { status: 'Present', time: '10:01:05 AM', distance: 30 },
        S025: { status: 'Absent' },
    },
    SESS_ADS02: {
        S021: { status: 'Present', time: '10:01:10 AM', distance: 18 },
        S022: { status: 'Present', time: '10:03:20 AM', distance: 22 },
        S023: { status: 'Present', time: '10:08:45 AM', distance: 12 },
        S024: { status: 'Late', time: '10:20:00 AM', distance: 35 },
        S025: { status: 'Present', time: '10:04:55 AM', distance: 14 },
    },
    SESS_ADS03: {
        S021: { status: 'Present', time: '09:59:50 AM', distance: 16 },
        S022: { status: 'Absent' },
        S023: { status: 'Present', time: '10:03:30 AM', distance: 11 },
        S024: { status: 'Present', time: '10:06:15 AM', distance: 33 },
        S025: { status: 'Present', time: '10:02:40 AM', distance: 19 },
    },
    SESS_ADS04: {
        S021: { status: 'Present', time: '10:00:05 AM', distance: 20 },
        S022: { status: 'Present', time: '10:04:15 AM', distance: 21 },
        S023: { status: 'Late', time: '10:16:30 AM', distance: 9 },
        S024: { status: 'Late', time: '10:18:00 AM', distance: 40 },
        S025: { status: 'Present', time: '10:05:00 AM', distance: 15 },
    }
};

// This is now the single source of truth for loading from localStorage
export const loadAttendance = () => {
    if (typeof window === 'undefined') {
        return {};
    }
    const storedAttendance = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    // If no attendance data is found, seed it with the initial example data
    if (!storedAttendance) {
        saveAttendance(initialAttendance);
        return initialAttendance;
    }
    return JSON.parse(storedAttendance);
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
    // If no sessions are stored for this course, seed them with initial data
    if (!storedSessions && initialSessions[courseId]) {
        localStorage.setItem(`sessions_${courseId}`, JSON.stringify(initialSessions[courseId]));
        return initialSessions[courseId].find(s => s.id === sessionId) || null;
    }
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
