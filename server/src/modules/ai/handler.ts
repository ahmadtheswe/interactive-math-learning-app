import { Request, Response } from "express";
import { AIService } from "./service";
import { AIHintRequest } from "./types";

export class AIHandler {
  static async getHint(req: Request, res: Response): Promise<void> {
    try {
      const userIdHeader =
        req.headers["userid"] || req.headers["x-user-id"] || "1";
      const userId = parseInt(userIdHeader as string);
      const { lessonId, problemId, userAnswer } = req.body;

      // Validate required fields
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          error: "Invalid user ID in header",
        });
        return;
      }

      if (!lessonId || !problemId || userAnswer === undefined) {
        res.status(400).json({
          success: false,
          error: "Missing required fields: lessonId, problemId, and userAnswer",
        });
        return;
      }

      const lessonIdNum = parseInt(lessonId);
      const problemIdNum = parseInt(problemId);

      if (isNaN(lessonIdNum) || isNaN(problemIdNum)) {
        res.status(400).json({
          success: false,
          error: "Invalid lessonId or problemId",
        });
        return;
      }

      if (typeof userAnswer !== "string") {
        res.status(400).json({
          success: false,
          error: "userAnswer must be a string",
        });
        return;
      }

      const hintRequest: AIHintRequest = {
        userId,
        lessonId: lessonIdNum,
        problemId: problemIdNum,
        userAnswer,
      };

      const hintResponse = await AIService.generateHint(hintRequest);

      if (!hintResponse.success) {
        res.status(500).json({
          success: false,
          error: hintResponse.hint,
        });
        return;
      }

      res.json({
        success: true,
        data: {
          hint: hintResponse.hint,
          problemQuestion: hintResponse.problemQuestion,
        },
      });
    } catch (error) {
      console.error("AI Hint API Error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error. Unable to generate hint at this time.",
      });
    }
  }
}
