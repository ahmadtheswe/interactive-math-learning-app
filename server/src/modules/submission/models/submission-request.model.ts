// Submission request types

export interface SubmissionAnswer {
  problemId: number;
  answer: string;
}

export interface SubmissionRequest {
  attemptId: string;
  answers: SubmissionAnswer[];
}
