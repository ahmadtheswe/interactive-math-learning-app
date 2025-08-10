import { useParams, useNavigate } from 'react-router-dom';
import LessonInterface from '../components/LessonInterface';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const handleBackToLessons = () => {
    navigate('/');
  };

  if (!lessonId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson not found</h1>
          <button
            onClick={handleBackToLessons}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  return (
    <LessonInterface
      lessonId={parseInt(lessonId, 10)}
      onBackToLessons={handleBackToLessons}
    />
  );
}
