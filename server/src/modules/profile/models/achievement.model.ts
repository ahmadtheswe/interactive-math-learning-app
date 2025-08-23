/**
 * Represents an achievement that a user can earn
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  criteria: AchievementCriteria;
  icon: string;
  unlockedAt?: Date;
  isUnlocked: boolean;
}

/**
 * Criteria that must be met to unlock an achievement
 */
export interface AchievementCriteria {
  type: 'streak' | 'xp' | 'lessons' | 'perfectScore';
  threshold: number;
}
