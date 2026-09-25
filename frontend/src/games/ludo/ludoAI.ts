import { LocalLudoState, LudoToken, isMoveLegal, getAbsoluteTrackPosition } from "./ludoEngine";

export function getAiBestMoveTokenId(
  state: LocalLudoState,
  difficulty: "EASY" | "MEDIUM" | "HARD"
): number | null {
  const currentPlayer = state.players[state.currentTurnIndex];
  const dice = state.currentDiceValue;
  if (!currentPlayer || !dice || !state.hasRolledDice) return null;

  // Filter legal tokens
  const legalTokens = currentPlayer.tokens.filter((t) => isMoveLegal(t, dice, state.rules));
  if (legalTokens.length === 0) return null;
  if (legalTokens.length === 1) return legalTokens[0].id;

  // EASY MODE: Pick random move
  if (difficulty === "EASY") {
    const randomIndex = Math.floor(Math.random() * legalTokens.length);
    return legalTokens[randomIndex].id;
  }

  // MEDIUM & HARD MODE: Score candidate moves
  let bestToken: LudoToken = legalTokens[0];
  let bestScore = -9999;

  for (const token of legalTokens) {
    let score = 0;
    const currentPos = token.position;
    const nextStep = token.stepCount + dice;
    const nextPos = getAbsoluteTrackPosition(token.color, nextStep);

    // 1. Goal move (+100)
    if (nextPos === 999) score += 100;

    // 2. Bringing token out of yard on 6 (+80)
    if (currentPos === -1 && dice === 6) score += 80;

    // 3. Capturing Opponent Token (+90)
    const isSafe = state.rules.safeSquares.includes(nextPos);
    if (nextPos >= 0 && nextPos < 52 && !isSafe) {
      for (const opp of state.players) {
        if (opp.color === currentPlayer.color) continue;
        for (const oppT of opp.tokens) {
          if (oppT.position === nextPos) score += 90;
        }
      }
    }

    // 4. Moving to Safe Spot (+40)
    if (isSafe) score += 40;

    // 5. Hard Mode: Risk avoidance & positional advantage
    if (difficulty === "HARD") {
      // Avoid landing near opponent within 6 steps behind
      for (const opp of state.players) {
        if (opp.color === currentPlayer.color) continue;
        for (const oppT of opp.tokens) {
          if (oppT.position >= 0 && oppT.position < 52) {
            const distance = (nextPos - oppT.position + 52) % 52;
            if (distance > 0 && distance <= 6 && !isSafe) {
              score -= 30; // Danger of being captured!
            }
          }
        }
      }

      // Reward further progress along track
      score += nextStep * 2;
    }

    if (score > bestScore) {
      bestScore = score;
      bestToken = token;
    }
  }

  return bestToken.id;
}
