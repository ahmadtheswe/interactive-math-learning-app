export interface ProblemContext {
  id: number;
  question: string;
  correctAnswer: string;
  type: string;
  options?: string[];
}
