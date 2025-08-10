// Types for the frontend application

export interface Lesson {
  id: number;
  title: string;
  description: string | null;
  orderIndex: number;
  createdAt: string;
  totalProblems: number;
  completedProblems: number;
  progressPercent: number;
  completed: boolean;
  lastAttemptAt: string | null;
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
  lastAttemptAt: string | null;
}

export interface LessonWithDetails {
  id: number;
  title: string;
  description: string | null;
  orderIndex: number;
  createdAt: string;
  problems: Problem[];
  userProgress: UserProgress;
}

export interface LessonsResponse {
  success: true;
  data: {
    lessons: Lesson[];
    userId: number;
  };
}

export interface LessonDetailResponse {
  success: true;
  data: LessonWithDetails;
}

export interface SubmissionAnswer {
  problemId: number;
  answer: string;
}

export interface SubmissionRequest {
  attemptId: string;
  answers: SubmissionAnswer[];
}

export interface SubmissionResult {
  correctAnswers: number;
  totalAnswers: number;
  totalXpAwarded: number;
  streakCount?: number;
  isNewStreak?: boolean;
  streakBonusXp?: number;
  previousXp?: number;
  newXp?: number;
  improvements?: string[];
  results?: any; // For backward compatibility
}
