// Problem interfaces

export interface ProblemOption {
  id: number;
  problemId: number;
  optionText: string;
}

export interface Problem {
  id: number;
  lessonId: number;
  type: string;
  question: string;
  correctAnswer?: string;
  xpValue: number;
  orderIndex: number;
  options?: ProblemOption[];
}
