import { Request, Response } from 'express';
import { SubmissionService, SubmissionRequest } from './service';

export class SubmissionHandler {
  static async submitAnswers(req: Request, res: Response) {
    try {
      const lessonId = parseInt(req.params.id);
      const userIdHeader = req.headers['userid'] || req.headers['x-user-id'] || '1';
      const userId = parseInt(userIdHeader as string);

      if (isNaN(lessonId) || isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid lesson ID or user ID'
        });
      }

      const { attemptId, answers }: SubmissionRequest = req.body;

      if (!attemptId || !answers || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: attemptId and answers array'
        });
      }

      // Validate answers format
      for (const answer of answers) {
        if (!answer.problemId || typeof answer.answer !== 'string') {
          return res.status(400).json({
            success: false,
            error: 'Invalid answer format. Each answer must have problemId and answer fields'
          });
        }
      }

      const result = await SubmissionService.submitAnswers(userId, lessonId, {
        attemptId,
        answers
      });

      res.json({
        success: true,
        data: {
          attemptId: result.attemptId,
          results: {
            correctAnswers: result.correctAnswers,
            totalAnswers: result.totalAnswers,
            xpAwarded: result.totalXpAwarded,
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
          isResubmission: result.isResubmission
        }
      });
    } catch (error) {
      console.error('Submit Answers API Error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
