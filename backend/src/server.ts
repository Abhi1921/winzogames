import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import authRoutes from "./modules/auth/routes";
import gamesRoutes from "./modules/games/routes";
import leaderboardRoutes from "./modules/leaderboard/routes";
import achievementsRoutes from "./modules/achievements/routes";
import usersRoutes from "./modules/users/routes";
import adminRoutes from "./modules/admin/routes";
import { initializeSockets } from "./sockets/socketHandler";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Express Middleware
app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());

// Simple Cookie Parser middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const cookieHeader = req.headers.cookie;
  const cookies: Record<string, string> = {};
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      cookies[parts[0].trim()] = decodeURIComponent(parts[1]);
    });
  }
  req.cookies = cookies;
  next();
});

// REST API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/leaderboards", leaderboardRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);

// Health Endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Socket.IO Server
const io = new Server(server, {
  cors: {
    origin: [CLIENT_URL, "http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  },
});

initializeSockets(io);

server.listen(PORT, () => {
  console.log(`🚀 WinzoGames Express Backend & Socket.IO server running on port ${PORT}`);
});
