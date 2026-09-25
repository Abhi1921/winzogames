import { Router } from "express";
import { updateProfile, getHistory } from "./usersController";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.put("/profile", authMiddleware, updateProfile);
router.get("/history", authMiddleware, getHistory);

export default router;
