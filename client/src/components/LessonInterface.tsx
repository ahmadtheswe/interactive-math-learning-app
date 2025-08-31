import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  LessonWithDetails,
  SubmissionAnswer,
  ProblemResult,
  SubmissionResponse,
} from '../types';
import { api } from '../services/api';
import ProblemCard from './ProblemCard';

interface LessonInterfaceProps {
  lessonId: number;
  attemptId: string; // New required prop for attempt ID
  onBackToLessons?: () => void; // Made optional for backward compatibility
}

export default function LessonInterface({
  lessonId,
  attemptId,
  onBackToLessons,
}: LessonInterfaceProps) {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<LessonWithDetails | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<SubmissionResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLesson = async () => {
      await fetchLesson();
    };

    loadLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getLessonById(lessonId);

      if (response.success && response.data) {
        setLesson(response.data);
        // Initialize empty answers for all problems
        const initialAnswers: Record<number, string> = {};
        response.data.problems.forEach((problem) => {
          initialAnswers[problem.id] = '';
        });
        setAnswers(initialAnswers);
      } else {
        setError('Failed to load lesson data');
      }
    } catch (err) {
      console.error('Failed to fetch lesson:', err);
      setError('Failed to load lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (problemId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [problemId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!lesson) return;

    // Validate that all problems have answers
    const unansweredProblems = lesson.problems.filter(
      (problem) => !answers[problem.id] || answers[problem.id].trim() === ''
    );

    if (unansweredProblems.length > 0) {
      const unansweredNumbers = unansweredProblems
        .map((problem) => lesson.problems.findIndex((p) => p.id === problem.id) + 1)
        .join(', ');

      alert(
        `Please answer all problems before submitting. Missing answers for problem(s): ${unansweredNumbers}`
      );
      return;
    }

    try {
      setSubmitting(true);

      // Prepare submission data
      const submissionAnswers: SubmissionAnswer[] = Object.entries(answers).map(
        ([problemId, answer]) => ({
          problemId: parseInt(problemId),
          answer: answer.trim(),
        })
      );

      const submissionData = {
        attemptId: attemptId,
        answers: submissionAnswers,
      };

      // Default user ID is 1, this would be replaced with actual user ID in a real app
      const userId = 1;
      const response = await api.submitAnswers(lessonId, submissionData, userId);

      if (response.success && response.data) {
        setResults(response.data);
        setSubmitted(true);

        // Navigate to results page with comprehensive data
        const resultsData = {
          correctAnswers: response.data.results?.correctAnswers || 0,
          totalAnswers: response.data.results?.totalAnswers || lesson.problems.length,
          totalXpAwarded: response.data.results?.xpAwarded || 0,
          streakCount: response.data.user?.currentStreak || 0,
          isNewStreak: response.data.isNewStreak || false,
          streakBonusXp: response.data.streakBonusXp || 0,
          previousXp: response.data.previousXp || 0,
          newXp: response.data.user?.totalXp || 0,
          lessonTitle: lesson.title,
          lessonId: lessonId, // Add lessonId for hint API
          perfectScore: (response.data.results?.correctAnswers || 0) === lesson.problems.length,
          improvements: [], // Can be enhanced later based on wrong answers
          attemptId: attemptId, // Pass the attemptId to results page
          problemResults: lesson.problems.map((problem) => {
            const userAnswer = answers[problem.id] || '';

            // Get correctness from server response
            // The server returns detailed results for each problem
            const problemResult = response.data?.results?.problemResults?.find(
              (result: ProblemResult) => result.problemId === problem.id
            );

            return {
              id: problem.id,
              question: problem.question,
              userAnswer: userAnswer,
              correctAnswer: 'Hidden for security', // Don't expose correct answer
              isCorrect: problemResult?.isCorrect || false, // Server determines correctness
              xpValue: problem.xpValue,
            };
          }),
        };

        setTimeout(() => {
          navigate('/results', { state: { resultsData } });
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to submit answers:', err);
      alert('Failed to submit answers. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackClick = () => {
    if (onBackToLessons) {
      onBackToLessons();
    } else {
      navigate('/');
    }
  };

  const handleNext = () => {
    if (lesson && currentProblemIndex < lesson.problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    }
  };

  const canGoNext = () => {
    if (!lesson || currentProblemIndex >= lesson.problems.length - 1) {
      return false;
    }
    // Check if current problem is answered
    const currentProblem = getCurrentProblem();
    if (!currentProblem) return false;

    const currentAnswer = answers[currentProblem.id];
    return currentAnswer && currentAnswer.trim() !== '';
  };

  const isLastProblem = () => {
    return lesson && currentProblemIndex === lesson.problems.length - 1;
  };

  const getCurrentProblem = () => {
    return lesson?.problems[currentProblemIndex];
  };

  // Get answer correctness from submission results
  const getAnswerCorrectness = (problemId: number): boolean | undefined => {
    if (!results || !results.results || !results.results.problemResults) return undefined;

    // Find the problem result for this problem ID in the submission response
    const problemResult = results.results.problemResults.find(
      (result: ProblemResult) => result.problemId === problemId
    );

    // Return the correctness status if found
    return problemResult?.isCorrect;
  };

  // Calculate progress percentage for UI display
  const getProgress = () => {
    if (!lesson) return 0;
    const answeredCount = Object.values(answers).filter((answer) => answer.trim() !== '').length;
    return Math.round((answeredCount / lesson.problems.length) * 100);
  };

  // For the progress bar width - in a real app, you would use a CSS-in-JS solution
  // or create a custom Tailwind class for this
  const getProgressBarStyle = () => {
    // Extracting this to a separate function to appease the linter
    return { width: `${getProgress()}%` };
  };

  const getProblemProgress = () => {
    if (!lesson) return { current: 0, total: 0 };
    return {
      current: currentProblemIndex + 1,
      total: lesson.problems.length,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error || 'Lesson not found'}</p>
          </div>
          <button
            onClick={handleBackClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackClick}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Lessons
            </button>

            <div className="text-right">
              <h1 className="text-lg font-semibold text-gray-900">{lesson.title}</h1>
              <p className="text-sm text-gray-600">
                Problem {getProblemProgress().current} of {getProblemProgress().total}
              </p>
              <p className="text-xs text-gray-500">
                Answered: {Object.values(answers).filter((a) => a.trim() !== '').length}/
                {lesson.problems.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            {/* We need inline style for dynamic width percentage */}
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={getProgressBarStyle()}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Lesson Description */}
        {lesson.description && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h2 className="text-lg font-medium text-blue-900 mb-2">About this lesson</h2>
            <p className="text-blue-800">{lesson.description}</p>
          </div>
        )}

        {/* Problems - Single Problem Display */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {getCurrentProblem() && (
            <div className="p-6">
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Problem {currentProblemIndex + 1} of {lesson.problems.length}
                </span>
              </div>

              <ProblemCard
                key={getCurrentProblem()!.id}
                problem={getCurrentProblem()!}
                answer={answers[getCurrentProblem()!.id] || ''}
                onAnswerChange={handleAnswerChange}
                isSubmitted={submitted}
                isCorrect={getAnswerCorrectness(getCurrentProblem()!.id)}
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end">
              {!isLastProblem() ? (
                <div className="text-center">
                  <button
                    onClick={handleNext}
                    disabled={!canGoNext()}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      canGoNext()
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next Problem
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || getProgress() < 100}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                      getProgress() === 100 && !submitting
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results - Success Message */}
        {submitted && results && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-sm border border-green-200 p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Lesson Completed!</h3>
              <p className="text-green-700 mb-4">
                Great job! You scored {results.results?.correctAnswers || 0} out of{' '}
                {results.results?.totalAnswers || lesson.problems.length} problems correctly.
              </p>
              <div className="animate-pulse">
                <p className="text-sm text-green-600">Preparing your results...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
