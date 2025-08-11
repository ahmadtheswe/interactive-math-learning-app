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

export interface SubmissionData {
  attemptId: string;
  answers: SubmissionAnswer[];
}

export interface ProblemResult {
  problemId: number;
  isCorrect: boolean;
  xpAwarded: number;
}

export interface SubmissionResult {
  correctAnswers: number;
  totalAnswers: number;
  totalXpAwarded: number;
  xpAwarded: number; // Alias for totalXpAwarded for consistency
  streakCount?: number;
  isNewStreak?: boolean;
  streakBonusXp?: number;
  previousXp?: number;
  newXp?: number;
  improvements?: string[];
  problemResults?: ProblemResult[]; // Properly typed problem results
}

export interface UserProfileStats {
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  lastActivityDate: string | null;
}

export interface ProfileStatsResponse {
  success: true;
  data: UserProfileStats;
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
    lastAttemptAt: string | null;
  };
}

export interface SubmissionResponse {
  success: true;
  data: {
    results: SubmissionResult;
    user: {
      totalXp: number;
      currentStreak: number;
    };
    isNewStreak: boolean;
    streakBonusXp: number;
    previousXp: number;
  };
}

export interface AIHintResponse {
  success: true;
  data: {
    hint: string;
    problemQuestion?: string;
  };
}

export interface APIErrorResponse {
  success: false;
  error: string;
}
