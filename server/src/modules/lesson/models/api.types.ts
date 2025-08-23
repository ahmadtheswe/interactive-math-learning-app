// API Response Types
import { LessonWithProgress, LessonWithDetails } from './lesson.types';

export interface LessonsResponse {
  success: true;
  data: {
    lessons: LessonWithProgress[];
    userId: number;
  };
}

export interface LessonDetailResponse {
  success: true;
  data: LessonWithDetails;
}

export interface UpdateProgressResponse {
  success: true;
  data: {
    id: number;
    userId: number;
    lessonId: number;
    problemsCompleted: number;
    totalProblems: number;
    progressPercent: number;
    completed: boolean;
    lastAttemptAt: Date | null;
  };
}
