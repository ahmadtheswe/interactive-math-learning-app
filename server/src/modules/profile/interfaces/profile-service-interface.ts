import { UserProfile, UserProfileStats } from '../models';

export interface IProfileService {
  getUserStats(userId: number): Promise<UserProfileStats | null>;
  getUserById(userId: number): Promise<UserProfile | null>;
}
