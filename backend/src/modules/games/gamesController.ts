import { Request, Response } from "express";
import { db } from "../../config/db";
import { AuthRequest } from "../../middleware/auth";

export async function getGames(req: Request, res: Response) {
  try {
    const { category, search, difficulty, featured, sort } = req.query;

    let whereClause: Record<string, unknown> = { status: "PUBLISHED" };

    if (category) {
      const cat = await db.gameCategory.findUnique({ where: { slug: String(category) } });
      if (cat) whereClause.categoryId = cat.id;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: String(search) } },
        { description: { contains: String(search) } },
      ];
    }

    if (difficulty) whereClause.difficulty = String(difficulty).toUpperCase();
    if (featured === "true") whereClause.isFeatured = true;

    let orderBy: Record<string, string> = { playCount: "desc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };
    if (sort === "rating") orderBy = { rating: "desc" };

    const games = await db.game.findMany({
      where: whereClause,
      include: { category: true },
      orderBy,
    });

    return res.json({
      games: games.map((g) => ({
        id: g.id,
        slug: g.slug,
        name: g.name,
        description: g.description,
        category: g.category.name,
        categorySlug: g.category.slug,
        thumbnail: g.thumbnail,
        difficulty: g.difficulty,
        playCount: g.playCount,
        rating: g.rating,
        isFeatured: g.isFeatured,
        isMultiplayer: g.isMultiplayer,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch games" });
  }
}

export async function getGameBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const game = await db.game.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!game) return res.status(404).json({ error: "Game not found" });

    return res.json({
      game: {
        ...game,
        category: game.category.name,
        categorySlug: game.category.slug,
      },
    });
  } catch {
    return res.status(500).json({ error: "Failed to fetch game detail" });
  }
}

export async function startSession(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const { gameSlug } = req.body;

    const game = await db.game.findUnique({ where: { slug: gameSlug } });
    if (!game) return res.status(404).json({ error: "Game not found" });

    await db.game.update({
      where: { id: game.id },
      data: { playCount: { increment: 1 } },
    });

    if (!userId) {
      return res.json({ sessionId: `guest-${Date.now()}` });
    }

    const session = await db.gameSession.create({
      data: {
        userId,
        gameId: game.id,
        status: "IN_PROGRESS",
      },
    });

    return res.json({ sessionId: session.id });
  } catch {
    return res.status(500).json({ error: "Failed to start session" });
  }
}

export async function completeSession(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const { sessionId } = req.params;
    const { score, durationSeconds, result, gameSlug } = req.body;

    if (sessionId.startsWith("guest-")) {
      return res.json({ message: "Guest session finished", pointsEarned: 0 });
    }

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const session = await db.gameSession.findUnique({
      where: { id: sessionId },
      include: { game: true },
    });

    if (!session) return res.status(404).json({ error: "Session not found" });

    // Anti-cheat limit checks (Server validation!)
    if (durationSeconds && durationSeconds < 2) {
      return res.status(400).json({ error: "Completion time violates server security threshold" });
    }

    // Points calculation: Base 10 + score/20
    const pointsEarned = 10 + Math.min(Math.floor((score || 0) / 20), 200);

    await db.gameSession.update({
      where: { id: sessionId },
      data: {
        score: score || 0,
        durationSeconds: durationSeconds || 10,
        result: result || "COMPLETED",
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    await db.gameScore.create({
      data: {
        userId,
        gameId: session.gameId,
        gameSessionId: session.id,
        score: score || 0,
        pointsEarned,
      },
    });

    // Record immutable ledger transaction
    await db.pointTransaction.create({
      data: {
        userId,
        amount: pointsEarned,
        type: "GAME_PLAY",
        description: `Completed match in ${session.game.name}`,
        referenceId: sessionId,
      },
    });

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { virtualPoints: { increment: pointsEarned } },
      select: { virtualPoints: true, username: true, profile: true },
    });

    // Update Leaderboard entry
    await db.leaderboardEntry.upsert({
      where: { id: `global-${userId}` },
      update: {
        score: { increment: score || 0 },
        points: updatedUser.virtualPoints,
        username: updatedUser.username,
      },
      create: {
        id: `global-${userId}`,
        userId,
        username: updatedUser.username,
        avatarUrl: updatedUser.profile?.avatarUrl || "/avatars/avatar-1.png",
        gameSlug: "global",
        type: "GLOBAL",
        period: "ALL_TIME",
        score: score || 0,
        points: updatedUser.virtualPoints,
      },
    });

    return res.json({
      message: "Score saved successfully!",
      pointsEarned,
      newTotalPoints: updatedUser.virtualPoints,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to complete session" });
  }
}
