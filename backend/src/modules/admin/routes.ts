import { Router } from "express";
import { getStats, getUsers, updateUserStatus } from "./adminController";
import { authMiddleware, adminMiddleware } from "../../middleware/auth";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.put("/users", updateUserStatus);

export default router;
