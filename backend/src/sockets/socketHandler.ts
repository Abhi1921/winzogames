import { Server, Socket } from "socket.io";
import { LudoRoomManager } from "./ludoEngine";

export function initializeSockets(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Socket Client Connected: ${socket.id}`);

    // 1. Create Ludo Room
    socket.on("room:create", (payload: { userId: string; username: string }, callback) => {
      const roomId = `LUDO-${Math.floor(1000 + Math.random() * 9000)}`;
      const roomState = LudoRoomManager.createRoom(roomId, payload.userId, payload.username, socket.id);
      socket.join(roomId);
      if (typeof callback === "function") callback({ success: true, roomId, state: roomState });
      io.to(roomId).emit("game:state", roomState);
    });

    // 2. Join Ludo Room
    socket.on("room:join", (payload: { roomId: string; userId: string; username: string }, callback) => {
      const roomState = LudoRoomManager.joinRoom(payload.roomId, payload.userId, payload.username, socket.id);
      if (!roomState) {
        if (typeof callback === "function") callback({ success: false, error: "Room full or not found" });
        return;
      }
      socket.join(payload.roomId);
      if (typeof callback === "function") callback({ success: true, state: roomState });
      io.to(payload.roomId).emit("game:state", roomState);
    });

    // 3. Start Ludo Match
    socket.on("game:start", (payload: { roomId: string; userId: string }) => {
      const roomState = LudoRoomManager.startGame(payload.roomId, payload.userId);
      if (roomState) {
        io.to(payload.roomId).emit("game:state", roomState);
      }
    });

    // 4. Server-Authoritative Dice Roll
    socket.on("game:dice", (payload: { roomId: string; userId: string }) => {
      const result = LudoRoomManager.rollDice(payload.roomId, payload.userId);
      if (result) {
        io.to(payload.roomId).emit("game:dice_rolled", {
          diceValue: result.diceValue,
          userId: payload.userId,
        });
        io.to(payload.roomId).emit("game:state", result.state);
      }
    });

    // 5. Server-Authoritative Token Move Execution
    socket.on("game:move", (payload: { roomId: string; userId: string; tokenId: number }) => {
      const roomState = LudoRoomManager.moveToken(payload.roomId, payload.userId, payload.tokenId);
      if (roomState) {
        io.to(payload.roomId).emit("game:state", roomState);
      }
    });

    // Disconnect Handler
    socket.on("disconnect", () => {
      console.log(`❌ Socket Client Disconnected: ${socket.id}`);
      LudoRoomManager.handleDisconnect(socket.id);
    });
  });
}
