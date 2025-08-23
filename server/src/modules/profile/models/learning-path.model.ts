/**
 * Represents a learning path that users can follow
 */
export interface LearningPath {
  id: string;
  name: string;
  description: string;
  topics: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  enrolledAt?: Date;
  progress: number; // Percentage completed
}
