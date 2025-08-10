const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Lessons API
  async getLessons(userId: number = 1): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/lessons?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getLessonById(lessonId: number, userId: number = 1): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Submission API
  async submitAnswers(lessonId: number, submissionData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};
