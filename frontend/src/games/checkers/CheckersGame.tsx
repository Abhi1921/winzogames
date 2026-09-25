import React, { useState, useEffect } from "react";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { soundManager } from "../../components/games/shell/SoundManager";
import { Crown, Bot, User } from "lucide-react";

interface Piece {
  player: "RED" | "BLACK";
  isKing: boolean;
}

export function CheckersGame() {
  const [board, setBoard] = useState<(Piece | null)[][]>([]);
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [isRedTurn, setIsRedTurn] = useState(true);
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [gameResult, setGameResult] = useState<"WIN" | "LOSS">("WIN");

  const initBoard = () => {
    const b: (Piece | null)[][] = Array.from({ length: 8 }, () => Array(8).fill(null));
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) {
          if (r < 3) b[r][c] = { player: "BLACK", isKing: false };
          if (r > 4) b[r][c] = { player: "RED", isKing: false };
        }
      }
    }
    return b;
  };

  const startNewGame = () => {
    setIsCountingDown(true);
    setIsResultOpen(false);
  };

  const handleCountdownComplete = () => {
    setBoard(initBoard());
    setSelected(null);
    setIsRedTurn(true);
    setIsCountingDown(false);
    setIsPlaying(true);
  };

  const handleCellClick = (r: number, c: number) => {
    if (!isPlaying || !isRedTurn) return;

    if (selected) {
      if (selected.r === r && selected.c === c) {
        setSelected(null);
        return;
      }
      // Attempt move from selected to (r, c)
      if (executeMove(selected.r, selected.c, r, c, "RED")) {
        setSelected(null);
        return;
      }
    }

    const piece = board[r]?.[c];
    if (piece && piece.player === "RED") {
      soundManager.play("click");
      setSelected({ r, c });
    }
  };

  const executeMove = (fromR: number, fromC: number, toR: number, toC: number, player: "RED" | "BLACK"): boolean => {
    const piece = board[fromR][fromC];
    if (!piece || piece.player !== player || board[toR][toC] !== null) return false;

    const rowDiff = toR - fromR;
    const colDiff = Math.abs(toC - fromC);

    const isForward = player === "RED" ? rowDiff < 0 : rowDiff > 0;
    if (!piece.isKing && !isForward) return false;

    // Normal Step
    if (Math.abs(rowDiff) === 1 && colDiff === 1) {
      soundManager.play("move");
      const newBoard = board.map((row) => [...row]);
      newBoard[toR][toC] = piece;
      newBoard[fromR][fromC] = null;

      // King Promotion Check
      if ((player === "RED" && toR === 0) || (player === "BLACK" && toR === 7)) {
        newBoard[toR][toC]!.isKing = true;
      }

      setBoard(newBoard);
      setIsRedTurn(player !== "RED");
      return true;
    }

    // Jump Capture
    if (Math.abs(rowDiff) === 2 && colDiff === 2) {
      const midR = (fromR + toR) / 2;
      const midC = (fromC + toC) / 2;
      const midPiece = board[midR][midC];

      if (midPiece && midPiece.player !== player) {
        soundManager.play("capture");
        const newBoard = board.map((row) => [...row]);
        newBoard[toR][toC] = piece;
        newBoard[fromR][fromC] = null;
        newBoard[midR][midC] = null; // Remove captured piece

        // King Promotion Check
        if ((player === "RED" && toR === 0) || (player === "BLACK" && toR === 7)) {
          newBoard[toR][toC]!.isKing = true;
        }

        setBoard(newBoard);

        // Check Victory
        const remainingOpp = newBoard.flat().filter((p) => p && p.player !== player).length;
        if (remainingOpp === 0) {
          soundManager.play(player === "RED" ? "win" : "lose");
          setIsPlaying(false);
          setGameResult(player === "RED" ? "WIN" : "LOSS");
          setIsResultOpen(true);
        }

        setIsRedTurn(player !== "RED");
        return true;
      }
    }

    return false;
  };

  // AI Turn for Black
  useEffect(() => {
    if (!isPlaying || isRedTurn) return;

    const timer = setTimeout(() => {
      const blackPieces: { r: number; c: number }[] = [];
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (board[r][c]?.player === "BLACK") blackPieces.push({ r, c });
        }
      }

      // Try random legal move for AI
      for (const p of blackPieces.sort(() => Math.random() - 0.5)) {
        const moves = [
          { r: p.r + 1, c: p.c - 1 },
          { r: p.r + 1, c: p.c + 1 },
          { r: p.r + 2, c: p.c - 2 },
          { r: p.r + 2, c: p.c + 2 },
        ];
        for (const m of moves) {
          if (m.r >= 0 && m.r < 8 && m.c >= 0 && m.c < 8) {
            if (executeMove(p.r, p.c, m.r, m.c, "BLACK")) return;
          }
        }
      }
      setIsRedTurn(true);
    }, 700);

    return () => clearTimeout(timer);
  }, [isRedTurn, isPlaying, board]);

  return (
    <div className="w-full flex flex-col min-h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative select-none">
      <GameHeader
        title="Checkers Masters"
        category="Board Games"
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onRestart={startNewGame}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="Checkers Masters" onComplete={handleCountdownComplete} />
      )}

      {!isPlaying && !isCountingDown && !isResultOpen ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-sm mx-auto text-center">
          <h3 className="font-display font-black text-3xl text-amber-400">Checkers Masters</h3>
          <p className="text-xs text-slate-400">Capture opponent pieces diagonally and promote your pieces to Kings!</p>
          <button
            onClick={startNewGame}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            START CHECKERS
          </button>
        </div>
      ) : (
        <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-4">
          <div className="grid grid-cols-8 grid-rows-8 gap-0.5 bg-slate-900 border-4 border-slate-800 rounded-2xl p-2 shadow-2xl w-full max-w-md aspect-square">
            {board.map((row, r) =>
              row.map((cell, c) => {
                const isDarkSquare = (r + c) % 2 === 1;
                const isSelected = selected?.r === r && selected?.c === c;

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`flex items-center justify-center cursor-pointer transition-all ${
                      isDarkSquare ? "bg-amber-950/80" : "bg-amber-100"
                    } ${isSelected ? "ring-4 ring-cyan-400 z-10" : ""}`}
                  >
                    {cell && (
                      <div
                        className={`w-4/5 h-4/5 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform ${
                          cell.player === "RED"
                            ? "bg-gradient-to-tr from-red-700 via-red-500 to-red-300 border-red-200"
                            : "bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-500 border-slate-400"
                        }`}
                      >
                        {cell.isKing && <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result={gameResult}
        score={gameResult === "WIN" ? 1000 : 250}
        virtualPointsEarned={35}
        onPlayAgain={startNewGame}
      />
    </div>
  );
}
