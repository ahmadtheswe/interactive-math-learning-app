// Lesson interfaces
import { Problem } from './problem.model';
import { UserProgress } from './progress.model';

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
