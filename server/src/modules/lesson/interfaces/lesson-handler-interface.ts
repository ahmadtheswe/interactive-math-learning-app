import {Request, Response} from "express";

export interface ILessonHandler {
  getLessons(req: Request, res: Response): Promise<void>

  getLessonById(req: Request, res: Response): Promise<void>

  updateProgress(req: Request, res: Response): Promise<void>
}
