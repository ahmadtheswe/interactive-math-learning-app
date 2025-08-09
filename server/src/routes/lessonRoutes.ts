import { Router } from 'express';
import { LessonHandler } from '../modules/lesson';
import { SubmissionHandler } from '../modules/submission';

const router = Router();

// GET /api/lessons - Get all lessons with user progress
router.get('/', LessonHandler.getLessons);

// GET /api/lessons/:lessonId - Get specific lesson with user progress
router.get('/:lessonId', LessonHandler.getLessonById);

// PUT /api/lessons/:lessonId/progress - Update user progress for a lesson
router.put('/:lessonId/progress', LessonHandler.updateProgress);

// POST /api/lessons/:id/submit - Submit answers with attempt_id
router.post('/:id/submit', SubmissionHandler.submitAnswers);

export { router as lessonRoutes };
