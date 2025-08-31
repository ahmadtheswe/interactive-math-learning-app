// Submission result types
import { ProgressStats } from './progress-stats.model';
import { UserStats } from './user-stats.model';

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
