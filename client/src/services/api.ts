// Direct access to Vite environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

import type {
  LessonsResponse,
  LessonDetailResponse,
  UpdateProgressResponse,
  SubmissionResponse,
  SubmissionData,
  ProfileStatsResponse,
  AIHintResponse,
} from '../types';

import { handleApiResponse } from './api-utils';

export const api = {
  // Lessons API
  async getLessons(userId: number = 1): Promise<LessonsResponse> {
    const response = await fetch(`${API_BASE_URL}/lessons`, {
      headers: {
        'X-User-ID': userId.toString(),
      },
    });

    return handleApiResponse<LessonsResponse>(response);
  },

  async getLessonById(lessonId: number, userId: number = 1): Promise<LessonDetailResponse> {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
      headers: {
        'X-User-ID': userId.toString(),
      },
    });

    return handleApiResponse<LessonDetailResponse>(response);
  },

  // Update lesson progress manually
  async updateLessonProgress(
    lessonId: number,
    problemsCompleted: number,
    userId: number = 1
  ): Promise<UpdateProgressResponse> {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId.toString(),
      },
      body: JSON.stringify({ problemsCompleted }),
    });

    return handleApiResponse<UpdateProgressResponse>(response);
  },

  // Submission API
  async submitAnswers(
    lessonId: number,
    submissionData: SubmissionData
  ): Promise<SubmissionResponse> {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });

    return handleApiResponse<SubmissionResponse>(response);
  },

  // Profile API
  async getProfileStats(userId: number = 1): Promise<ProfileStatsResponse> {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
    return handleApiResponse<ProfileStatsResponse>(response);
  },

  // AI Hint API
  async getHint(
    lessonId: number,
    problemId: number,
    userAnswer: string,
    userId: number = 1
  ): Promise<AIHintResponse> {
    const response = await fetch(`${API_BASE_URL}/ai/hint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId.toString(),
      },
      body: JSON.stringify({
        lessonId,
        problemId,
        userAnswer,
      }),
    });

    return handleApiResponse<AIHintResponse>(response);
  },
};
