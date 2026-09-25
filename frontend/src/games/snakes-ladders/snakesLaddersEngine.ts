export type PlayerColor = "red" | "blue" | "green" | "yellow";

export interface SnakeOrLadder {
  start: number;
  end: number;
  type: "SNAKE" | "LADDER";
}

export const GAME_LADDERS: SnakeOrLadder[] = [
  { start: 4, end: 25, type: "LADDER" },
  { start: 13, end: 46, type: "LADDER" },
  { start: 33, end: 64, type: "LADDER" },
  { start: 50, end: 69, type: "LADDER" },
  { start: 62, end: 81, type: "LADDER" },
  { start: 74, end: 92, type: "LADDER" },
];

export const GAME_SNAKES: SnakeOrLadder[] = [
  { start: 27, end: 5, type: "SNAKE" },
  { start: 43, end: 18, type: "SNAKE" },
  { start: 66, end: 45, type: "SNAKE" },
  { start: 76, end: 58, type: "SNAKE" },
  { start: 89, end: 53, type: "SNAKE" },
  { start: 99, end: 41, type: "SNAKE" },
];

export interface SLPlayer {
  id: string;
  name: string;
  color: PlayerColor;
  isAi: boolean;
  position: number; // 1 to 100
}

export interface LocalSLState {
  players: SLPlayer[];
  currentTurnIndex: number;
  currentDiceValue: number | null;
  hasRolledDice: boolean;
  status: "INITIAL" | "PLAYING" | "FINISHED";
  winner: SLPlayer | null;
  log: string;
}

export function createInitialSLState(
  mode: "VS_AI" | "LOCAL_2P" | "LOCAL_3P" | "LOCAL_4P",
  aiDifficulty: "EASY" | "MEDIUM" | "HARD" = "MEDIUM"
): LocalSLState {
  let playerConfigs: { name: string; color: PlayerColor; isAi: boolean }[] = [];

  if (mode === "VS_AI") {
    playerConfigs = [
      { name: "You (Red)", color: "red", isAi: false },
      { name: `Computer (${aiDifficulty})`, color: "yellow", isAi: true },
    ];
  } else if (mode === "LOCAL_2P") {
    playerConfigs = [
      { name: "Player 1 (Red)", color: "red", isAi: false },
      { name: "Player 2 (Yellow)", color: "yellow", isAi: false },
    ];
  } else if (mode === "LOCAL_3P") {
    playerConfigs = [
      { name: "Player 1 (Red)", color: "red", isAi: false },
      { name: "Player 2 (Green)", color: "green", isAi: false },
      { name: "Player 3 (Yellow)", color: "yellow", isAi: false },
    ];
  } else {
    // LOCAL_4P
    playerConfigs = [
      { name: "Player 1 (Red)", color: "red", isAi: false },
      { name: "Player 2 (Blue)", color: "blue", isAi: false },
      { name: "Player 3 (Green)", color: "green", isAi: false },
      { name: "Player 4 (Yellow)", color: "yellow", isAi: false },
    ];
  }

  const players: SLPlayer[] = playerConfigs.map((cfg, idx) => ({
    id: `sl_${idx}`,
    name: cfg.name,
    color: cfg.color,
    isAi: cfg.isAi,
    position: 1, // Start at Square 1
  }));

  return {
    players,
    currentTurnIndex: 0,
    currentDiceValue: null,
    hasRolledDice: false,
    status: "PLAYING",
    winner: null,
    log: `Game started! ${players[0].name}'s turn.`,
  };
}

// Convert 1-100 cell number to 10x10 row, column index
export function getCellRowCol(num: number): { r: number; c: number } {
  const index = num - 1;
  const r = 9 - Math.floor(index / 10);
  const isReverseRow = Math.floor(index / 10) % 2 === 1;
  const c = isReverseRow ? 9 - (index % 10) : index % 10;
  return { r, c };
}

// Execute move step by step
export function executeSLMove(state: LocalSLState, dice: number): LocalSLState {
  const newState = { ...state };
  const player = newState.players[newState.currentTurnIndex];

  let targetPos = player.position + dice;

  // Exact finish rule (cannot overshoot 100)
  if (targetPos > 100) {
    newState.log = `${player.name} rolled ${dice} (requires exact roll to reach 100).`;
    newState.currentTurnIndex = (newState.currentTurnIndex + 1) % newState.players.length;
    newState.hasRolledDice = false;
    newState.currentDiceValue = null;
    return newState;
  }

  // Check Ladder Climb or Snake Slide
  const ladder = GAME_LADDERS.find((l) => l.start === targetPos);
  const snake = GAME_SNAKES.find((s) => s.start === targetPos);

  if (ladder) {
    targetPos = ladder.end;
    newState.log = `🪜 ${player.name} climbed a ladder to square ${targetPos}!`;
  } else if (snake) {
    targetPos = snake.end;
    newState.log = `🐍 ${player.name} was swallowed by a snake down to square ${targetPos}!`;
  } else {
    newState.log = `${player.name} moved to square ${targetPos}.`;
  }

  player.position = targetPos;

  // Victory Check
  if (player.position === 100) {
    newState.winner = player;
    newState.status = "FINISHED";
    newState.log = `🏆 ${player.name} REACHED 100 AND WON THE MATCH!`;
    return newState;
  }

  // Bonus turn on 6
  if (dice === 6) {
    newState.log += " Rolled a 6: Extra turn!";
  } else {
    newState.currentTurnIndex = (newState.currentTurnIndex + 1) % newState.players.length;
  }

  newState.hasRolledDice = false;
  newState.currentDiceValue = null;
  return newState;
}
