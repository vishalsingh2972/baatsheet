import express from "express";
import { AiController } from "./ai.controller";
import { optionalAuth } from "../../middlewares/auth";

const router = express.Router();

router.post("/generate-form", optionalAuth, AiController.generateFormWithAI);
router.post("/generate-options", optionalAuth, AiController.generateOptionsWithAI);
router.post("/generate-question", optionalAuth, AiController.generateQuestionWithAI);
router.post("/edit-question", optionalAuth, AiController.editQuestionWithAI);
router.post("/generate-image", optionalAuth, AiController.generateImageWithAI);
router.post("/summarize-responses", optionalAuth, AiController.summarizeResponsesWithAI);

export const AiRoutes = router;
