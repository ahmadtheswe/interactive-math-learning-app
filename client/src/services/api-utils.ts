import type { ApiResponse } from '../types';

/**
 * Handles API responses, checking for HTTP errors and API-level errors
 * @param response The fetch Response object
 * @returns The parsed API response data
 * @throws Error if HTTP status is not OK or if API indicates error
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as ApiResponse<T>;

  if (!data.success) {
    throw new Error(data.error || 'Unknown error occurred');
  }

  // Return the entire response (which matches our Response types)
  return data as unknown as T;
}
