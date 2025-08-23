import { Request, Response } from 'express';
import { IProfileHandler } from '../interfaces/profile-handler-interface';
import { inject, injectable } from 'tsyringe';
import { IProfileService } from '../interfaces/profile-service-interface';
import { UserProfile, UserProfileStats } from '../models';
import { ApiResponse } from '../../common/models';

@injectable()
export class ProfileHandler implements IProfileHandler {
  constructor(@inject('IProfileService') private profileService: IProfileService) {}

  async getProfile(req: Request, res: Response): Promise<ApiResponse<UserProfileStats>> {
    try {
      // TODO: Implement authentication middleware to get user ID
      // For now, we'll use a hardcoded user ID.
      // In a real app, you'd get this from authentication middleware
      const userId = req.params.userId ? parseInt(req.params.userId) : 1;

      if (isNaN(userId)) {
        const response: ApiResponse<UserProfileStats> = {
          success: false,
          error: 'Invalid user ID',
        };
        res.status(400).json(response);
        return response;
      }

      const userStats = await this.profileService.getUserStats(userId);

      if (!userStats) {
        const response: ApiResponse<UserProfileStats> = {
          success: false,
          error: 'User not found',
        };
        res.status(404).json(response);
        return response;
      }

      const response: ApiResponse<UserProfileStats> = {
        success: true,
        data: userStats,
      };

      res.json(response);
      return response;
    } catch (error) {
      console.error('Profile API Error:', error);
      const response: ApiResponse<UserProfileStats> = {
        success: false,
        error: 'Internal server error',
      };
      res.status(500).json(response);
      return response;
    }
  }

  async getUserProfile(req: Request, res: Response): Promise<ApiResponse<UserProfile>> {
    try {
      const userId = req.params.userId ? parseInt(req.params.userId) : 1;

      if (isNaN(userId)) {
        const response: ApiResponse<UserProfile> = {
          success: false,
          error: 'Invalid user ID',
        };
        res.status(400).json(response);
        return response;
      }

      const user = await this.profileService.getUserById(userId);

      if (!user) {
        const response: ApiResponse<UserProfile> = {
          success: false,
          error: 'User not found',
        };
        res.status(404).json(response);
        return response;
      }

      const response: ApiResponse<UserProfile> = {
        success: true,
        data: user,
      };

      res.json(response);
      return response;
    } catch (error) {
      console.error('User Profile API Error:', error);
      const response: ApiResponse<UserProfile> = {
        success: false,
        error: 'Internal server error',
      };
      res.status(500).json(response);
      return response;
    }
  }
}
