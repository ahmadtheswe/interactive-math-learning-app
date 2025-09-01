import { ApiResponse } from '../../common';
import { AIHintResponse } from '../models';
import { Request, Response } from 'express';

export interface IAIHandler {
  getHint(req: Request, res: Response): Promise<ApiResponse<AIHintResponse>>;
}
