import { PrismaClient } from '../../../generated/prisma';
import { LessonWithProgress, LessonWithDetails, UserProgressUpdateResult } from './types';
import { LessonMapper } from './mapper';

const prisma = new PrismaClient();

export class LessonService {
  static async getLessonsWithProgress(userId: number): Promise<LessonWithProgress[]> {
    try {
      // Get all lessons with their problem counts
      const lessons = await prisma.lesson.findMany({
        orderBy: { orderIndex: 'asc' },
        include: {
          problems: {
            select: { id: true }
          },
          progresses: {
            where: { userId },
            select: {
              problemsCompleted: true,
              totalProblems: true,
              progressPercent: true,
              completed: true,
              lastAttemptAt: true,
            }
          }
        }
      });

      // Use mapper to transform the data
      return LessonMapper.toLessonsWithProgress(lessons);
    } catch (error) {
      console.error('Error fetching lessons with progress:', error);
      throw new Error('Failed to fetch lessons with progress');
    }
  }

  static async getLessonById(lessonId: number, userId: number): Promise<LessonWithDetails | null> {
    try {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          problems: {
            orderBy: { orderIndex: 'asc' },
            include: {
              options: {
                select: {
                  id: true,
                  problemId: true,
                  optionText: true
                }
              }
            }
          },
          progresses: {
            where: { userId },
            select: {
              problemsCompleted: true,
              totalProblems: true,
              progressPercent: true,
              completed: true,
              lastAttemptAt: true,
            }
          }
        }
      });

      if (!lesson) {
        return null;
      }

      // Use mapper to transform the data
      return LessonMapper.toLessonWithDetails(lesson);
    } catch (error) {
      console.error('Error fetching lesson by ID:', error);
      throw new Error('Failed to fetch lesson');
    }
  }

  static async updateUserProgress(userId: number, lessonId: number, problemsCompleted: number): Promise<UserProgressUpdateResult> {
    try {
      // Get total problems in the lesson
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          problems: {
            select: { id: true }
          }
        }
      });

      if (!lesson) {
        throw new Error('Lesson not found');
      }

      const totalProblems = lesson.problems.length;
      const progressPercent = LessonMapper.calculateProgressPercent(problemsCompleted, totalProblems);
      const completed = LessonMapper.isLessonCompleted(problemsCompleted, totalProblems);

      // Upsert user progress
      const userProgress = await prisma.userProgress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId
          }
        },
        update: {
          problemsCompleted,
          totalProblems,
          progressPercent,
          completed,
          lastAttemptAt: new Date()
        },
        create: {
          userId,
          lessonId,
          problemsCompleted,
          totalProblems,
          progressPercent,
          completed,
          lastAttemptAt: new Date()
        }
      });

      return userProgress;
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw new Error('Failed to update user progress');
    }
  }
}
