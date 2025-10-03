// Mock data for the application
export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  year: number;
  gpa: number;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  courses: string[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  faculty: string;
  schedule: string;
  room: string;
  credits: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "academic" | "cultural" | "sports" | "workshop";
}

export interface TimetableSlot {
  day: string;
  time: string;
  subject: string;
  faculty: string;
  room: string;
  type: "lecture" | "lab" | "tutorial";
}

export const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.j@campus.edu",
    studentId: "CS2024001",
    department: "Computer Science",
    year: 3,
    gpa: 3.8,
  },
  {
    id: "2",
    name: "Emma Davis",
    email: "emma.d@campus.edu",
    studentId: "CS2024002",
    department: "Computer Science",
    year: 2,
    gpa: 3.9,
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.c@campus.edu",
    studentId: "EE2024001",
    department: "Electrical Engineering",
    year: 4,
    gpa: 3.7,
  },
];

export const mockFaculty: Faculty[] = [
  {
    id: "1",
    name: "Dr. Sarah Williams",
    email: "sarah.w@campus.edu",
    department: "Computer Science",
    designation: "Professor",
    courses: ["Data Structures", "Algorithms", "Machine Learning"],
  },
  {
    id: "2",
    name: "Prof. James Miller",
    email: "james.m@campus.edu",
    department: "Computer Science",
    designation: "Associate Professor",
    courses: ["Database Systems", "Web Development"],
  },
  {
    id: "3",
    name: "Dr. Lisa Anderson",
    email: "lisa.a@campus.edu",
    department: "Mathematics",
    designation: "Assistant Professor",
    courses: ["Calculus", "Linear Algebra"],
  },
];

export const mockCourses: Course[] = [
  {
    id: "1",
    code: "CS301",
    name: "Data Structures",
    faculty: "Dr. Sarah Williams",
    schedule: "Mon, Wed, Fri 10:00 AM",
    room: "Room 301",
    credits: 4,
  },
  {
    id: "2",
    code: "CS302",
    name: "Database Systems",
    faculty: "Prof. James Miller",
    schedule: "Tue, Thu 2:00 PM",
    room: "Room 205",
    credits: 3,
  },
  {
    id: "3",
    code: "CS303",
    name: "Algorithms",
    faculty: "Dr. Sarah Williams",
    schedule: "Mon, Wed 3:00 PM",
    room: "Room 401",
    credits: 4,
  },
  {
    id: "4",
    code: "CS304",
    name: "Web Development",
    faculty: "Prof. James Miller",
    schedule: "Tue, Thu 10:00 AM",
    room: "Room 302",
    credits: 3,
  },
  {
    id: "5",
    code: "CS305",
    name: "Machine Learning",
    faculty: "Dr. Sarah Williams",
    schedule: "Mon, Wed 2:00 PM",
    room: "Room 403",
    credits: 4,
  },
];

export const mockClasses = mockCourses;

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Fest 2024",
    description:
      "Annual technical festival with coding competitions and workshops",
    date: "2024-03-15",
    time: "9:00 AM",
    location: "Main Auditorium",
    type: "academic",
  },
  {
    id: "2",
    title: "AI Workshop",
    description: "Hands-on workshop on Machine Learning and AI",
    date: "2024-03-20",
    time: "2:00 PM",
    location: "CS Lab 1",
    type: "workshop",
  },
  {
    id: "3",
    title: "Cultural Night",
    description: "Annual cultural celebration with performances",
    date: "2024-03-25",
    time: "6:00 PM",
    location: "Open Air Theatre",
    type: "cultural",
  },
];

export const mockTimetable: TimetableSlot[] = [
  {
    day: "Monday",
    time: "9:00 AM - 10:00 AM",
    subject: "Data Structures",
    faculty: "Dr. Sarah Williams",
    room: "Room 301",
    type: "lecture",
  },
  {
    day: "Monday",
    time: "10:00 AM - 11:00 AM",
    subject: "Database Systems",
    faculty: "Prof. James Miller",
    room: "Room 205",
    type: "lecture",
  },
  {
    day: "Monday",
    time: "2:00 PM - 4:00 PM",
    subject: "Web Development Lab",
    faculty: "Prof. James Miller",
    room: "CS Lab 2",
    type: "lab",
  },
  {
    day: "Tuesday",
    time: "9:00 AM - 10:00 AM",
    subject: "Algorithms",
    faculty: "Dr. Sarah Williams",
    room: "Room 401",
    type: "lecture",
  },
  {
    day: "Tuesday",
    time: "11:00 AM - 12:00 PM",
    subject: "Linear Algebra",
    faculty: "Dr. Lisa Anderson",
    room: "Room 102",
    type: "lecture",
  },
  {
    day: "Wednesday",
    time: "9:00 AM - 10:00 AM",
    subject: "Data Structures",
    faculty: "Dr. Sarah Williams",
    room: "Room 301",
    type: "lecture",
  },
  {
    day: "Wednesday",
    time: "3:00 PM - 5:00 PM",
    subject: "Data Structures Lab",
    faculty: "Dr. Sarah Williams",
    room: "CS Lab 1",
    type: "lab",
  },
  {
    day: "Thursday",
    time: "10:00 AM - 11:00 AM",
    subject: "Database Systems",
    faculty: "Prof. James Miller",
    room: "Room 205",
    type: "lecture",
  },
  {
    day: "Thursday",
    time: "2:00 PM - 3:00 PM",
    subject: "Algorithms Tutorial",
    faculty: "Dr. Sarah Williams",
    room: "Room 401",
    type: "tutorial",
  },
  {
    day: "Friday",
    time: "9:00 AM - 10:00 AM",
    subject: "Data Structures",
    faculty: "Dr. Sarah Williams",
    room: "Room 301",
    type: "lecture",
  },
  {
    day: "Friday",
    time: "11:00 AM - 12:00 PM",
    subject: "Linear Algebra",
    faculty: "Dr. Lisa Anderson",
    room: "Room 102",
    type: "lecture",
  },
];
