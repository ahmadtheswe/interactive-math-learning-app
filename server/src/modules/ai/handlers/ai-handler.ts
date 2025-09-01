import { Request, Response } from 'express';
import { AIHintRequest, AIHintResponse } from '../models';
import { ApiResponse } from '../../common';
import { inject, injectable } from 'tsyringe';
import { IAIService } from '../interfaces/ai-service.interface';
import { IAIHandler } from '../interfaces/ai-handler.interface';

@injectable()
export class AIHandler implements IAIHandler {
  constructor(@inject('IAIService') private aiService: IAIService) {}

  async getHint(req: Request, res: Response): Promise<ApiResponse<AIHintResponse>> {
    try {
      const userIdHeader = req.headers['userid'] || req.headers['x-user-id'] || '1';
      const userId = parseInt(userIdHeader as string);
      const { lessonId, problemId, userAnswer } = req.body;

      // Validate required fields
      if (isNaN(userId)) {
        const response: ApiResponse<AIHintResponse> = {
          success: false,
          error: 'Invalid user ID in header',
        };
        res.status(400).json(response);
        return response;
      }

      if (!lessonId || !problemId || userAnswer === undefined) {
        const response: ApiResponse<AIHintResponse> = {
          success: false,
          error: 'Missing required fields: lessonId, problemId, and userAnswer',
        };
        res.status(400).json(response);
        return response;
      }

      const lessonIdNum = parseInt(lessonId);
      const problemIdNum = parseInt(problemId);

      if (isNaN(lessonIdNum) || isNaN(problemIdNum)) {
        const response: ApiResponse<AIHintResponse> = {
          success: false,
          error: 'Invalid lessonId or problemId',
        };
        res.status(400).json(response);
        return response;
      }

      if (typeof userAnswer !== 'string') {
        const response: ApiResponse<AIHintResponse> = {
          success: false,
          error: 'userAnswer must be a string',
        };
        res.status(400).json(response);
        return response;
      }

      const hintRequest: AIHintRequest = {
        userId,
        lessonId: lessonIdNum,
        problemId: problemIdNum,
        userAnswer,
      };

      const hintResponse = await this.aiService.generateHint(hintRequest);

      if (!hintResponse.success) {
        const response: ApiResponse<AIHintResponse> = {
          success: false,
          error: hintResponse.hint,
        };
        res.status(500).json(response);
        return response;
      }

      const response: ApiResponse<AIHintResponse> = {
        success: true,
        data: hintResponse,
      };

      return response;
    } catch (error) {
      console.error('AI Hint API Error:', error);
      const response: ApiResponse<AIHintResponse> = {
        success: false,
        error: 'Internal server error. Unable to generate hint at this time.',
      };
      res.status(500).json(response);
      return response;
    }
  }
}
