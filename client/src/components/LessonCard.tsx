import type { Lesson } from '../types';

interface LessonCardProps {
  lesson: Lesson;
  onLessonClick: (lessonId: number) => void;
}

export default function LessonCard({ lesson, onLessonClick }: LessonCardProps) {
  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-200';
    if (progress < 50) return 'bg-yellow-400';
    if (progress < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (lesson.completed) return 'Completed';
    if (lesson.completedProblems > 0) return 'In Progress';
    return 'Not Started';
  };

  const getStatusColor = () => {
    if (lesson.completed) return 'text-green-600 bg-green-100';
    if (lesson.completedProblems > 0) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div 
      onClick={() => onLessonClick(lesson.id)}
      className="bg-white rounded-lg shadow-md border border-gray-200 p-6 cursor-pointer transform transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 mr-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {lesson.title}
          </h3>
          {lesson.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {lesson.description}
            </p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Progress: {lesson.completedProblems}/{lesson.totalProblems} problems
          </span>
          <span className="text-sm font-medium text-gray-900">
            {lesson.progressPercent}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(lesson.progressPercent)}`}
            style={{ width: `${lesson.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Lesson {lesson.orderIndex}</span>
        {lesson.lastAttemptAt && (
          <span>
            Last attempt: {new Date(lesson.lastAttemptAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
