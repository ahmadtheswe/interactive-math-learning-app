import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export interface SubmissionRequest {
  attemptId: string;
  answers: Array<{
    problemId: number;
    answer: string;
  }>;
}

export interface SubmissionResult {
  attemptId: string;
  totalXpAwarded: number;
  correctAnswers: number;
  totalAnswers: number;
  user: {
    totalXp: number;
    currentStreak: number;
    bestStreak: number;
  };
  progress: {
    problemsCompleted: number;
    totalProblems: number;
    progressPercent: number;
    completed: boolean;
  };
  isResubmission: boolean;
}

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

        return {
          attemptId: submission.attemptId,
          totalXpAwarded: 0, // No XP awarded on resubmission
          correctAnswers: await this.getCorrectAnswersCount(submission.attemptId),
          totalAnswers: submission.answers.length,
          user: {
            totalXp: existingSubmission.user.totalXp,
            currentStreak: existingSubmission.user.currentStreak,
            bestStreak: existingSubmission.user.bestStreak,
          },
          progress: {
            problemsCompleted: userProgress?.problemsCompleted || 0,
            totalProblems: userProgress?.totalProblems || existingSubmission.lesson.problems.length,
            progressPercent: userProgress ? Number(userProgress.progressPercent) : 0,
            completed: userProgress?.completed || false,
          },
          isResubmission: true
        };
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
      const submissionData: Array<{
        attemptId: string;
        userId: number;
        lessonId: number;
        problemId: number;
        userAnswer: string;
        isCorrect: boolean;
        xpAwarded: number;
      }> = [];

      for (const answer of submission.answers) {
        const problem = lesson.problems.find(p => p.id === answer.problemId);
        if (!problem) continue;

        let isCorrect = false;

        // Check if answer is correct based on problem type
        if (problem.type === 'multiple_choice') {
          // For multiple choice, check if the selected option is correct
          const selectedOption = problem.options.find(opt => opt.optionText === answer.answer);
          isCorrect = selectedOption?.isCorrect || false;
        } else if (problem.type === 'input') {
          // For input type, compare directly with correct answer
          isCorrect = answer.answer.trim().toLowerCase() === problem.correctAnswer.trim().toLowerCase();
        }

        if (isCorrect) {
          correctAnswers++;
          totalXpAwarded += problem.xpValue;
        }

        submissionData.push({
          attemptId: submission.attemptId,
          userId,
          lessonId,
          problemId: problem.id,
          userAnswer: answer.answer,
          isCorrect,
          xpAwarded: isCorrect ? problem.xpValue : 0,
        });
      }

      // Calculate new streak
      const { newStreak, bestStreak } = await this.calculateStreak(userId, user);

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

      // Update lesson progress
      const totalProblems = lesson.problems.length;
      const progressPercent = totalProblems > 0 ? Math.round((correctAnswers / totalProblems) * 100) : 0;
      const completed = correctAnswers >= totalProblems;

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

      return {
        attemptId: submission.attemptId,
        totalXpAwarded,
        correctAnswers,
        totalAnswers: submission.answers.length,
        user: {
          totalXp: updatedUser.totalXp,
          currentStreak: updatedUser.currentStreak,
          bestStreak: updatedUser.bestStreak,
        },
        progress: {
          problemsCompleted: userProgress.problemsCompleted,
          totalProblems: userProgress.totalProblems,
          progressPercent: Number(userProgress.progressPercent),
          completed: userProgress.completed,
        },
        isResubmission: false
      };

    } catch (error) {
      console.error('Error submitting answers:', error);
      throw new Error('Failed to submit answers');
    }
  }

  private static async calculateStreak(userId: number, user: any) {
    const today = new Date();
    const todayUTC = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    
    let newStreak = user.currentStreak;
    let bestStreak = user.bestStreak;

    if (!user.lastActivityDate) {
      // First time user - start streak at 1
      newStreak = 1;
    } else {
      const lastActivityUTC = new Date(user.lastActivityDate);
      const lastActivityDateUTC = new Date(
        lastActivityUTC.getUTCFullYear(), 
        lastActivityUTC.getUTCMonth(), 
        lastActivityUTC.getUTCDate()
      );

      const daysDifference = Math.floor((todayUTC.getTime() - lastActivityDateUTC.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDifference === 0) {
        // Same day - no streak change
        newStreak = user.currentStreak;
      } else if (daysDifference === 1) {
        // Next day - increment streak
        newStreak = user.currentStreak + 1;
      } else {
        // Missed a day - reset streak
        newStreak = 1;
      }
    }

    return { newStreak, bestStreak };
  }

  private static async getCorrectAnswersCount(attemptId: string): Promise<number> {
    const submissions = await prisma.submission.findMany({
      where: { attemptId, isCorrect: true }
    });
    return submissions.length;
  }
}
