// Lesson interfaces
import { Problem } from './problem.types';
import { UserProgress } from './progress.types';

export interface LessonWithProgress {
  id: number;
  title: string;
  description: string | null;
  orderIndex: number;
  createdAt: Date;
  totalProblems: number;
  completedProblems: number;
  progressPercent: number;
  completed: boolean;
  lastAttemptAt: Date | null;
}

export interface LessonWithDetails {
  id: number;
  title: string;
  description: string | null;
  orderIndex: number;
  createdAt: Date;
  problems: Problem[];
  userProgress: UserProgress;
}

export interface LessonProblemReference {
  id: number;
}
