/**
 * Database-specific types for profile data
 */

/**
 * Core user profile data from database queries
 */
export interface ProfileUserFromDatabase {
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: Date | null;
}

/**
 * Complete user profile data from database queries
 */
export interface UserProfileFromDatabase {
  id: number;
  name: string;
  email: string | null;
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: Date | null;
  createdAt: Date;
}

/**
 * Progress information from database queries
 */
export interface ProfileUserProgressFromDatabase {
  completed: boolean;
  progressPercent: number | { toNumber(): number };
}
