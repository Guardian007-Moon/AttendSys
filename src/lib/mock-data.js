
export const initialCourses = [
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

export const courseStudents = {
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

// DEPRECATED: We no longer use a global variable.
// We will remove this in a future step to avoid breaking other parts of the app immediately.
export let sessionAttendance = loadAttendance();

// We need to update the checkin form to use the new load/save functions.
// This will be done in the next step.
