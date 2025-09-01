import { container } from 'tsyringe';
import { AIService } from './services/ai-service';
import { AIHandler } from './handlers/ai-handler';

container.register('IAIService', {
  useClass: AIService,
});

container.register(AIHandler, {
  useClass: AIHandler,
});
