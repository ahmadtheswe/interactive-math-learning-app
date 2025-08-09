import { Request, Response } from 'express';
import { ProfileService } from './service';

export class ProfileHandler {
  static async getProfile(req: Request, res: Response) {
    try {
      // For now, we'll use a hardcoded user ID. 
      // In a real app, you'd get this from authentication middleware
      const userId = req.params.userId ? parseInt(req.params.userId) : 1;

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid user ID'
        });
      }

      const userStats = await ProfileService.getUserStats(userId);

      if (!userStats) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          totalXp: userStats.totalXp,
          currentStreak: userStats.currentStreak,
          bestStreak: userStats.bestStreak,
          progressPercentage: userStats.progressPercentage,
          completedLessons: userStats.completedLessons,
          totalLessons: userStats.totalLessons,
          lastActivityDate: userStats.lastActivityDate
        }
      });
    } catch (error) {
      console.error('Profile API Error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getUserProfile(req: Request, res: Response) {
    try {
      const userId = req.params.userId ? parseInt(req.params.userId) : 1;

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid user ID'
        });
      }

      const user = await ProfileService.getUserById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('User Profile API Error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
