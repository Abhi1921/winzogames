import { Router } from "express";
import { getLeaderboard } from "./leaderboardController";

const router = Router();
router.get("/", getLeaderboard);

export default router;
