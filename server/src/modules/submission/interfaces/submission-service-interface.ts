import { SubmissionRequest, SubmissionResult } from '../models';

export interface ISubmissionService {
  submitAnswers(
    userId: number,
    lessonId: number,
    submission: SubmissionRequest
  ): Promise<SubmissionResult>;
}
