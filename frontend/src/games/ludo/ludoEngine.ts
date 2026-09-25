export type PlayerColor = "red" | "green" | "yellow" | "blue";

export interface LudoToken {
  id: number; // 0, 1, 2, 3
  color: PlayerColor;
  position: number; // -1 = Yard, 0..51 = Main Track, 100..105 = Home Stretch, 999 = Finished Goal
  stepCount: number; // 0 to 57
}

export interface LudoPlayer {
  id: string;
  name: string;
  color: PlayerColor;
  isAi: boolean;
  tokens: LudoToken[];
  hasFinished: boolean;
  tokensHome: number;
}

export interface LudoRulesConfig {
  requireSixToEnter: boolean;
  sixBonusTurn: boolean;
  captureBonusTurn: boolean;
  exactFinish: boolean;
  consecutiveSixLimit: number;
  safeSquares: number[];
}

export const LUDO_RULES_CONFIG: LudoRulesConfig = {
  requireSixToEnter: true,
  sixBonusTurn: true,
  captureBonusTurn: true,
  exactFinish: true,
  consecutiveSixLimit: 3,
  safeSquares: [0, 8, 13, 21, 26, 34, 39, 47],
};

export interface LocalLudoState {
  players: LudoPlayer[];
  currentTurnIndex: number;
  currentDiceValue: number | null;
  hasRolledDice: boolean;
  consecutiveSixes: number;
  status: "INITIAL" | "PLAYING" | "FINISHED";
  winner: LudoPlayer | null;
  log: string;
  rules: LudoRulesConfig;
}

// Starting track offset index for each color
export const COLOR_START_TRACK_INDEX: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

export function createInitialLocalLudoState(
  mode: "VS_AI" | "LOCAL_2P" | "LOCAL_3P" | "LOCAL_4P",
  aiDifficulty: "EASY" | "MEDIUM" | "HARD" = "MEDIUM"
): LocalLudoState {
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
      { name: "Player 2 (Green)", color: "green", isAi: false },
      { name: "Player 3 (Yellow)", color: "yellow", isAi: false },
      { name: "Player 4 (Blue)", color: "blue", isAi: false },
    ];
  }

  const players: LudoPlayer[] = playerConfigs.map((cfg, idx) => ({
    id: `p_${idx}`,
    name: cfg.name,
    color: cfg.color,
    isAi: cfg.isAi,
    hasFinished: false,
    tokensHome: 0,
    tokens: [0, 1, 2, 3].map((tId) => ({
      id: tId,
      color: cfg.color,
      position: -1,
      stepCount: 0,
    })),
  }));

  return {
    players,
    currentTurnIndex: 0,
    currentDiceValue: null,
    hasRolledDice: false,
    consecutiveSixes: 0,
    status: "PLAYING",
    winner: null,
    log: `Match started! ${players[0].name}'s turn.`,
    rules: LUDO_RULES_CONFIG,
  };
}

// Convert step count to track position
export function getAbsoluteTrackPosition(color: PlayerColor, stepCount: number): number {
  if (stepCount === 0) return -1; // Yard
  if (stepCount > 51 && stepCount < 57) {
    return 100 + (stepCount - 52); // Home Stretch (100..104)
  }
  if (stepCount === 57) return 999; // Finished Goal

  const startOffset = COLOR_START_TRACK_INDEX[color];
  return (startOffset + (stepCount - 1)) % 52;
}

// Check legal move
export function isMoveLegal(token: LudoToken, dice: number, rules = LUDO_RULES_CONFIG): boolean {
  if (token.position === 999) return false;
  if (token.position === -1) {
    return rules.requireSixToEnter ? dice === 6 : true;
  }
  return token.stepCount + dice <= 57; // Exact finish validation
}

// Execute move locally with capture detection & 6-bonus handling
export function executeLocalMove(
  state: LocalLudoState,
  tokenId: number
): { newState: LocalLudoState; captured: boolean; extraTurn: boolean } {
  const newState = { ...state };
  const currentPlayer = newState.players[newState.currentTurnIndex];
  const token = currentPlayer.tokens.find((t) => t.id === tokenId);
  const dice = newState.currentDiceValue;

  if (!token || !dice || !isMoveLegal(token, dice, newState.rules)) {
    return { newState: state, captured: false, extraTurn: false };
  }

  let captured = false;
  let extraTurn = newState.rules.sixBonusTurn && dice === 6;

  if (token.position === -1) {
    // Exit yard to start position
    token.stepCount = 1;
    token.position = COLOR_START_TRACK_INDEX[token.color];
    newState.log = `${currentPlayer.name} brought token ${tokenId + 1} onto the board!`;
  } else {
    // Move along track
    const newStepCount = token.stepCount + dice;
    token.stepCount = newStepCount;
    token.position = getAbsoluteTrackPosition(token.color, newStepCount);

    if (token.position === 999) {
      currentPlayer.tokensHome += 1;
      newState.log = `🏁 ${currentPlayer.name}'s token reached Home Goal!`;
      extraTurn = true; // Bonus turn for completing token!
    } else {
      newState.log = `${currentPlayer.name} moved token ${tokenId + 1} by ${dice} steps.`;
    }

    // Token Capture Logic (if not on safe square)
    const isSafe = newState.rules.safeSquares.includes(token.position);
    if (token.position >= 0 && token.position < 52 && !isSafe) {
      for (const opp of newState.players) {
        if (opp.color === currentPlayer.color) continue;
        for (const oppT of opp.tokens) {
          if (oppT.position === token.position) {
            // Captured! Send back to yard
            oppT.position = -1;
            oppT.stepCount = 0;
            captured = true;
            if (newState.rules.captureBonusTurn) extraTurn = true;
            newState.log = `💥 ${currentPlayer.name} captured ${opp.name}'s token!`;
          }
        }
      }
    }
  }

  // Check Victory Condition
  if (currentPlayer.tokens.every((t) => t.position === 999)) {
    currentPlayer.hasFinished = true;
    newState.winner = currentPlayer;
    newState.status = "FINISHED";
    newState.log = `🏆 ${currentPlayer.name} WINS THE LUDO MATCH!`;
    return { newState, captured, extraTurn: false };
  }

  // Reset dice state
  newState.hasRolledDice = false;
  newState.currentDiceValue = null;

  // Turn Rotation
  if (!extraTurn) {
    newState.consecutiveSixes = 0;
    newState.currentTurnIndex = (newState.currentTurnIndex + 1) % newState.players.length;
  } else {
    newState.log += " Extra Turn!";
  }

  return { newState, captured, extraTurn };
}
