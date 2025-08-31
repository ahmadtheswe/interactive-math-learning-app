// User statistics types

export interface UserStats {
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
}

export interface StreakCalculation {
  newStreak: number;
  bestStreak: number;
}
