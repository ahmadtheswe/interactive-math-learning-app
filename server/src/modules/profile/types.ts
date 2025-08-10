// Profile Module Types

export interface UserProfileStats {
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  lastActivityDate: Date | null;
}

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

// Database query result types
export interface ProfileUserFromDatabase {
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: Date | null;
}

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

export interface ProfileUserProgressFromDatabase {
  completed: boolean;
  progressPercent: number | { toNumber(): number };
}

// API Response Types
export interface ProfileStatsResponse {
  success: true;
  data: {
    totalXp: number;
    currentStreak: number;
    bestStreak: number;
    progressPercentage: number;
    completedLessons: number;
    totalLessons: number;
    lastActivityDate: Date | null;
  };
}

export interface UserProfileResponse {
  success: true;
  data: UserProfile;
}
