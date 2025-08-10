import { prisma } from "../../db";
import { UserProfileStats, UserProfile } from "./types";
import { ProfileMapper } from "./mapper";

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

      // Use mapper to transform data
      return ProfileMapper.toUserProfileStats(
        user,
        userProgresses,
        totalLessons
      );
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw new Error("Failed to fetch user statistics");
    }
  }

  static async getUserById(userId: number): Promise<UserProfile | null> {
    try {
      const user = await prisma.user.findUnique({
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

      return user ? ProfileMapper.toUserProfile(user) : null;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Failed to fetch user");
    }
  }
}
