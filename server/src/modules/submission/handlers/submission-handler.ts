import { Request, Response } from 'express';
import { SubmissionService } from '../services/submission-service';
import { SubmissionRequest, SubmissionResponseData, ApiResponse } from '../models';
import { ISubmissionHandler } from '../interfaces/submission-handler-interface';
import { injectable, inject } from 'tsyringe';

@injectable()
export class SubmissionHandler implements ISubmissionHandler {
  constructor(@inject('ISubmissionService') private submissionService: SubmissionService) {}
  async submitAnswers(req: Request, res: Response): Promise<ApiResponse<SubmissionResponseData>> {
    try {
      const lessonId = parseInt(req.params.id);
      const userIdHeader = req.headers['userid'] || req.headers['x-user-id'] || '1';
      const userId = parseInt(userIdHeader as string);

      if (isNaN(lessonId) || isNaN(userId)) {
        const errorResponse: ApiResponse<SubmissionResponseData> = {
          success: false,
          error: 'Invalid lesson ID or user ID',
        };
        res.status(400).json(errorResponse);
        return errorResponse;
      }

      const { attemptId, answers }: SubmissionRequest = req.body;

      if (!attemptId || !answers || !Array.isArray(answers)) {
        const errorResponse: ApiResponse<SubmissionResponseData> = {
          success: false,
          error: 'Missing required fields: attemptId and answers array',
        };
        res.status(400).json(errorResponse);
        return errorResponse;
      }

      // Validate answers format
      for (const answer of answers) {
        if (!answer.problemId || typeof answer.answer !== 'string') {
          const errorResponse: ApiResponse<SubmissionResponseData> = {
            success: false,
            error: 'Invalid answer format. Each answer must have problemId and answer fields',
          };
          res.status(400).json(errorResponse);
          return errorResponse;
        }
      }

      const result = await this.submissionService.submitAnswers(userId, lessonId, {
        attemptId,
        answers,
      });

      const responseData: SubmissionResponseData = {
        attemptId: result.attemptId,
        results: {
          correctAnswers: result.correctAnswers,
          totalAnswers: result.totalAnswers,
          xpAwarded: result.totalXpAwarded,
          problemResults: result.problemResults,
        },
        user: {
          totalXp: result.user.totalXp,
          currentStreak: result.user.currentStreak,
          bestStreak: result.user.bestStreak,
        },
        progress: {
          problemsCompleted: result.progress.problemsCompleted,
          totalProblems: result.progress.totalProblems,
          progressPercent: result.progress.progressPercent,
          completed: result.progress.completed,
        },
        isResubmission: result.isResubmission,
        streakBonusXp: result.streakBonusXp || 0,
        previousXp: result.previousXp || 0,
        isNewStreak: result.isNewStreak || false,
      };

      const successResponse: ApiResponse<SubmissionResponseData> = {
        success: true,
        data: responseData,
      };

      res.json(successResponse);
      return successResponse;
    } catch (error) {
      console.error('Submit Answers API Error:', error);
      const errorResponse: ApiResponse<SubmissionResponseData> = {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
      res.status(500).json(errorResponse);
      return errorResponse;
    }
  }
}
