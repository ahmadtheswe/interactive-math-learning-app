import { 
  LessonWithProgress, 
  LessonWithDetails, 
  Problem, 
  ProblemOption, 
  UserProgress,
  LessonFromDatabase,
  LessonWithProblemsFromDatabase,
  LessonProblemFromDatabase,
  LessonProblemOptionFromDatabase,
  LessonUserProgressFromDatabase
} from './types';

export class LessonMapper {
  /**
   * Maps raw lesson data with progress information to LessonWithProgress
   */
  static toLessonWithProgress(lesson: LessonFromDatabase): LessonWithProgress {
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
  }

  /**
   * Maps multiple lessons to LessonWithProgress array
   */
  static toLessonsWithProgress(lessons: LessonFromDatabase[]): LessonWithProgress[] {
    return lessons.map(lesson => this.toLessonWithProgress(lesson));
  }

  /**
   * Maps problem data to Problem interface, hiding correctAnswer for security
   */
  static toProblem(problem: LessonProblemFromDatabase): Problem {
    return {
      id: problem.id,
      lessonId: problem.lessonId,
      type: problem.type,
      question: problem.question,
      correctAnswer: '', // Hide the correct answer for security
      xpValue: problem.xpValue,
      orderIndex: problem.orderIndex,
      options: problem.options?.map(this.toProblemOption) || []
    };
  }

  /**
   * Maps option data to ProblemOption interface
   */
  static toProblemOption(option: LessonProblemOptionFromDatabase): ProblemOption {
    return {
      id: option.id,
      problemId: option.problemId,
      optionText: option.optionText
    };
  }

  /**
   * Maps user progress data to standardized progress format
   */
  static toUserProgress(userProgress: LessonUserProgressFromDatabase | null, totalProblems: number): UserProgress {
    if (userProgress) {
      return {
        problemsCompleted: userProgress.problemsCompleted,
        totalProblems: userProgress.totalProblems,
        progressPercent: Number(userProgress.progressPercent),
        completed: userProgress.completed,
        lastAttemptAt: userProgress.lastAttemptAt,
      };
    }

    return {
      problemsCompleted: 0,
      totalProblems,
      progressPercent: 0,
      completed: false,
      lastAttemptAt: null,
    };
  }

  /**
   * Maps raw lesson data with detailed information to LessonWithDetails
   */
  static toLessonWithDetails(lesson: LessonWithProblemsFromDatabase): LessonWithDetails {
    const userProgress = lesson.progresses[0];
    const problems = lesson.problems.map((problem) => this.toProblem(problem));

    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      orderIndex: lesson.orderIndex,
      createdAt: lesson.createdAt,
      problems,
      userProgress: this.toUserProgress(userProgress, lesson.problems.length)
    };
  }

  /**
   * Calculates progress percentage from completed and total problems
   */
  static calculateProgressPercent(problemsCompleted: number, totalProblems: number): number {
    return totalProblems > 0 ? Math.round((problemsCompleted / totalProblems) * 100) : 0;
  }

  /**
   * Determines if lesson is completed based on problems completed vs total
   */
  static isLessonCompleted(problemsCompleted: number, totalProblems: number): boolean {
    return problemsCompleted >= totalProblems;
  }
}
