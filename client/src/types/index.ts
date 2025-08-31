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

export interface LessonsResponse
  extends ApiResponse<{
    lessons: Lesson[];
    userId: number;
  }> {
  readonly _type?: 'LessonsResponse';
}

export interface LessonDetailResponse extends ApiResponse<LessonWithDetails> {
  readonly _type?: 'LessonDetailResponse';
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

export interface ProfileStatsResponse extends ApiResponse<UserProfileStats> {
  readonly _type?: 'ProfileStatsResponse';
}

export interface UpdateProgressResponse
  extends ApiResponse<{
    id: number;
    userId: number;
    lessonId: number;
    problemsCompleted: number;
    totalProblems: number;
    progressPercent: number;
    completed: boolean;
    lastAttemptAt: string | null;
  }> {
  readonly _type?: 'UpdateProgressResponse';
}

export interface SubmissionResponse
  extends ApiResponse<{
    attemptId: string;
    results: {
      correctAnswers: number;
      totalAnswers: number;
      xpAwarded: number;
      problemResults?: ProblemResult[];
    };
    user: {
      totalXp: number;
      currentStreak: number;
      bestStreak: number;
    };
    progress: {
      problemsCompleted: number;
      totalProblems: number;
      progressPercent: number;
      completed: boolean;
    };
    isResubmission: boolean;
    streakBonusXp: number;
    previousXp: number;
    isNewStreak: boolean;
  }> {
  readonly _type?: 'SubmissionResponse';
}

export interface AIHintResponse
  extends ApiResponse<{
    hint: string;
    problemQuestion?: string;
  }> {
  readonly _type?: 'AIHintResponse';
}

// Generic API response type that can be either success or error
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface APIErrorResponse {
  success: false;
  error: string;
  message?: string;
}
