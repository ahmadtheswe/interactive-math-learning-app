// Lesson Module Types

export interface LessonWithProgress {
  id: number;
  title: string;
  description: string | null;
  orderIndex: number;
  createdAt: Date;
  totalProblems: number;
  completedProblems: number;
  progressPercent: number;
  completed: boolean;
  lastAttemptAt: Date | null;
}

export interface ProblemOption {
  id: number;
  problemId: number;
  optionText: string;
}

export interface Problem {
  id: number;
  lessonId: number;
  type: string;
  question: string;
  correctAnswer?: string;
  xpValue: number;
  orderIndex: number;
  options?: ProblemOption[];
}

export interface UserProgress {
  problemsCompleted: number;
  totalProblems: number;
  progressPercent: number;
  completed: boolean;
  lastAttemptAt: Date | null;
}

export interface LessonWithDetails {
  id: number;
  title: string;
  description: string | null;
  orderIndex: number;
  createdAt: Date;
  problems: Problem[];
  userProgress: UserProgress;
}

export interface LessonProblemReference {
  id: number;
}

// Database query result types
export interface LessonFromDatabase {
  id: number;
  title: string;
  description: string | null;
  orderIndex: number;
  createdAt: Date;
  problems: LessonProblemReference[];
  progresses: LessonUserProgressFromDatabase[];
}

export interface LessonUserProgressFromDatabase {
  problemsCompleted: number;
  totalProblems: number;
  progressPercent: number | { toNumber(): number };
  completed: boolean;
  lastAttemptAt: Date | null;
}

export interface LessonWithProblemsFromDatabase {
  id: number;
  title: string;
  description: string | null;
  orderIndex: number;
  createdAt: Date;
  problems: LessonProblemFromDatabase[];
  progresses: LessonUserProgressFromDatabase[];
}

export interface LessonProblemFromDatabase {
  id: number;
  lessonId: number;
  type: string;
  question: string;
  xpValue: number;
  orderIndex: number;
  options?: LessonProblemOptionFromDatabase[];
}

export interface LessonProblemOptionFromDatabase {
  id: number;
  problemId: number;
  optionText: string;
}

export interface UserProgressUpdateResult {
  id: number;
  userId: number;
  lessonId: number;
  problemsCompleted: number;
  totalProblems: number;
  progressPercent: number | { toNumber(): number };
  completed: boolean;
  lastAttemptAt: Date | null;
}

// Request Types
export interface UpdateProgressRequest {
  problemsCompleted: number;
}

// API Response Types
export interface LessonsResponse {
  success: true;
  data: {
    lessons: LessonWithProgress[];
    userId: number;
  };
}

export interface LessonDetailResponse {
  success: true;
  data: LessonWithDetails;
}

export interface UpdateProgressResponse {
  success: true;
  data: {
    id: number;
    userId: number;
    lessonId: number;
    problemsCompleted: number;
    totalProblems: number;
    progressPercent: number;
    completed: boolean;
    lastAttemptAt: Date | null;
  };
}
