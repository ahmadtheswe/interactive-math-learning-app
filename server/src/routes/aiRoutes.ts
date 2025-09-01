import { Router } from 'express';
import { AIHandler } from '../modules/ai';
import { container } from 'tsyringe';

const router = Router();
const aiHandler = container.resolve(AIHandler);

// POST /api/ai/hint - Get a hint for a problem the user answered incorrectly
router.post('/hint', aiHandler.getHint.bind(aiHandler));

export { router as aiRoutes };
