// AI-related types and interfaces

export interface AIHintRequest {
  userId: number;
  lessonId: number;
  problemId: number;
  userAnswer: string;
}

export interface AIHintResponse {
  success: boolean;
  hint: string;
  problemQuestion?: string;
}

export interface ProblemContext {
  id: number;
  question: string;
  correctAnswer: string;
  type: string;
  options?: string[];
}
