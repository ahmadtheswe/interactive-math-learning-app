import { container } from 'tsyringe';
import { LessonHandler } from './handlers/lesson-handler';
import { LessonService } from './services/lesson-service';
import { ILessonService } from './interfaces/lesson-service-interface';

// Register the service implementation
container.register<ILessonService>("ILessonService", {
  useClass: LessonService
});

// Register the handler itself
container.register(LessonHandler, {
  useClass: LessonHandler
});
