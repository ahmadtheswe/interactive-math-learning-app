import { Request, Response } from 'express';
import { LessonService } from './service';

export class LessonHandler {
  static async getLessons(req: Request, res: Response) {
    try {
      // Get userId from header, default to 1 if not provided
      const userIdHeader = req.headers['userid'] || req.headers['x-user-id'] || '1';
      const userId = parseInt(userIdHeader as string);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid user ID in header'
        });
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

  static async getLessonById(req: Request, res: Response) {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const userIdHeader = req.headers['userid'] || req.headers['x-user-id'] || '1';
      const userId = parseInt(userIdHeader as string);

      if (isNaN(lessonId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid lesson ID'
        });
      }

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid user ID in header'
        });
      }

      const lesson = await LessonService.getLessonById(lessonId, userId);

      if (!lesson) {
        return res.status(404).json({
          success: false,
          error: 'Lesson not found'
        });
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

  static async updateProgress(req: Request, res: Response) {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const userIdHeader = req.headers['userid'] || req.headers['x-user-id'] || '1';
      const userId = parseInt(userIdHeader as string);
      const { problemsCompleted } = req.body;

      if (isNaN(lessonId) || isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid lesson ID or user ID'
        });
      }

      if (typeof problemsCompleted !== 'number' || problemsCompleted < 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid problemsCompleted value'
        });
      }

      const updatedProgress = await LessonService.updateUserProgress(userId, lessonId, problemsCompleted);

      res.json({
        success: true,
        data: updatedProgress
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
