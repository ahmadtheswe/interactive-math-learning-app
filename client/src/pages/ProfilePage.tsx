import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { UserProfileStats } from "../types";

const ProfilePage = () => {
  const [profileStats, setProfileStats] = useState<UserProfileStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getProfileStats();

        if (response.success) {
          setProfileStats(response.data);
        } else {
          setError("Failed to load profile stats");
        }
      } catch (err) {
        console.error("Error loading profile stats:", err);
        setError("Unable to load profile stats. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProfileStats();
  }, []);

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return "❄️";
    if (streak < 7) return "🔥";
    if (streak < 30) return "🔥🔥";
    return "🔥🔥🔥";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 25) return "#ef4444"; // red-500
    if (percentage < 50) return "#f97316"; // orange-500
    if (percentage < 75) return "#eab308"; // yellow-500
    return "#22c55e"; // green-500
  };

  const getXpLevel = (totalXp: number) => {
    return Math.floor(totalXp / 100) + 1;
  };

  const getXpProgress = (totalXp: number) => {
    return totalXp % 100;
  };

  const formatLastActivity = (dateString: string | null) => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">😞</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profileStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No profile data available</p>
        </div>
      </div>
    );
  }

  const currentLevel = getXpLevel(profileStats.totalXp);
  const xpProgress = getXpProgress(profileStats.totalXp);
  const progressColor = getProgressColor(profileStats.progressPercentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Your Profile
            </h1>
            <p className="text-gray-600">
              Track your learning progress and achievements
            </p>
          </div>
          <Link
            to="/"
            className="bg-white text-purple-600 px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-200 font-medium"
          >
            ← Back to Lessons
          </Link>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total XP Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="text-purple-600 text-3xl">⭐</div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">
                  {profileStats.totalXp.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Total XP</p>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Level {currentLevel}
                </span>
                <span className="text-sm text-gray-500">
                  {xpProgress}/100 XP
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${xpProgress}%` }}
                ></div>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              {100 - xpProgress} XP to Level {currentLevel + 1}
            </p>
          </div>

          {/* Current Streak Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">
                {getStreakEmoji(profileStats.currentStreak)}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">
                  {profileStats.currentStreak}
                </p>
                <p className="text-sm text-gray-500">Day Streak</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Best Streak</span>
                <span className="font-medium text-gray-800">
                  {profileStats.bestStreak} days
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Activity</span>
                <span className="font-medium text-gray-800">
                  {formatLastActivity(profileStats.lastActivityDate)}
                </span>
              </div>
            </div>

            {profileStats.currentStreak > 0 && (
              <div className="mt-3 text-xs text-green-600 bg-green-50 p-2 rounded">
                🎉 Keep it up! You're on fire!
              </div>
            )}
          </div>

          {/* Progress Percentage Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="text-blue-500 text-3xl">📊</div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">
                  {profileStats.progressPercentage.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Overall Progress</p>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="relative w-20 h-20 mx-auto mb-4">
              <svg
                className="w-20 h-20 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  stroke={progressColor}
                  strokeWidth="3"
                  strokeDasharray={`${profileStats.progressPercentage}, 100`}
                  strokeLinecap="round"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-800">
                  {Math.round(profileStats.progressPercentage)}%
                </span>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500">
              {profileStats.completedLessons} of {profileStats.totalLessons}{" "}
              lessons completed
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            🏆 Achievements
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* First Lesson Achievement */}
            <div
              className={`p-4 rounded-lg text-center ${
                profileStats.completedLessons > 0
                  ? "bg-green-50 border-2 border-green-200"
                  : "bg-gray-50 border-2 border-gray-200"
              }`}
            >
              <div
                className={`text-2xl mb-2 ${
                  profileStats.completedLessons > 0
                    ? ""
                    : "grayscale opacity-50"
                }`}
              >
                🎯
              </div>
              <p className="text-sm font-medium text-gray-700">First Steps</p>
              <p className="text-xs text-gray-500">Complete 1 lesson</p>
              {profileStats.completedLessons > 0 && (
                <div className="text-xs text-green-600 mt-1">✓ Unlocked</div>
              )}
            </div>

            {/* Streak Achievement */}
            <div
              className={`p-4 rounded-lg text-center ${
                profileStats.bestStreak >= 7
                  ? "bg-orange-50 border-2 border-orange-200"
                  : "bg-gray-50 border-2 border-gray-200"
              }`}
            >
              <div
                className={`text-2xl mb-2 ${
                  profileStats.bestStreak >= 7 ? "" : "grayscale opacity-50"
                }`}
              >
                🔥
              </div>
              <p className="text-sm font-medium text-gray-700">Week Warrior</p>
              <p className="text-xs text-gray-500">7 day streak</p>
              {profileStats.bestStreak >= 7 && (
                <div className="text-xs text-orange-600 mt-1">✓ Unlocked</div>
              )}
            </div>

            {/* XP Achievement */}
            <div
              className={`p-4 rounded-lg text-center ${
                profileStats.totalXp >= 1000
                  ? "bg-purple-50 border-2 border-purple-200"
                  : "bg-gray-50 border-2 border-gray-200"
              }`}
            >
              <div
                className={`text-2xl mb-2 ${
                  profileStats.totalXp >= 1000 ? "" : "grayscale opacity-50"
                }`}
              >
                💎
              </div>
              <p className="text-sm font-medium text-gray-700">XP Master</p>
              <p className="text-xs text-gray-500">Earn 1000 XP</p>
              {profileStats.totalXp >= 1000 && (
                <div className="text-xs text-purple-600 mt-1">✓ Unlocked</div>
              )}
            </div>

            {/* Completion Achievement */}
            <div
              className={`p-4 rounded-lg text-center ${
                profileStats.progressPercentage >= 100
                  ? "bg-yellow-50 border-2 border-yellow-200"
                  : "bg-gray-50 border-2 border-gray-200"
              }`}
            >
              <div
                className={`text-2xl mb-2 ${
                  profileStats.progressPercentage >= 100
                    ? ""
                    : "grayscale opacity-50"
                }`}
              >
                👑
              </div>
              <p className="text-sm font-medium text-gray-700">Champion</p>
              <p className="text-xs text-gray-500">100% complete</p>
              {profileStats.progressPercentage >= 100 && (
                <div className="text-xs text-yellow-600 mt-1">✓ Unlocked</div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📈 Quick Stats
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {profileStats.completedLessons}
              </div>
              <div className="text-sm text-gray-600">Lessons Completed</div>
              <div className="text-xs text-gray-500 mt-1">
                out of {profileStats.totalLessons} total
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {currentLevel}
              </div>
              <div className="text-sm text-gray-600">Current Level</div>
              <div className="text-xs text-gray-500 mt-1">
                {xpProgress}% to next level
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {profileStats.bestStreak}
              </div>
              <div className="text-sm text-gray-600">Best Streak</div>
              <div className="text-xs text-gray-500 mt-1">consecutive days</div>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        {profileStats.currentStreak === 0 &&
          profileStats.completedLessons > 0 && (
            <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white text-center">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="text-xl font-bold mb-2">Ready to Continue?</h3>
              <p className="text-blue-100 mb-4">
                Start a new streak by practicing today!
              </p>
              <Link
                to="/"
                className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Practice Now
              </Link>
            </div>
          )}
      </div>
    </div>
  );
};

export default ProfilePage;
