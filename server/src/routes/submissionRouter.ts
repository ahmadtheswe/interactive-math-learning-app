import { Router } from 'express';
import { SubmissionHandler } from '../modules/submission/handlers/submission-handler';
import { container } from '../container';

const router = Router();

const submissionHandler = container.resolve(SubmissionHandler);

// POST /api/submissions/:id/submit - Submit answers with attempt_id
router.post('/:id/submit', (req, res) => submissionHandler.submitAnswers(req, res));

export { router as submissionRoutes };
