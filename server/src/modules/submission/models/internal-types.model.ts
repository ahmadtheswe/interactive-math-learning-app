// Internal Types

export interface SubmissionData {
  attemptId: string;
  userId: number;
  lessonId: number;
  problemId: number;
  userAnswer: string;
  isCorrect: boolean;
  xpAwarded: number;
}
