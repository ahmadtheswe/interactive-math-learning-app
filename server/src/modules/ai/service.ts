import { OpenAI } from "openai";
import { prisma } from "../../db";
import { AIHintRequest, AIHintResponse, ProblemContext } from "./types";

export class AIService {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  static async generateHint(request: AIHintRequest): Promise<AIHintResponse> {
    try {
      // First, get the problem context from the database
      const problem = await this.getProblemContext(request.problemId);
      if (!problem) {
        return {
          success: false,
          hint: "Problem not found. Please try again.",
        };
      }

      // Check if the user's answer is actually incorrect
      const isCorrect = await this.checkAnswer(problem, request.userAnswer);
      if (isCorrect) {
        return {
          success: true,
          hint: "Great job! Your answer is actually correct! 🎉",
          problemQuestion: problem.question,
        };
      }

      // Generate a teen-friendly hint using OpenAI
      const hint = await this.generateHintFromOpenAI(
        problem,
        request.userAnswer
      );

      return {
        success: true,
        hint,
        problemQuestion: problem.question,
      };
    } catch (error) {
      console.error("Error generating hint:", error);
      return {
        success: false,
        hint: "Sorry, I couldn't generate a hint right now. Try reviewing the problem again or ask your teacher for help!",
      };
    }
  }

  private static async getProblemContext(
    problemId: number
  ): Promise<ProblemContext | null> {
    try {
      const problem = await prisma.problem.findUnique({
        where: { id: problemId },
        include: {
          options: {
            select: {
              optionText: true,
            },
          },
        },
      });

      if (!problem) return null;

      return {
        id: problem.id,
        question: problem.question,
        correctAnswer: problem.correctAnswer,
        type: problem.type,
        options: problem.options?.map((opt) => opt.optionText),
      };
    } catch (error) {
      console.error("Error fetching problem context:", error);
      return null;
    }
  }

  private static checkAnswer(
    problem: ProblemContext,
    userAnswer: string
  ): boolean {
    // Normalize answers for comparison
    const normalizedCorrect = problem.correctAnswer.trim().toLowerCase();
    const normalizedUser = userAnswer.trim().toLowerCase();

    return normalizedCorrect === normalizedUser;
  }

  private static async generateHintFromOpenAI(
    problem: ProblemContext,
    userAnswer: string
  ): Promise<string> {
    try {
      const systemPrompt = `You are a helpful math tutor for teenagers. Your job is to give friendly, encouraging hints when students get math problems wrong. 

Guidelines:
- Keep hints teen-friendly and encouraging
- Don't give away the exact answer
- Help them understand their mistake
- Use casual, supportive language
- Include emojis to keep it fun
- Keep hints concise (1-2 sentences max)
- Focus on the thinking process, not just the answer`;

      const userPrompt = `Problem: ${problem.question}
Student's answer: ${userAnswer}
Problem type: ${problem.type}
${problem.options ? `Available options: ${problem.options.join(", ")}` : ""}

The student got this wrong. Give them a helpful hint to guide them toward the correct approach without revealing the answer.`;

      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const hint = completion.choices[0]?.message?.content?.trim();
      return (
        hint ||
        "Let's think about this step by step. What's the first thing you need to do to solve this problem? 🤔"
      );
    } catch (error) {
      console.error("OpenAI API error:", error);
      // Fallback hint if OpenAI fails
      return "Don't worry, everyone makes mistakes! Take another look at the problem and try breaking it down into smaller steps. You've got this! 💪";
    }
  }
}
