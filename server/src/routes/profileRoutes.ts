import { Router } from 'express';
import { container } from 'tsyringe';
import { ProfileHandler } from '../modules/profile';

const router = Router();
const profileHandler = container.resolve(ProfileHandler);

// GET /api/profile - Get user profile stats (uses default user ID 1)
router.get('/', (req, res) => profileHandler.getProfile(req, res));

// GET /api/profile/:userId - Get specific user profile stats
router.get('/:userId', (req, res) => profileHandler.getProfile(req, res));

// GET /api/profile/user/:userId - Get full user profile
router.get('/user/:userId', (req, res) => profileHandler.getUserProfile(req, res));

export { router as profileRoutes };
