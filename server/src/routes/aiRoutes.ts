import { Router } from "express";
import { AIHandler } from "../modules/ai";

const router = Router();

// POST /api/ai/hint - Get a hint for a problem the user answered incorrectly
router.post("/hint", AIHandler.getHint);

export { router as aiRoutes };
