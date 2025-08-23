// Database query result types
import { LessonProblemReference } from './lesson.model';

export interface LessonFromDatabase {
  id: number;
  title: string;
  description: string | null;
  orderIndex: number;
  createdAt: Date;
  problems: LessonProblemReference[];
  progresses: LessonUserProgressFromDatabase[];
}

export interface LessonUserProgressFromDatabase {
  problemsCompleted: number;
  totalProblems: number;
  progressPercent: number | { toNumber(): number };
  completed: boolean;
  lastAttemptAt: Date | null;
}

export interface LessonWithProblemsFromDatabase {
  id: number;
  title: string;
  description: string | null;
  orderIndex: number;
  createdAt: Date;
  problems: LessonProblemFromDatabase[];
  progresses: LessonUserProgressFromDatabase[];
}

export interface LessonProblemFromDatabase {
  id: number;
  lessonId: number;
  type: string;
  question: string;
  xpValue: number;
  orderIndex: number;
  options?: LessonProblemOptionFromDatabase[];
}

export interface LessonProblemOptionFromDatabase {
  id: number;
  problemId: number;
  optionText: string;
}

export interface UserProgressUpdateResult {
  id: number;
  userId: number;
  lessonId: number;
  problemsCompleted: number;
  totalProblems: number;
  progressPercent: number | { toNumber(): number };
  completed: boolean;
  lastAttemptAt: Date | null;
}
