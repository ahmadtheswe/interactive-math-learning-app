import { Router } from 'express';
import { LessonHandler } from '../modules';
import { SubmissionHandler } from '../modules';
import { container } from 'tsyringe';

const router = Router();
const lessonHandler = container.resolve(LessonHandler);

// GET /api/lessons - Get all lessons with user progress
router.get('/', (req, res) => lessonHandler.getLessons(req, res));

// GET /api/lessons/:lessonId - Get specific lesson with user progress
router.get('/:lessonId', (req, res) => lessonHandler.getLessonById(req, res));

// PUT /api/lessons/:lessonId/progress - Update user progress for a lesson
router.put('/:lessonId/progress', (req, res) => lessonHandler.updateProgress(req, res));

// POST /api/lessons/:id/submit - Submit answers with attempt_id
router.post('/:id/submit', SubmissionHandler.submitAnswers);

export { router as lessonRoutes };
