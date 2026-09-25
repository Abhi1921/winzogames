export interface TokenState {
  id: number; // 0, 1, 2, 3
  position: number; // -1 = Home Yard, 0..51 = Main Track, 100..105 = Home Stretch, 999 = Finished Home
  stepCount: number; // 0 to 57
}

export interface PlayerState {
  userId: string;
  username: string;
  color: "red" | "green" | "yellow" | "blue";
  socketId: string;
  isHost: boolean;
  isConnected: boolean;
  tokens: TokenState[];
  hasFinished: boolean;
}

export interface LudoGameState {
  roomId: string;
  status: "WAITING" | "PLAYING" | "FINISHED";
  players: PlayerState[];
  currentTurnIndex: number;
  currentDiceValue: number | null;
  hasRolledDice: boolean;
  canRollAgain: boolean;
  winnerUserId: string | null;
  lastActionLog: string;
  turnTimeoutSeconds: number;
}

export class LudoRoomManager {
  private static rooms: Map<string, LudoGameState> = new Map();

  public static createRoom(roomId: string, hostUserId: string, hostUsername: string, hostSocketId: string): LudoGameState {
    const initialState: LudoGameState = {
      roomId,
      status: "WAITING",
      players: [
        {
          userId: hostUserId,
          username: hostUsername,
          color: "red",
          socketId: hostSocketId,
          isHost: true,
          isConnected: true,
          tokens: [
            { id: 0, position: -1, stepCount: 0 },
            { id: 1, position: -1, stepCount: 0 },
            { id: 2, position: -1, stepCount: 0 },
            { id: 3, position: -1, stepCount: 0 },
          ],
          hasFinished: false,
        },
      ],
      currentTurnIndex: 0,
      currentDiceValue: null,
      hasRolledDice: false,
      canRollAgain: false,
      winnerUserId: null,
      lastActionLog: `Room ${roomId} created by ${hostUsername}`,
      turnTimeoutSeconds: 30,
    };

    this.rooms.set(roomId, initialState);
    return initialState;
  }

  public static getRoom(roomId: string): LudoGameState | undefined {
    return this.rooms.get(roomId);
  }

  public static joinRoom(roomId: string, userId: string, username: string, socketId: string): LudoGameState | null {
    const state = this.rooms.get(roomId);
    if (!state) return null;

    // Check if player rejoining
    const existing = state.players.find((p) => p.userId === userId);
    if (existing) {
      existing.socketId = socketId;
      existing.isConnected = true;
      state.lastActionLog = `${username} reconnected to room`;
      return state;
    }

    if (state.players.length >= 4 || state.status !== "WAITING") return null;

    const colors: ("red" | "green" | "yellow" | "blue")[] = ["red", "green", "yellow", "blue"];
    const assignedColor = colors[state.players.length];

    state.players.push({
      userId,
      username,
      color: assignedColor,
      socketId,
      isHost: false,
      isConnected: true,
      tokens: [
        { id: 0, position: -1, stepCount: 0 },
        { id: 1, position: -1, stepCount: 0 },
        { id: 2, position: -1, stepCount: 0 },
        { id: 3, position: -1, stepCount: 0 },
      ],
      hasFinished: false,
    });

    state.lastActionLog = `${username} joined room as ${assignedColor.toUpperCase()}`;
    return state;
  }

  public static startGame(roomId: string, hostUserId: string): LudoGameState | null {
    const state = this.rooms.get(roomId);
    if (!state || state.players[0].userId !== hostUserId || state.players.length < 2) return null;

    state.status = "PLAYING";
    state.currentTurnIndex = 0;
    state.lastActionLog = "Game started! Red player's turn.";
    return state;
  }

  // Authoritative Dice Roll (Server Random 1-6)
  public static rollDice(roomId: string, userId: string): { state: LudoGameState; diceValue: number } | null {
    const state = this.rooms.get(roomId);
    if (!state || state.status !== "PLAYING") return null;

    const currentPlayer = state.players[state.currentTurnIndex];
    if (currentPlayer.userId !== userId || state.hasRolledDice) return null;

    const diceValue = Math.floor(Math.random() * 6) + 1; // Server random 1..6
    state.currentDiceValue = diceValue;
    state.hasRolledDice = true;
    state.lastActionLog = `${currentPlayer.username} rolled a ${diceValue}!`;

    // Check if player has any valid moves
    const hasValidMove = this.checkValidMoves(currentPlayer, diceValue);
    if (!hasValidMove && diceValue !== 6) {
      // Pass turn to next player after brief delay
      state.lastActionLog = `${currentPlayer.username} rolled ${diceValue} (no valid move). Next turn.`;
      state.hasRolledDice = false;
      state.currentDiceValue = null;
      state.currentTurnIndex = (state.currentTurnIndex + 1) % state.players.length;
    }

    return { state, diceValue };
  }

  // Authoritative Token Move Validation & Execution
  public static moveToken(roomId: string, userId: string, tokenId: number): LudoGameState | null {
    const state = this.rooms.get(roomId);
    if (!state || state.status !== "PLAYING" || !state.hasRolledDice || !state.currentDiceValue) return null;

    const currentPlayer = state.players[state.currentTurnIndex];
    if (currentPlayer.userId !== userId) return null;

    const token = currentPlayer.tokens.find((t) => t.id === tokenId);
    if (!token) return null;

    const dice = state.currentDiceValue;

    // Rule 1: Token in yard requires 6 to get out
    if (token.position === -1) {
      if (dice !== 6) return null;
      token.position = 0; // Starts at main track index 0 for its relative color
      token.stepCount = 0;
      state.lastActionLog = `${currentPlayer.username} brought token ${tokenId + 1} out of home yard!`;
    } else {
      // Rule 2: Token movement along track
      const newStepCount = token.stepCount + dice;
      if (newStepCount > 57) return null; // Cannot overshoot home goal

      token.stepCount = newStepCount;

      if (newStepCount === 57) {
        token.position = 999; // Finished home!
        state.lastActionLog = `${currentPlayer.username}'s token ${tokenId + 1} reached Home Goal! 🏁`;
      } else {
        token.position = (token.position + dice) % 52;
        state.lastActionLog = `${currentPlayer.username} moved token ${tokenId + 1} by ${dice} steps.`;
      }
    }

    // Check Victory condition (All 4 tokens reached home)
    if (currentPlayer.tokens.every((t) => t.position === 999)) {
      currentPlayer.hasFinished = true;
      state.winnerUserId = currentPlayer.userId;
      state.status = "FINISHED";
      state.lastActionLog = `🏆 ${currentPlayer.username} WON THE LUDO MATCH!`;
      return state;
    }

    // Reset turn flags
    state.hasRolledDice = false;
    state.currentDiceValue = null;

    // Rule 3: Extra turn on 6
    if (dice === 6) {
      state.lastActionLog += " Rolled 6: Extra turn!";
    } else {
      state.currentTurnIndex = (state.currentTurnIndex + 1) % state.players.length;
    }

    return state;
  }

  private static checkValidMoves(player: PlayerState, dice: number): boolean {
    return player.tokens.some((token) => {
      if (token.position === -1) return dice === 6;
      if (token.position === 999) return false;
      return token.stepCount + dice <= 57;
    });
  }

  public static handleDisconnect(socketId: string) {
    for (const [roomId, state] of this.rooms.entries()) {
      const player = state.players.find((p) => p.socketId === socketId);
      if (player) {
        player.isConnected = false;
        state.lastActionLog = `${player.username} disconnected. Waiting for reconnect...`;
      }
    }
  }
}
