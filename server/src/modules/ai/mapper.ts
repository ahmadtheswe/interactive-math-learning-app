import { AIHintResponse } from "./types";

export class AIMapper {
  static toHintResponse(
    hint: string,
    success: boolean,
    problemQuestion?: string
  ): AIHintResponse {
    return {
      success,
      hint,
      problemQuestion,
    };
  }

  static toErrorResponse(errorMessage: string): AIHintResponse {
    return {
      success: false,
      hint: errorMessage,
    };
  }
}
