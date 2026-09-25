import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../config/db";
import { AuthRequest } from "../../middleware/auth";

const JWT_SECRET = process.env.JWT_SECRET || "winzogames-jwt-super-secret-production-key-2026";

export async function register(req: Request, res: Response) {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const existing = await db.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
      },
    });

    if (existing) {
      return res.status(400).json({ error: "Email or Username already taken" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        fullName,
        username,
        email: email.toLowerCase(),
        passwordHash,
        virtualPoints: 500, // Welcome Bonus
        profile: {
          create: {
            avatarUrl: `/avatars/avatar-${Math.floor(Math.random() * 6) + 1}.png`,
            bio: "Casual gamer on WinzoGames!",
          },
        },
      },
      include: { profile: true },
    });

    // Record welcome bonus transaction
    await db.pointTransaction.create({
      data: {
        userId: user.id,
        amount: 500,
        type: "WELCOME_BONUS",
        description: "Welcome bonus upon registration",
      },
    });

    // Add to default global leaderboard
    await db.leaderboardEntry.create({
      data: {
        userId: user.id,
        username: user.username,
        avatarUrl: user.profile?.avatarUrl || "/avatars/avatar-1.png",
        gameSlug: "global",
        type: "GLOBAL",
        period: "ALL_TIME",
        score: 500,
        points: 500,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("winzo_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        virtualPoints: user.virtualPoints,
        profile: user.profile,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to register account" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: "Credentials required" });
    }

    const query = emailOrUsername.toLowerCase();
    const user = await db.user.findFirst({
      where: {
        OR: [{ email: query }, { username: query }],
      },
      include: { profile: true },
    });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    if (user.status === "SUSPENDED") return res.status(403).json({ error: "Account suspended" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("winzo_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        virtualPoints: user.virtualPoints,
        profile: user.profile,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Authentication failed" });
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ user: null });

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) return res.status(401).json({ user: null });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        virtualPoints: user.virtualPoints,
        currentStreak: user.currentStreak,
        profile: user.profile,
      },
    });
  } catch {
    return res.status(401).json({ user: null });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("winzo_session");
  return res.json({ message: "Logged out" });
}
