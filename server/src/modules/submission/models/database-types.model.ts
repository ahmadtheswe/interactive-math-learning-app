// Database query result types

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
