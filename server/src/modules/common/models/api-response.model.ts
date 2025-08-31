/**
 * Generic API response type used across all server modules
 * Provides a consistent response format for all API endpoints
 *
 * For success responses: { success: true, data: any }
 * For error responses: { success: false, error: string }
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
