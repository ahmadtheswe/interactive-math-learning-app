import {
  ExistingSubmissionFromDatabase,
  ProblemResult,
  ProgressStats,
  StreakCalculation,
  SubmissionData,
  SubmissionResult,
  SubmissionUserFromDatabase,
  SubmissionUserProgressFromDatabase,
  UpdatedUserFromDatabase,
  UserStats,
} from '../models';

export class SubmissionMapper {
  /**
   * Maps resubmission data to SubmissionResult
   */
  static toResubmissionResult(
    attemptId: string,
    correctAnswersCount: number,
    totalAnswers: number,
    existingSubmission: ExistingSubmissionFromDatabase,
    userProgress: SubmissionUserProgressFromDatabase | null
  ): SubmissionResult {
    return {
      attemptId,
      totalXpAwarded: 0, // No XP awarded on resubmission
      correctAnswers: correctAnswersCount,
      totalAnswers,
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
      isResubmission: true,
    };
  }

  /**
   * Maps successful submission data to SubmissionResult
   */
  static toSubmissionResult(
    attemptId: string,
    totalXpAwarded: number,
    correctAnswers: number,
    totalAnswers: number,
    updatedUser: UpdatedUserFromDatabase,
    userProgress: SubmissionUserProgressFromDatabase,
    streakBonusXp?: number,
    previousXp?: number,
    isNewStreak?: boolean,
    problemResults?: ProblemResult[]
  ): SubmissionResult {
    return {
      attemptId,
      totalXpAwarded,
      correctAnswers,
      totalAnswers,
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
      isResubmission: false,
      streakBonusXp,
      previousXp,
      isNewStreak,
      problemResults,
    };
  }

  /**
   * Creates submission data for database storage
   */
  static toSubmissionData(
    attemptId: string,
    userId: number,
    lessonId: number,
    problemId: number,
    userAnswer: string,
    isCorrect: boolean,
    xpAwarded: number
  ): SubmissionData {
    return {
      attemptId,
      userId,
      lessonId,
      problemId,
      userAnswer,
      isCorrect,
      xpAwarded,
    };
  }

  /**
   * Maps user stats from user object
   */
  static toUserStats(user: UpdatedUserFromDatabase): UserStats {
    return {
      totalXp: user.totalXp,
      currentStreak: user.currentStreak,
      bestStreak: user.bestStreak,
    };
  }

  /**
   * Maps progress stats from user progress object
   */
  static toProgressStats(userProgress: SubmissionUserProgressFromDatabase): ProgressStats {
    return {
      problemsCompleted: userProgress.problemsCompleted,
      totalProblems: userProgress.totalProblems,
      progressPercent: Number(userProgress.progressPercent),
      completed: userProgress.completed,
    };
  }

  /**
   * Calculates streak information based on user activity
   */
  static calculateStreak(user: SubmissionUserFromDatabase): StreakCalculation {
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

      const daysDifference = Math.floor(
        (todayUTC.getTime() - lastActivityDateUTC.getTime()) / (1000 * 60 * 60 * 24)
      );

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

  /**
   * Calculates progress percentage from correct answers and total problems
   */
  static calculateProgressPercent(correctAnswers: number, totalProblems: number): number {
    return totalProblems > 0 ? Math.round((correctAnswers / totalProblems) * 100) : 0;
  }

  /**
   * Determines if lesson is completed based on correct answers vs total problems
   */
  static isLessonCompleted(correctAnswers: number, totalProblems: number): boolean {
    return correctAnswers >= totalProblems;
  }

  /**
   * Validates answer based on problem type
   */
  static validateAnswer(
    problem: {
      type: string;
      correctAnswer: string;
      options: {
        optionText: string;
        isCorrect: boolean;
      }[];
    },
    userAnswer: string
  ): boolean {
    if (problem.type === 'multiple_choice') {
      // For multiple choice, check if the selected option is correct
      const selectedOption = problem.options.find((opt) => opt.optionText === userAnswer);
      return selectedOption?.isCorrect || false;
    } else if (problem.type === 'input') {
      // For input type, compare directly with correct answer
      return userAnswer.trim().toLowerCase() === problem.correctAnswer.trim().toLowerCase();
    }
    return false;
  }
}
