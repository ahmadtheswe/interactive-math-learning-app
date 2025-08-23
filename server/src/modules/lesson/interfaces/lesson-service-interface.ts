import {LessonWithDetails, LessonWithProgress, UserProgressUpdateResult} from "../models";

export interface ILessonService {
  getLessonsWithProgress(userId: number): Promise<LessonWithProgress[]>;

  getLessonById(lessonId: number, userId: number): Promise<LessonWithDetails | null>

  updateUserProgress(userId: number, lessonId: number, problemsCompleted: number): Promise<UserProgressUpdateResult>
}
