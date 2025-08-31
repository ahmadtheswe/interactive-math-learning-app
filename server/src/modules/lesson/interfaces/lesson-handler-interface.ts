import { Request, Response } from 'express';
import { ApiResponse } from '../../common/models';
import { LessonWithProgress, LessonWithDetails, UserProgress } from '../models';

export interface ILessonHandler {
  getLessons(
    req: Request,
    res: Response
  ): Promise<ApiResponse<{ lessons: LessonWithProgress[]; userId: number }>>;
  getLessonById(req: Request, res: Response): Promise<ApiResponse<LessonWithDetails>>;
  updateProgress(
    req: Request,
    res: Response
  ): Promise<ApiResponse<UserProgress & { id: number; userId: number; lessonId: number }>>;
}
