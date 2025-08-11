import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Lesson } from "../types";
import { api } from "../services/api";
import LessonCard from "./LessonCard";

interface LessonsListProps {
  onLessonClick?: (lessonId: number) => void; // Made optional
}

export default function LessonsList({ onLessonClick }: LessonsListProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getLessons();
      if (response.success) {
        setLessons(response.data.lessons);
      }
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
      setError("Failed to load lessons. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lessonId: number) => {
    if (onLessonClick) {
      onLessonClick(lessonId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
          <button
            onClick={fetchLessons}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-gray-600 mb-4">No lessons available yet.</p>
          <button
            onClick={fetchLessons}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Math Learning Lessons
              </h1>
              <p className="text-gray-600">
                Choose a lesson to start your learning journey
              </p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <Link
                to="/profile"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
              >
                <span className="mr-2">👤</span>
                My Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onLessonClick={handleLessonClick}
            />
          ))}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {lessons.length}
              </p>
              <p className="text-sm text-gray-600">Total Lessons</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {lessons.filter((l) => l.completed).length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {
                  lessons.filter((l) => l.completedProblems > 0 && !l.completed)
                    .length
                }
              </p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-500">
                {lessons.filter((l) => l.completedProblems === 0).length}
              </p>
              <p className="text-sm text-gray-600">Not Started</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
