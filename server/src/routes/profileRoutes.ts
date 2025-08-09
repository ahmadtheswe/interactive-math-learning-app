import { Router } from 'express';
import { ProfileHandler } from '../modules/profile';

const router = Router();

// GET /api/profile - Get user profile stats (uses default user ID 1)
router.get('/', ProfileHandler.getProfile);

// GET /api/profile/:userId - Get specific user profile stats
router.get('/:userId', ProfileHandler.getProfile);

// GET /api/profile/user/:userId - Get full user profile
router.get('/user/:userId', ProfileHandler.getUserProfile);

export { router as profileRoutes };
