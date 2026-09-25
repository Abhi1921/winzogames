import { Router } from "express";
import { getGames, getGameBySlug, startSession, completeSession } from "./gamesController";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.get("/", getGames);
router.get("/:slug", getGameBySlug);
router.post("/sessions/start", startSession);
router.post("/sessions/:sessionId/complete", authMiddleware, completeSession);

export default router;
