import {
  UserProfileStats,
  UserProfile,
  ProfileUserFromDatabase,
  UserProfileFromDatabase,
  ProfileUserProgressFromDatabase,
} from '../models';

export class ProfileMapper {
  /**
   * Maps raw user and progress data to UserProfileStats
   */
  static toUserProfileStats(
    user: ProfileUserFromDatabase,
    userProgresses: ProfileUserProgressFromDatabase[],
    totalLessons: number
  ): UserProfileStats {
    // Calculate statistics
    const completedLessons = userProgresses.filter((progress) => progress.completed).length;

    // Calculate overall progress percentage
    let overallProgressPercentage = 0;
    if (userProgresses.length > 0) {
      const totalProgress = userProgresses.reduce(
        (sum: number, progress) => sum + Number(progress.progressPercent),
        0
      );
      overallProgressPercentage = Math.round(totalProgress / userProgresses.length);
    }

    return {
      totalXp: user.totalXp,
      currentStreak: user.currentStreak,
      bestStreak: user.bestStreak,
      progressPercentage: overallProgressPercentage,
      completedLessons,
      totalLessons,
      lastActivityDate: user.lastActivityDate,
    };
  }

  /**
   * Maps raw user data to UserProfile (no additional transformation needed)
   */
  static toUserProfile(user: UserProfileFromDatabase): UserProfile {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      totalXp: user.totalXp,
      currentStreak: user.currentStreak,
      bestStreak: user.bestStreak,
      lastActivityDate: user.lastActivityDate,
      createdAt: user.createdAt,
    };
  }

  /**
   * Calculates overall progress percentage from user progresses
   */
  static calculateOverallProgressPercentage(
    userProgresses: ProfileUserProgressFromDatabase[]
  ): number {
    if (userProgresses.length === 0) return 0;

    const totalProgress = userProgresses.reduce(
      (sum: number, progress) => sum + Number(progress.progressPercent),
      0
    );
    return Math.round(totalProgress / userProgresses.length);
  }

  /**
   * Counts completed lessons from user progresses
   */
  static countCompletedLessons(userProgresses: ProfileUserProgressFromDatabase[]): number {
    return userProgresses.filter((progress) => progress.completed).length;
  }
}
