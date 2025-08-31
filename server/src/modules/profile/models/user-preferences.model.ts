/**
 * User preferences for their profile and learning experience
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  soundEffectsEnabled: boolean;
  language: string;
  difficultySetting: 'easy' | 'medium' | 'hard' | 'adaptive';
}
