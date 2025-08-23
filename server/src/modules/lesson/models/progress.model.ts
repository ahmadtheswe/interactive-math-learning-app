// Progress interfaces

export interface UserProgress {
  problemsCompleted: number;
  totalProblems: number;
  progressPercent: number;
  completed: boolean;
  lastAttemptAt: Date | null;
}

export interface UpdateProgressRequest {
  problemsCompleted: number;
}
