import { PrismaClient } from '../../../generated/prisma';
import { UserProfileStats, UserProfile } from './types';

const prisma = new PrismaClient();

export class ProfileService {
  static async getUserStats(userId: number): Promise<UserProfileStats | null> {
    try {
      // Get user basic stats
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          totalXp: true,
          currentStreak: true,
          bestStreak: true,
          lastActivityDate: true,
        },
      });

      if (!user) {
        return null;
      }

      // Get user progress data
      const userProgresses = await prisma.userProgress.findMany({
        where: { userId },
        select: {
          completed: true,
          progressPercent: true,
        },
      });

      // Get total lessons count
      const totalLessons = await prisma.lesson.count();

      // Calculate statistics
      const completedLessons = userProgresses.filter((progress: any) => progress.completed).length;
      
      // Calculate overall progress percentage
      let overallProgressPercentage = 0;
      if (userProgresses.length > 0) {
        const totalProgress = userProgresses.reduce(
          (sum: number, progress: any) => sum + Number(progress.progressPercent), 
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
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw new Error('Failed to fetch user statistics');
    }
  }

  static async getUserById(userId: number): Promise<UserProfile | null> {
    try {
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          totalXp: true,
          currentStreak: true,
          bestStreak: true,
          lastActivityDate: true,
          createdAt: true,
        },
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }
}
