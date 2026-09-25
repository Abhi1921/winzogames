import React, { useState, useEffect } from "react";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { soundManager } from "../../components/games/shell/SoundManager";
import { Bot, User, X, Circle } from "lucide-react";

export function TicTacToeGame() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [mode, setMode] = useState<"VS_AI" | "LOCAL_2P">("VS_AI");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("HARD");
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [gameResult, setGameResult] = useState<"WIN" | "LOSS" | "DRAW">("WIN");

  const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  const startNewGame = () => {
    setIsCountingDown(true);
    setIsResultOpen(false);
  };

  const handleCountdownComplete = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinningLine(null);
    setIsCountingDown(false);
    setIsPlaying(true);
  };

  const handleCellClick = (index: number) => {
    if (!isPlaying || board[index] || (mode === "VS_AI" && !isXNext)) return;

    soundManager.play("move");
    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    const winCombo = checkWin(newBoard, "X");
    if (winCombo) {
      setWinningLine(winCombo);
      soundManager.play("win");
      setIsPlaying(false);
      setGameResult("WIN");
      setIsResultOpen(true);
      return;
    }

    if (newBoard.every((cell) => cell !== null)) {
      setIsPlaying(false);
      setGameResult("DRAW");
      setIsResultOpen(true);
      return;
    }

    setIsXNext(false);
  };

  // Minimax AI Turn for O
  useEffect(() => {
    if (!isPlaying || isXNext || mode !== "VS_AI") return;

    const timer = setTimeout(() => {
      let aiIndex: number;
      if (difficulty === "EASY") {
        const available = board.map((v, i) => (v === null ? i : null)).filter((v) => v !== null) as number[];
        aiIndex = available[Math.floor(Math.random() * available.length)];
      } else {
        aiIndex = getBestMinimaxMove(board);
      }

      if (typeof aiIndex === "number" && aiIndex >= 0) {
        soundManager.play("move");
        const newBoard = [...board];
        newBoard[aiIndex] = "O";
        setBoard(newBoard);

        const winCombo = checkWin(newBoard, "O");
        if (winCombo) {
          setWinningLine(winCombo);
          soundManager.play("lose");
          setIsPlaying(false);
          setGameResult("LOSS");
          setIsResultOpen(true);
          return;
        }

        if (newBoard.every((cell) => cell !== null)) {
          setIsPlaying(false);
          setGameResult("DRAW");
          setIsResultOpen(true);
          return;
        }
      }

      setIsXNext(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [isXNext, isPlaying, board, mode, difficulty]);

  const checkWin = (b: (string | null)[], player: string): number[] | null => {
    for (const combo of WINNING_COMBOS) {
      if (combo.every((idx) => b[idx] === player)) return combo;
    }
    return null;
  };

  const getBestMinimaxMove = (b: (string | null)[]): number => {
    let bestVal = -1000;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (b[i] === null) {
        b[i] = "O";
        const moveVal = minimax(b, 0, false);
        b[i] = null;
        if (moveVal > bestVal) {
          bestVal = moveVal;
          bestMove = i;
        }
      }
    }
    return bestMove;
  };

  const minimax = (b: (string | null)[], depth: number, isMax: boolean): number => {
    if (checkWin(b, "O")) return 10 - depth;
    if (checkWin(b, "X")) return depth - 10;
    if (b.every((c) => c !== null)) return 0;

    if (isMax) {
      let best = -1000;
      for (let i = 0; i < 9; i++) {
        if (b[i] === null) {
          b[i] = "O";
          best = Math.max(best, minimax(b, depth + 1, false));
          b[i] = null;
        }
      }
      return best;
    } else {
      let best = 1000;
      for (let i = 0; i < 9; i++) {
        if (b[i] === null) {
          b[i] = "X";
          best = Math.min(best, minimax(b, depth + 1, true));
          b[i] = null;
        }
      }
      return best;
    }
  };

  return (
    <div className="w-full flex flex-col min-h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative select-none">
      <GameHeader
        title="Tic Tac Toe"
        category="Classic"
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onRestart={startNewGame}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="Tic Tac Toe" onComplete={handleCountdownComplete} />
      )}

      {!isPlaying && !isCountingDown && !isResultOpen ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-sm mx-auto text-center">
          <h3 className="font-display font-black text-3xl text-cyan-400">Tic Tac Toe</h3>
          <p className="text-xs text-slate-400">Challenge the unbeatable Minimax AI or play with a friend!</p>
          <button
            onClick={startNewGame}
            className="w-full py-4 bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-600 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            START TIC TAC TOE
          </button>
        </div>
      ) : (
        <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-4">
          <div className="grid grid-cols-3 gap-3 bg-slate-900 p-4 rounded-3xl border-2 border-slate-800 shadow-2xl w-full max-w-xs aspect-square">
            {board.map((cell, idx) => {
              const isWinningSquare = winningLine?.includes(idx);

              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  className={`rounded-2xl border-2 flex items-center justify-center font-black text-4xl transition-all ${
                    isWinningSquare
                      ? "bg-amber-400 border-white text-slate-950 animate-bounce shadow-glow-gold z-10"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700 text-white"
                  }`}
                >
                  {cell === "X" ? (
                    <X className="w-10 h-10 text-cyan-400 stroke-[3]" />
                  ) : cell === "O" ? (
                    <Circle className="w-10 h-10 text-rose-400 stroke-[3]" />
                  ) : (
                    ""
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result={gameResult}
        score={gameResult === "WIN" ? 500 : 100}
        virtualPointsEarned={20}
        onPlayAgain={startNewGame}
      />
    </div>
  );
}
