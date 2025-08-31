import { Request, Response } from 'express';
import { ILessonHandler } from '../interfaces/lesson-handler-interface';
import { ILessonService } from '../interfaces/lesson-service-interface';
import { inject, injectable } from 'tsyringe';
import { ApiResponse } from '../../common/models';
import { LessonWithProgress, LessonWithDetails, UserProgress } from '../models';

@injectable()
export class LessonHandler implements ILessonHandler {
  constructor(@inject('ILessonService') private lessonService: ILessonService) {}

  async getLessons(
    req: Request,
    res: Response
  ): Promise<ApiResponse<{ lessons: LessonWithProgress[]; userId: number }>> {
    try {
      // TODO: Use a more robust user authentication mechanism in production
      // This is just a placeholder for demonstration purposes
      // Get userId from header, default to 1 if not provided
      const userIdHeader = req.headers['userid'] || req.headers['x-user-id'] || '1';
      const userId = parseInt(userIdHeader as string);

      if (isNaN(userId)) {
        const response: ApiResponse<{ lessons: LessonWithProgress[]; userId: number }> = {
          success: false,
          error: 'Invalid user ID in header',
        };
        res.status(400).json(response);
        return response;
      }

      const lessonsWithProgress = await this.lessonService.getLessonsWithProgress(userId);

      const response: ApiResponse<{ lessons: LessonWithProgress[]; userId: number }> = {
        success: true,
        data: {
          lessons: lessonsWithProgress,
          userId: userId,
        },
      };

      res.json(response);
      return response;
    } catch (error) {
      console.error('Lessons API Error:', error);
      const response: ApiResponse<{ lessons: LessonWithProgress[]; userId: number }> = {
        success: false,
        error: 'Internal server error',
      };
      res.status(500).json(response);
      return response;
    }
  }

  async getLessonById(req: Request, res: Response): Promise<ApiResponse<LessonWithDetails>> {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const userIdHeader = req.headers['userid'] || req.headers['x-user-id'] || '1';
      const userId = parseInt(userIdHeader as string);

      if (isNaN(lessonId)) {
        const response: ApiResponse<LessonWithDetails> = {
          success: false,
          error: 'Invalid lesson ID',
        };
        res.status(400).json(response);
        return response;
      }

      if (isNaN(userId)) {
        const response: ApiResponse<LessonWithDetails> = {
          success: false,
          error: 'Invalid user ID in header',
        };
        res.status(400).json(response);
        return response;
      }

      const lesson = await this.lessonService.getLessonById(lessonId, userId);

      if (!lesson) {
        const response: ApiResponse<LessonWithDetails> = {
          success: false,
          error: 'Lesson not found',
        };
        res.status(404).json(response);
        return response;
      }

      const response: ApiResponse<LessonWithDetails> = {
        success: true,
        data: lesson,
      };

      res.json(response);
      return response;
    } catch (error) {
      console.error('Lesson by ID API Error:', error);
      const response: ApiResponse<LessonWithDetails> = {
        success: false,
        error: 'Internal server error',
      };
      res.status(500).json(response);
      return response;
    }
  }

  async updateProgress(
    req: Request,
    res: Response
  ): Promise<ApiResponse<UserProgress & { id: number; userId: number; lessonId: number }>> {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const userIdHeader = req.headers['userid'] || req.headers['x-user-id'] || '1';
      const userId = parseInt(userIdHeader as string);
      const { problemsCompleted } = req.body;

      if (isNaN(lessonId) || isNaN(userId)) {
        const response: ApiResponse<
          UserProgress & { id: number; userId: number; lessonId: number }
        > = {
          success: false,
          error: 'Invalid lesson ID or user ID',
        };
        res.status(400).json(response);
        return response;
      }

      if (typeof problemsCompleted !== 'number' || problemsCompleted < 0) {
        const response: ApiResponse<
          UserProgress & { id: number; userId: number; lessonId: number }
        > = {
          success: false,
          error: 'Invalid problemsCompleted value',
        };
        res.status(400).json(response);
        return response;
      }

      const updatedProgress = await this.lessonService.updateUserProgress(
        userId,
        lessonId,
        problemsCompleted
      );

      const response: ApiResponse<UserProgress & { id: number; userId: number; lessonId: number }> =
        {
          success: true,
          data: {
            id: updatedProgress.id,
            userId: updatedProgress.userId,
            lessonId: updatedProgress.lessonId,
            problemsCompleted: updatedProgress.problemsCompleted,
            totalProblems: updatedProgress.totalProblems,
            progressPercent: Number(updatedProgress.progressPercent),
            completed: updatedProgress.completed,
            lastAttemptAt: updatedProgress.lastAttemptAt,
          },
        };

      res.json(response);
      return response;
    } catch (error) {
      console.error('Update Progress API Error:', error);
      const response: ApiResponse<UserProgress & { id: number; userId: number; lessonId: number }> =
        {
          success: false,
          error: 'Internal server error',
        };
      res.status(500).json(response);
      return response;
    }
  }
}
