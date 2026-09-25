import { Response } from "express";
import { db } from "../../config/db";
import { AuthRequest } from "../../middleware/auth";

export async function getAchievements(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const achievements = await db.achievement.findMany({ orderBy: { pointsReward: "asc" } });

    let userAchMap: Record<string, { isUnlocked: boolean; progress: number }> = {};
    if (userId) {
      const uAchs = await db.userAchievement.findMany({ where: { userId } });
      uAchs.forEach((ua) => {
        userAchMap[ua.achievementId] = { isUnlocked: ua.isUnlocked, progress: ua.progress };
      });
    }

    return res.json({
      achievements: achievements.map((ach) => ({
        id: ach.id,
        code: ach.code,
        title: ach.title,
        description: ach.description,
        category: ach.category,
        pointsReward: ach.pointsReward,
        icon: ach.icon,
        ruleType: ach.ruleType,
        ruleValue: ach.ruleValue,
        isUnlocked: userAchMap[ach.id]?.isUnlocked || false,
        progress: userAchMap[ach.id]?.progress || 0,
      })),
    });
  } catch {
    return res.status(500).json({ error: "Failed to fetch achievements" });
  }
}
