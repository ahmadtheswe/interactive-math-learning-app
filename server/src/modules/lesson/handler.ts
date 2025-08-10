import { Request, Response } from 'express';
import { LessonService } from './service';

export class LessonHandler {
  static async getLessons(req: Request, res: Response): Promise<void> {
    try {
      // Get userId from header, default to 1 if not provided
      const userIdHeader = req.headers['userid'] || req.headers['x-user-id'] || '1';
      const userId = parseInt(userIdHeader as string);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID in header'
        });
        return;
      }

      const lessonsWithProgress = await LessonService.getLessonsWithProgress(userId);

      res.json({
        success: true,
        data: {
          lessons: lessonsWithProgress,
          userId: userId
        }
      });
    } catch (error) {
      console.error('Lessons API Error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getLessonById(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const userIdHeader = req.headers['userid'] || req.headers['x-user-id'] || '1';
      const userId = parseInt(userIdHeader as string);

      if (isNaN(lessonId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid lesson ID'
        });
        return;
      }

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID in header'
        });
        return;
      }

      const lesson = await LessonService.getLessonById(lessonId, userId);

      if (!lesson) {
        res.status(404).json({
          success: false,
          error: 'Lesson not found'
        });
        return;
      }

      res.json({
        success: true,
        data: lesson
      });
    } catch (error) {
      console.error('Lesson by ID API Error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async updateProgress(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const userIdHeader = req.headers['userid'] || req.headers['x-user-id'] || '1';
      const userId = parseInt(userIdHeader as string);
      const { problemsCompleted } = req.body;

      if (isNaN(lessonId) || isNaN(userId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid lesson ID or user ID'
        });
        return;
      }

      if (typeof problemsCompleted !== 'number' || problemsCompleted < 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid problemsCompleted value'
        });
        return;
      }

      const updatedProgress = await LessonService.updateUserProgress(userId, lessonId, problemsCompleted);

      res.json({
        success: true,
        data: {
          id: updatedProgress.id,
          userId: updatedProgress.userId,
          lessonId: updatedProgress.lessonId,
          problemsCompleted: updatedProgress.problemsCompleted,
          totalProblems: updatedProgress.totalProblems,
          progressPercent: Number(updatedProgress.progressPercent),
          completed: updatedProgress.completed,
          lastAttemptAt: updatedProgress.lastAttemptAt
        }
      });
    } catch (error) {
      console.error('Update Progress API Error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
