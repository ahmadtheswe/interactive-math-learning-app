import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

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

      // Transform the data to include progress information
      const lessonsWithProgress: LessonWithProgress[] = lessons.map(lesson => {
        const userProgress = lesson.progresses[0]; // Should be only one per user
        const totalProblems = lesson.problems.length;

        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          orderIndex: lesson.orderIndex,
          createdAt: lesson.createdAt,
          totalProblems,
          completedProblems: userProgress?.problemsCompleted || 0,
          progressPercent: userProgress ? Number(userProgress.progressPercent) : 0,
          completed: userProgress?.completed || false,
          lastAttemptAt: userProgress?.lastAttemptAt || null,
        };
      });

      return lessonsWithProgress;
    } catch (error) {
      console.error('Error fetching lessons with progress:', error);
      throw new Error('Failed to fetch lessons with progress');
    }
  }

  static async getLessonById(lessonId: number, userId: number) {
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

      const userProgress = lesson.progresses[0];

      return {
        ...lesson,
        userProgress: userProgress || {
          problemsCompleted: 0,
          totalProblems: lesson.problems.length,
          progressPercent: 0,
          completed: false,
          lastAttemptAt: null,
        }
      };
    } catch (error) {
      console.error('Error fetching lesson by ID:', error);
      throw new Error('Failed to fetch lesson');
    }
  }

  static async updateUserProgress(userId: number, lessonId: number, problemsCompleted: number) {
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
      const progressPercent = totalProblems > 0 ? Math.round((problemsCompleted / totalProblems) * 100) : 0;
      const completed = problemsCompleted >= totalProblems;

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
