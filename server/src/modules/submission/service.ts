import { PrismaClient } from '../../../generated/prisma';
import { SubmissionRequest, SubmissionResult, SubmissionData, StreakCalculation } from './types';
import { SubmissionMapper } from './mapper';

const prisma = new PrismaClient();

export class SubmissionService {
  static async submitAnswers(userId: number, lessonId: number, submission: SubmissionRequest): Promise<SubmissionResult> {
    try {
      // Check if this attempt_id already exists (idempotency)
      const existingSubmission = await prisma.submission.findFirst({
        where: { attemptId: submission.attemptId },
        include: {
          user: true,
          lesson: {
            include: {
              problems: {
                select: { id: true }
              }
            }
          }
        }
      });

      // If submission already exists, return the previous result
      if (existingSubmission) {
        const userProgress = await prisma.userProgress.findUnique({
          where: {
            userId_lessonId: {
              userId,
              lessonId
            }
          }
        });

        const correctAnswersCount = await this.getCorrectAnswersCount(submission.attemptId);
        
        // Use mapper for resubmission result
        return SubmissionMapper.toResubmissionResult(
          submission.attemptId,
          correctAnswersCount,
          submission.answers.length,
          existingSubmission,
          userProgress
        );
      }

      // Get lesson with problems and correct answers
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          problems: {
            include: {
              options: {
                select: {
                  id: true,
                  problemId: true,
                  optionText: true,
                  isCorrect: true
                }
              }
            }
          }
        }
      });

      if (!lesson) {
        throw new Error('Lesson not found');
      }

      // Get current user data
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Process each answer
      let correctAnswers = 0;
      let totalXpAwarded = 0;
      const submissionData: SubmissionData[] = [];

      for (const answer of submission.answers) {
        const problem = lesson.problems.find(p => p.id === answer.problemId);
        if (!problem) continue;

        // Use mapper to validate answer
        const isCorrect = SubmissionMapper.validateAnswer(problem, answer.answer);

        if (isCorrect) {
          correctAnswers++;
          totalXpAwarded += problem.xpValue;
        }

        // Use mapper to create submission data
        submissionData.push(
          SubmissionMapper.toSubmissionData(
            submission.attemptId,
            userId,
            lessonId,
            problem.id,
            answer.answer,
            isCorrect,
            isCorrect ? problem.xpValue : 0
          )
        );
      }

      // Use mapper to calculate new streak
      const { newStreak, bestStreak } = SubmissionMapper.calculateStreak(user);

      // Update user stats
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          totalXp: user.totalXp + totalXpAwarded,
          currentStreak: newStreak,
          bestStreak: Math.max(bestStreak, newStreak),
          lastActivityDate: new Date(),
        }
      });

      // Save all submissions in a transaction
      await prisma.$transaction(async (tx) => {
        for (const subData of submissionData) {
          await tx.submission.create({ data: subData });
        }
      });

      // Update lesson progress using mapper calculations
      const totalProblems = lesson.problems.length;
      const progressPercent = SubmissionMapper.calculateProgressPercent(correctAnswers, totalProblems);
      const completed = SubmissionMapper.isLessonCompleted(correctAnswers, totalProblems);

      const userProgress = await prisma.userProgress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId
          }
        },
        update: {
          problemsCompleted: correctAnswers,
          totalProblems,
          progressPercent,
          completed,
          lastAttemptAt: new Date()
        },
        create: {
          userId,
          lessonId,
          problemsCompleted: correctAnswers,
          totalProblems,
          progressPercent,
          completed,
          lastAttemptAt: new Date()
        }
      });

      // Use mapper to create final result
      return SubmissionMapper.toSubmissionResult(
        submission.attemptId,
        totalXpAwarded,
        correctAnswers,
        submission.answers.length,
        updatedUser,
        userProgress
      );

    } catch (error) {
      console.error('Error submitting answers:', error);
      throw new Error('Failed to submit answers');
    }
  }

  private static async calculateStreak(userId: number, user: {
    currentStreak: number;
    bestStreak: number;
    lastActivityDate: Date | null;
  }): Promise<StreakCalculation> {
    // Delegate to mapper
    return SubmissionMapper.calculateStreak(user);
  }

  private static async getCorrectAnswersCount(attemptId: string): Promise<number> {
    const submissions = await prisma.submission.findMany({
      where: { attemptId, isCorrect: true }
    });
    return submissions.length;
  }
}
