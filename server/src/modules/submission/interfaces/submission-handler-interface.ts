import { Request, Response } from 'express';
import { ApiResponse } from '../../common/models/api-response.model';
import { SubmissionResponseData } from '../models/submission-response.model';

export interface ISubmissionHandler {
  submitAnswers(req: Request, res: Response): Promise<ApiResponse<SubmissionResponseData>>;
}
