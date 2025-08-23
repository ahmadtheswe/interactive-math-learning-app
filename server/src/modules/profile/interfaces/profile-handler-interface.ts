import { Request, Response } from 'express';
import { ApiResponse } from '../../common/models';
import { UserProfile, UserProfileStats } from '../models';

export interface IProfileHandler {
  getProfile(req: Request, res: Response): Promise<ApiResponse<UserProfileStats>>;
  getUserProfile(req: Request, res: Response): Promise<ApiResponse<UserProfile>>;
}
