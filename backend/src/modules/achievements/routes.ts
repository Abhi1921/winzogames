import { Router } from "express";
import { getAchievements } from "./achievementsController";

const router = Router();
router.get("/", getAchievements);

export default router;
