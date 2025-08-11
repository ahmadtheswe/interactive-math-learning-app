// Submission Module Types

export interface SubmissionAnswer {
  problemId: number;
  answer: string;
}

export interface SubmissionRequest {
  attemptId: string;
  answers: SubmissionAnswer[];
}

export interface UserStats {
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
}

export interface ProgressStats {
  problemsCompleted: number;
  totalProblems: number;
  progressPercent: number;
  completed: boolean;
}

export interface ProblemResult {
  problemId: number;
  isCorrect: boolean;
  xpAwarded: number;
}

export interface SubmissionResult {
  attemptId: string;
  totalXpAwarded: number;
  correctAnswers: number;
  totalAnswers: number;
  user: UserStats;
  progress: ProgressStats;
  isResubmission: boolean;
  streakBonusXp?: number;
  previousXp?: number;
  isNewStreak?: boolean;
  problemResults?: ProblemResult[]; // Add detailed problem results
}

export interface SubmissionResults {
  correctAnswers: number;
  totalAnswers: number;
  xpAwarded: number;
}

export interface SubmissionProblemReference {
  id: number;
}

export interface SubmissionUserReference {
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
}

export interface SubmissionLessonReference {
  problems: SubmissionProblemReference[];
}

// Database query result types
export interface ExistingSubmissionFromDatabase {
  user: SubmissionUserReference;
  lesson: SubmissionLessonReference;
}

export interface SubmissionUserProgressFromDatabase {
  problemsCompleted: number;
  totalProblems: number;
  progressPercent: number | { toNumber(): number };
  completed: boolean;
}

export interface UpdatedUserFromDatabase {
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
}

export interface SubmissionUserFromDatabase {
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: Date | null;
}

export interface SubmissionProblemOptionReference {
  optionText: string;
  isCorrect: boolean;
}

export interface SubmissionProblemFromDatabase {
  type: string;
  correctAnswer: string;
  options: SubmissionProblemOptionReference[];
}

// API Response Types
export interface SubmissionResponse {
  success: true;
  data: {
    attemptId: string;
    results: SubmissionResults;
    user: UserStats;
    progress: ProgressStats;
    isResubmission: boolean;
  };
}

// Internal Types
export interface SubmissionData {
  attemptId: string;
  userId: number;
  lessonId: number;
  problemId: number;
  userAnswer: string;
  isCorrect: boolean;
  xpAwarded: number;
}

export interface StreakCalculation {
  newStreak: number;
  bestStreak: number;
}
