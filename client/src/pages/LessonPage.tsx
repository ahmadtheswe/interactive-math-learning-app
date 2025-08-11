import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import LessonInterface from "../components/LessonInterface";
import { isValidUUID } from "../utils/uuid";

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const attemptId = searchParams.get("attempt-id");

  useEffect(() => {
    // Validate that attempt-id is present and is a valid UUID
    if (!attemptId || !isValidUUID(attemptId)) {
      // Redirect to not found page if attempt-id is missing or invalid
      navigate("/404", { replace: true });
      return;
    }
  }, [attemptId, navigate]);

  const handleBackToLessons = () => {
    navigate("/");
  };

  // Validate lessonId
  if (!lessonId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Lesson not found
          </h1>
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

  // Don't render the lesson interface if validation hasn't passed yet
  if (!attemptId || !isValidUUID(attemptId)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating session...</p>
        </div>
      </div>
    );
  }

  return (
    <LessonInterface
      lessonId={parseInt(lessonId, 10)}
      attemptId={attemptId}
      onBackToLessons={handleBackToLessons}
    />
  );
}
