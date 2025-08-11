import { useState, useEffect } from "react";
import type { Problem } from "../types";

interface ProblemCardProps {
  problem: Problem;
  answer: string;
  onAnswerChange: (problemId: number, answer: string) => void;
  isSubmitted: boolean;
  isCorrect?: boolean;
}

export default function ProblemCard({
  problem,
  answer,
  onAnswerChange,
  isSubmitted,
  isCorrect,
}: ProblemCardProps) {
  const [selectedOption, setSelectedOption] = useState<string>(answer);
  const [inputValue, setInputValue] = useState<string>(answer);

  useEffect(() => {
    setSelectedOption(answer);
    setInputValue(answer);
  }, [answer]);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    onAnswerChange(problem.id, value);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onAnswerChange(problem.id, value);
  };

  const getCardBorderStyle = () => {
    if (!isSubmitted) return "border-gray-200";
    return isCorrect
      ? "border-green-500 bg-green-50"
      : "border-red-500 bg-red-50";
  };

  const getResultIcon = () => {
    if (!isSubmitted) return null;
    return isCorrect ? (
      <div className="flex items-center text-green-600">
        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-medium">Correct!</span>
      </div>
    ) : (
      <div className="flex items-center text-red-600">
        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-medium">Incorrect</span>
      </div>
    );
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 p-6 mb-6 transition-all duration-200 ${getCardBorderStyle()}`}
    >
      {/* Problem Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-600">{problem.xpValue} XP</span>
        </div>
        {getResultIcon()}
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {problem.question}
        </h3>
      </div>

      {/* Answer Input */}
      {problem.type === "multiple_choice" && problem.options ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Select your answer:
          </p>
          {problem.options.map((option) => (
            <label
              key={option.id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedOption === option.optionText
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              } ${isSubmitted ? "pointer-events-none" : ""}`}
            >
              <input
                type="radio"
                name={`problem-${problem.id}`}
                value={option.optionText}
                checked={selectedOption === option.optionText}
                onChange={(e) => handleOptionChange(e.target.value)}
                disabled={isSubmitted}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-3 text-sm font-medium text-gray-900">
                {option.optionText}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <div>
          <label
            htmlFor={`input-${problem.id}`}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your answer:
          </label>
          <input
            id={`input-${problem.id}`}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={isSubmitted}
            placeholder="Enter your answer..."
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              isSubmitted ? "bg-gray-100 cursor-not-allowed" : "bg-white"
            }`}
          />
        </div>
      )}

      {/* Problem Type Indicator */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span className="capitalize">
          {problem.type === "multiple_choice"
            ? "Multiple Choice"
            : "Text Input"}
        </span>
        {!isSubmitted && (
          <span className="flex items-center">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Answer required
          </span>
        )}
      </div>
    </div>
  );
}
