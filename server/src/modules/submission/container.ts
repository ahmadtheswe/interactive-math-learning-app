import { container } from 'tsyringe';
import { SubmissionService } from './services/submission-service';
import { SubmissionHandler } from './handlers/submission-handler';

container.register('ISubmissionService', {
  useClass: SubmissionService,
});

container.register('ISubmissionHandler', {
  useClass: SubmissionHandler,
});
