/**
 * Represents the user profile information
 */
export interface UserProfile {
  id: number;
  name: string;
  email: string | null;
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: Date | null;
  createdAt: Date;
}
