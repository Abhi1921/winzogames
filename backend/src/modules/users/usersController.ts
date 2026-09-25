import { Response } from "express";
import { db } from "../../config/db";
import { AuthRequest } from "../../middleware/auth";

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { fullName, avatarUrl, bio, showPublicLeaderboard, themePreference } = req.body;

    if (fullName) {
      await db.user.update({
        where: { id: userId },
        data: { fullName },
      });
    }

    const updatedProfile = await db.userProfile.upsert({
      where: { userId },
      update: {
        avatarUrl: avatarUrl || undefined,
        bio: bio !== undefined ? bio : undefined,
        showPublicLeaderboard: showPublicLeaderboard !== undefined ? showPublicLeaderboard : undefined,
        themePreference: themePreference || undefined,
      },
      create: {
        userId,
        avatarUrl: avatarUrl || "/avatars/avatar-1.png",
        bio: bio || "Casual gamer on WinzoGames!",
        showPublicLeaderboard: showPublicLeaderboard ?? true,
        themePreference: themePreference || "light",
      },
    });

    return res.json({ message: "Profile updated successfully", profile: updatedProfile });
  } catch {
    return res.status(500).json({ error: "Failed to update profile" });
  }
}

export async function getHistory(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const history = await db.gameSession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: 30,
      include: {
        game: { select: { name: true, slug: true, thumbnail: true, category: { select: { name: true } } } },
        scores: { select: { pointsEarned: true } },
      },
    });

    return res.json({
      history: history.map((h) => ({
        id: h.id,
        gameName: h.game.name,
        gameSlug: h.game.slug,
        thumbnail: h.game.thumbnail,
        category: h.game.category.name,
        score: h.score,
        durationSeconds: h.durationSeconds,
        result: h.result,
        pointsEarned: h.scores[0]?.pointsEarned || 0,
        date: h.startedAt,
      })),
    });
  } catch {
    return res.status(500).json({ error: "Failed to fetch history" });
  }
}
