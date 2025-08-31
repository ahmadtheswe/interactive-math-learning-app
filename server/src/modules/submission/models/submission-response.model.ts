// Submission API response model
import { ProgressStats } from './progress-stats.model';
import { ProblemResult } from './submission-result.model';
import { UserStats } from './user-stats.model';

export interface SubmissionResponseData {
  attemptId: string;
  results: {
    correctAnswers: number;
    totalAnswers: number;
    xpAwarded: number;
    problemResults?: ProblemResult[];
  };
  user: UserStats;
  progress: ProgressStats;
  isResubmission: boolean;
  streakBonusXp: number;
  previousXp: number;
  isNewStreak: boolean;
}
