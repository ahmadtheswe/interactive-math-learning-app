/**
 * Represents a user's profile statistics including experience points, streaks, and progress
 */
export interface UserProfileStats {
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  lastActivityDate: Date | null;
}
