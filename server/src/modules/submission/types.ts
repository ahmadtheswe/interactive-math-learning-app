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

export interface SubmissionResult {
  attemptId: string;
  totalXpAwarded: number;
  correctAnswers: number;
  totalAnswers: number;
  user: UserStats;
  progress: ProgressStats;
  isResubmission: boolean;
}

export interface SubmissionResults {
  correctAnswers: number;
  totalAnswers: number;
  xpAwarded: number;
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
