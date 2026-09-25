import { Request, Response } from "express";
import { db } from "../../config/db";

export async function getLeaderboard(req: Request, res: Response) {
  try {
    const { game, type } = req.query;
    const gameSlug = String(game || "global");

    const entries = await db.leaderboardEntry.findMany({
      where: {
        gameSlug: gameSlug === "global" ? "global" : gameSlug,
      },
      orderBy: [{ points: "desc" }, { score: "desc" }],
      take: 50,
    });

    const ranked = entries.map((e, idx) => ({
      rank: idx + 1,
      id: e.id,
      userId: e.userId,
      username: e.username,
      avatarUrl: e.avatarUrl,
      score: e.score,
      points: e.points,
      updatedAt: e.updatedAt,
    }));

    return res.json({ leaderboards: ranked });
  } catch {
    return res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
}
