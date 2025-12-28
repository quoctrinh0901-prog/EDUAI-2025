
export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  phone: string;
  province: string;
  role: UserRole;
  name: string; 
  password?: string;
  status: 'active' | 'pending' | 'banned'; // Added 'banned' status
  
  // Student specific
  grade?: string;
  classId?: string; // Class name like "9A1"

  // Teacher specific
  school?: string; // Trường công tác
  homeroomClass?: string; // Lớp chủ nhiệm
}

export enum Subject {
  MATH = 'Toán',
  LIT = 'Ngữ Văn',
  ENG = 'Tiếng Anh',
  NAT_SCI = 'KHTN',
  HIS_GEO = 'L.Sử & Đ.Lí',
  IT = 'Tin học',
  TECH = 'Công Nghệ',
  CIVIC = 'GDCD',
  LOCAL = 'GDĐP'
}

export interface ScoreRecord {
  studentId: string;
  subject: Subject;
  regular: number | null;
  midTerm1: number | null;
  finalTerm1: number | null;
  midTerm2: number | null;
  finalTerm2: number | null;
  comment: string;
}

export interface Homework {
  id: string;
  teacherId: string;
  targetType: 'CLASS' | 'STUDENT';
  targetId: string; // Grade (e.g., "Khối 6") or Student ID
  title: string;
  content: string;
  subject: string;
  deadline?: string;
  topic?: string;
  createdAt: string;
}

export interface StudentSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  answer: string;
  submittedAt: string;
  aiFeedback?: string; // AI grading result
  aiScore?: number;
  teacherScore?: number; // Teacher override
  teacherComment?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  senderName: string;
  role: UserRole; // Who sent it
  createdAt: string;
  target: 'ALL' | 'TEACHER' | 'STUDENT';
}

export interface PracticeResult {
  id: string;
  studentId: string;
  subject: string;
  topic: string;
  score: number;
  createdAt: string;
  type: 'AI_PRACTICE';
}
