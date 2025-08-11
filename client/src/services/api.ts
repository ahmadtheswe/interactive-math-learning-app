import { env } from "../config/env";
import type {
  LessonsResponse,
  LessonDetailResponse,
  UpdateProgressResponse,
  SubmissionResponse,
  SubmissionData,
  ProfileStatsResponse,
  AIHintResponse,
} from "../types";

const API_BASE_URL = env.API_BASE_URL;

export const api = {
  // Lessons API
  async getLessons(userId: number = 1): Promise<LessonsResponse> {
    const response = await fetch(`${API_BASE_URL}/lessons?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getLessonById(
    lessonId: number,
    userId: number = 1
  ): Promise<LessonDetailResponse> {
    const response = await fetch(
      `${API_BASE_URL}/lessons/${lessonId}?userId=${userId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Update lesson progress manually
  async updateLessonProgress(
    lessonId: number,
    problemsCompleted: number,
    userId: number = 1
  ): Promise<UpdateProgressResponse> {
    const response = await fetch(
      `${API_BASE_URL}/lessons/${lessonId}/progress`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": userId.toString(),
        },
        body: JSON.stringify({ problemsCompleted }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Submission API
  async submitAnswers(
    lessonId: number,
    submissionData: SubmissionData
  ): Promise<SubmissionResponse> {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Profile API
  async getProfileStats(userId: number = 1): Promise<ProfileStatsResponse> {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // AI Hint API
  async getHint(
    lessonId: number,
    problemId: number,
    userAnswer: string,
    userId: number = 1
  ): Promise<AIHintResponse> {
    const response = await fetch(`${API_BASE_URL}/ai/hint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        userid: userId.toString(),
      },
      body: JSON.stringify({
        lessonId,
        problemId,
        userAnswer,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};
