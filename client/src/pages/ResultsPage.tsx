import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface ResultsData {
  correctAnswers: number;
  totalAnswers: number;
  totalXpAwarded: number;
  streakCount?: number;
  isNewStreak?: boolean;
  streakBonusXp?: number;
  previousXp: number;
  newXp: number;
  lessonTitle: string;
  perfectScore?: boolean;
  improvements?: string[];
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [animatedXp, setAnimatedXp] = useState(0);

  // Get results data from navigation state or default values
  const resultsData: ResultsData = location.state?.resultsData || {
    correctAnswers: 0,
    totalAnswers: 0,
    totalXpAwarded: 0,
    previousXp: 0,
    newXp: 0,
    lessonTitle: "Unknown Lesson",
    streakCount: 0,
  };

  const {
    correctAnswers,
    totalAnswers,
    totalXpAwarded,
    streakCount = 0,
    isNewStreak = false,
    streakBonusXp = 0,
    newXp,
    lessonTitle,
    perfectScore = false,
    improvements = [],
  } = resultsData;

  const scorePercent = Math.round(
    (correctAnswers / Math.max(totalAnswers, 1)) * 100
  );

  useEffect(() => {
    // Start XP animation after a brief delay
    const xpTimer = setTimeout(() => {
      setShowXpAnimation(true);
      // Animate XP counter
      let current = 0;
      const increment = Math.ceil(totalXpAwarded / 30);
      const animate = () => {
        current += increment;
        if (current <= totalXpAwarded) {
          setAnimatedXp(current);
          requestAnimationFrame(animate);
        } else {
          setAnimatedXp(totalXpAwarded);
        }
      };
      animate();
    }, 500);

    // Start streak animation after XP animation
    const streakTimer = setTimeout(() => {
      if (streakCount > 0) {
        setShowStreakAnimation(true);
      }
    }, 2000);

    return () => {
      clearTimeout(xpTimer);
      clearTimeout(streakTimer);
    };
  }, [totalXpAwarded, streakCount]);

  const getScoreColor = () => {
    if (scorePercent >= 90) return "text-green-600";
    if (scorePercent >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreEmoji = () => {
    if (perfectScore) return "🌟";
    if (scorePercent >= 90) return "🎉";
    if (scorePercent >= 70) return "👍";
    return "💪";
  };

  const getEncouragementMessage = () => {
    if (perfectScore) return "Perfect! You're absolutely crushing it!";
    if (scorePercent >= 90)
      return "Excellent work! Keep up the amazing progress!";
    if (scorePercent >= 70) return "Great job! You're getting stronger!";
    return "Good effort! Every mistake is a step towards mastery!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-pulse">{getScoreEmoji()}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lesson Complete!
          </h1>
          <p className="text-xl text-gray-600">{lessonTitle}</p>
        </div>

        {/* Main Results Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Score Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white text-center">
            <div className="mb-6">
              <div
                className={`text-8xl font-bold mb-2 ${
                  scorePercent >= 70 ? "animate-bounce" : ""
                }`}
              >
                {scorePercent}%
              </div>
              <p className="text-xl opacity-90">
                {correctAnswers} out of {totalAnswers} correct
              </p>
            </div>
            <p className="text-lg font-medium">{getEncouragementMessage()}</p>
          </div>

          {/* XP Gained Section */}
          <div className="px-8 py-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                XP Gained
              </h2>

              {/* XP Animation */}
              <div
                className={`transition-all duration-1000 ${
                  showXpAnimation ? "scale-110" : "scale-100"
                }`}
              >
                <div className="text-6xl font-bold text-yellow-600 mb-2">
                  +{animatedXp}
                </div>
                {streakBonusXp > 0 && (
                  <div className="text-lg text-yellow-500">
                    (+{streakBonusXp} streak bonus!)
                  </div>
                )}
              </div>

              {/* XP Progress Bar */}
              <div className="mt-6 max-w-md mx-auto">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Level Progress</span>
                  <span>{newXp} XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-2000"
                    style={{
                      width: `${Math.min(((newXp % 1000) / 1000) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {1000 - (newXp % 1000)} XP to next level
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Streak Section */}
        {streakCount > 0 && (
          <div
            className={`bg-white rounded-2xl shadow-lg p-8 mb-8 transition-all duration-1000 ${
              showStreakAnimation ? "scale-105 ring-4 ring-orange-200" : ""
            }`}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {isNewStreak ? "New Streak Started!" : "Streak Continues!"}
              </h3>
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {streakCount} {streakCount === 1 ? "Day" : "Days"}
              </div>
              <p className="text-gray-600">
                {isNewStreak
                  ? "Great start! Keep learning daily to build your streak!"
                  : "Amazing consistency! Keep the momentum going!"}
              </p>
            </div>
          </div>
        )}

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Performance Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Correct Answers</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(correctAnswers / totalAnswers) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-medium">
                    {correctAnswers}/{totalAnswers}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Accuracy</span>
                <span className={`font-bold text-lg ${getScoreColor()}`}>
                  {scorePercent}%
                </span>
              </div>

              {perfectScore && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <span className="text-yellow-600 mr-2">🏆</span>
                    <span className="text-yellow-800 font-medium">
                      Perfect Score!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Growth & Improvement */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-blue-600 mr-2">📈</span>
                <span className="text-gray-600">XP Earned: </span>
                <span className="font-bold text-blue-600 ml-auto">
                  +{totalXpAwarded}
                </span>
              </div>

              {streakCount > 0 && (
                <div className="flex items-center">
                  <span className="text-orange-600 mr-2">🔥</span>
                  <span className="text-gray-600">Daily Streak: </span>
                  <span className="font-bold text-orange-600 ml-auto">
                    {streakCount} days
                  </span>
                </div>
              )}

              <div className="flex items-center">
                <span className="text-purple-600 mr-2">⭐</span>
                <span className="text-gray-600">Total XP: </span>
                <span className="font-bold text-purple-600 ml-auto">
                  {newXp}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Improvement Suggestions */}
        {improvements.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💡 Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {improvements.map((improvement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Continue Learning
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            View Profile
          </button>

          <button
            onClick={() => navigate(-2)} // Go back to lesson
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200"
          >
            Review Lesson
          </button>
        </div>

        {/* Motivational Footer */}
        <div className="text-center mt-8 py-6 bg-white rounded-xl shadow-lg">
          <p className="text-gray-600 text-lg">
            "Every expert was once a beginner. Keep learning, keep growing! 🌱"
          </p>
        </div>
      </div>
    </div>
  );
}
