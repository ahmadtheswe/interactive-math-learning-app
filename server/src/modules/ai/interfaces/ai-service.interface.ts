import { AIHintRequest } from '../models';
import { AIHintResponse } from '../models/ai-hint-response.model';

export interface IAIService {
  generateHint(request: AIHintRequest): Promise<AIHintResponse>;
}
