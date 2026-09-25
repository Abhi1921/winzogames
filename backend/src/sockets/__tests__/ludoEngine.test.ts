import { describe, it, expect } from "vitest";
import { LudoRoomManager } from "../ludoEngine";

describe("Authoritative Ludo Engine Tests", () => {
  it("should create a new room with custom ID", () => {
    const room = LudoRoomManager.createRoom("TEST01", "p1", "Player One", "socket_1");
    expect(room).toBeDefined();
    expect(room.roomId).toBe("TEST01");
    expect(room.players.length).toBe(1);
    expect(room.players[0].username).toBe("Player One");
  });

  it("should allow a second player to join and start game", () => {
    const room = LudoRoomManager.joinRoom("TEST01", "p2", "Player Two", "socket_2");
    expect(room).toBeDefined();
    expect(room?.players.length).toBe(2);

    const startedRoom = LudoRoomManager.startGame("TEST01", "p1");
    expect(startedRoom?.status).toBe("PLAYING");
  });

  it("should roll dice authoritatively on server", () => {
    const diceResult = LudoRoomManager.rollDice("TEST01", "p1");
    expect(diceResult).toBeDefined();
    expect(diceResult?.diceValue).toBeGreaterThanOrEqual(1);
    expect(diceResult?.diceValue).toBeLessThanOrEqual(6);
  });
});
