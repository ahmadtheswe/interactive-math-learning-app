import { container } from 'tsyringe';
import { IProfileService } from './interfaces/profile-service-interface';
import { ProfileService } from './services/profile-service';
import { ProfileHandler } from './handlers/profile-handler';

container.register<IProfileService>('IProfileService', {
  useClass: ProfileService,
});

container.register(ProfileHandler, {
  useClass: ProfileHandler,
});
