import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LessonWithDetails, SubmissionAnswer } from '../types';
import { api } from '../services/api';
import ProblemCard from './ProblemCard';

interface LessonInterfaceProps {
  lessonId: number;
  onBackToLessons?: () => void; // Made optional for backward compatibility
}

export default function LessonInterface({ lessonId, onBackToLessons }: LessonInterfaceProps) {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<LessonWithDetails | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getLessonById(lessonId);
      if (response.success) {
        setLesson(response.data);
        // Initialize empty answers for all problems
        const initialAnswers: Record<number, string> = {};
        response.data.problems.forEach((problem: any) => {
          initialAnswers[problem.id] = '';
        });
        setAnswers(initialAnswers);
      }
    } catch (err) {
      console.error('Failed to fetch lesson:', err);
      setError('Failed to load lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (problemId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [problemId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (!lesson) return;

    // Validate that all problems have answers
    const unansweredProblems = lesson.problems.filter(
      problem => !answers[problem.id] || answers[problem.id].trim() === ''
    );

    if (unansweredProblems.length > 0) {
      alert(`Please answer all problems before submitting. ${unansweredProblems.length} problem(s) remaining.`);
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare submission data
      const submissionAnswers: SubmissionAnswer[] = Object.entries(answers).map(([problemId, answer]) => ({
        problemId: parseInt(problemId),
        answer: answer.trim()
      }));

      const submissionData = {
        attemptId: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        answers: submissionAnswers
      };

      const response = await api.submitAnswers(lessonId, submissionData);
      
      if (response.success) {
        setResults(response.data);
        setSubmitted(true);
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

  // TODO implement get correct answers
  const getAnswerCorrectness = (problemId: number): boolean | undefined => {
    if (!results || !results.results) return undefined;
    // This would need to be implemented based on your API response structure
    // For now, returning undefined as placeholder
    return undefined;
  };

  const getProgress = () => {
    if (!lesson) return 0;
    const answeredCount = Object.values(answers).filter(answer => answer.trim() !== '').length;
    return Math.round((answeredCount / lesson.problems.length) * 100);
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Lessons
            </button>
            
            <div className="text-right">
              <h1 className="text-lg font-semibold text-gray-900">{lesson.title}</h1>
              <p className="text-sm text-gray-600">
                Progress: {getProgress()}% ({Object.values(answers).filter(a => a.trim() !== '').length}/{lesson.problems.length})
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
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

        {/* Problems */}
        <div className="space-y-6">
          {lesson.problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              answer={answers[problem.id] || ''}
              onAnswerChange={handleAnswerChange}
              isSubmitted={submitted}
              isCorrect={getAnswerCorrectness(problem.id)}
            />
          ))}
        </div>

        {/* Submit Section */}
        {!submitted && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Ready to submit?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Make sure you've answered all {lesson.problems.length} problems before submitting.
                </p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting || getProgress() < 100}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  getProgress() === 100 && !submitting
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Answers'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {submitted && results && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Results</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{results.correctAnswers || 0}</p>
                <p className="text-sm text-gray-600">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{(results.totalAnswers || 0) - (results.correctAnswers || 0)}</p>
                <p className="text-sm text-gray-600">Incorrect</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{results.totalXpAwarded || 0}</p>
                <p className="text-sm text-gray-600">XP Earned</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(((results.correctAnswers || 0) / (results.totalAnswers || 1)) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Score</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleBackClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Continue Learning
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
