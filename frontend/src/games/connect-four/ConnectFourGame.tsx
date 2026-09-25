import React, { useState, useEffect } from "react";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { soundManager } from "../../components/games/shell/SoundManager";
import { Bot, User } from "lucide-react";

const ROWS = 6;
const COLS = 7;

export function ConnectFourGame() {
  const [board, setBoard] = useState<(string | null)[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );
  const [isRedTurn, setIsRedTurn] = useState(true);
  const [mode, setMode] = useState<"VS_AI" | "LOCAL_2P">("VS_AI");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [gameResult, setGameResult] = useState<"WIN" | "LOSS" | "DRAW">("WIN");

  const startNewGame = () => {
    setIsCountingDown(true);
    setIsResultOpen(false);
  };

  const handleCountdownComplete = () => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setIsRedTurn(true);
    setIsCountingDown(false);
    setIsPlaying(true);
  };

  const handleDropColumn = (colIndex: number) => {
    if (!isPlaying || (mode === "VS_AI" && !isRedTurn)) return;
    executeDrop(colIndex, "RED");
  };

  const executeDrop = (colIndex: number, player: "RED" | "YELLOW") => {
    // Find bottom-most empty row in column
    let targetRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!board[r][colIndex]) {
        targetRow = r;
        break;
      }
    }

    if (targetRow === -1) return; // Column full

    soundManager.play("bounce");
    const newBoard = board.map((row) => [...row]);
    newBoard[targetRow][colIndex] = player;
    setBoard(newBoard);

    if (checkWin(newBoard, player)) {
      soundManager.play(player === "RED" ? "win" : "lose");
      setIsPlaying(false);
      setGameResult(player === "RED" ? "WIN" : "LOSS");
      setIsResultOpen(true);
      return;
    }

    if (newBoard.every((row) => row.every((cell) => cell !== null))) {
      setIsPlaying(false);
      setGameResult("DRAW");
      setIsResultOpen(true);
      return;
    }

    setIsRedTurn(player !== "RED");
  };

  // AI Turn for Yellow
  useEffect(() => {
    if (!isPlaying || isRedTurn || mode !== "VS_AI") return;

    const timer = setTimeout(() => {
      const validCols: number[] = [];
      for (let c = 0; c < COLS; c++) {
        if (!board[0][c]) validCols.push(c);
      }

      if (validCols.length > 0) {
        const aiCol = validCols[Math.floor(Math.random() * validCols.length)];
        executeDrop(aiCol, "YELLOW");
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [isRedTurn, isPlaying, board, mode]);

  const checkWin = (b: (string | null)[][], p: string): boolean => {
    // Horizontal
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (b[r][c] === p && b[r][c + 1] === p && b[r][c + 2] === p && b[r][c + 3] === p) return true;
      }
    }
    // Vertical
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c < COLS; c++) {
        if (b[r][c] === p && b[r + 1][c] === p && b[r + 2][c] === p && b[r + 3][c] === p) return true;
      }
    }
    // Diagonal Up
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (b[r][c] === p && b[r - 1][c + 1] === p && b[r - 2][c + 2] === p && b[r - 3][c + 3] === p) return true;
      }
    }
    // Diagonal Down
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (b[r][c] === p && b[r + 1][c + 1] === p && b[r + 2][c + 2] === p && b[r + 3][c + 3] === p) return true;
      }
    }
    return false;
  };

  return (
    <div className="w-full flex flex-col min-h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative select-none">
      <GameHeader
        title="Connect Four"
        category="Board Games"
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onRestart={startNewGame}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="Connect Four" onComplete={handleCountdownComplete} />
      )}

      {!isPlaying && !isCountingDown && !isResultOpen ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-sm mx-auto text-center">
          <h3 className="font-display font-black text-3xl text-red-400">Connect Four</h3>
          <p className="text-xs text-slate-400">Drop colored discs to connect 4 in a row horizontally, vertically, or diagonally!</p>
          <button
            onClick={startNewGame}
            className="w-full py-4 bg-gradient-to-r from-red-500 via-amber-400 to-cyan-400 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            START CONNECT FOUR
          </button>
        </div>
      ) : (
        <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-4">
          <div className="bg-blue-600 p-4 rounded-3xl border-4 border-blue-800 shadow-2xl w-full max-w-md">
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: COLS }).map((_, c) => (
                <div key={c} className="flex flex-col gap-2 cursor-pointer" onClick={() => handleDropColumn(c)}>
                  {Array.from({ length: ROWS }).map((_, r) => {
                    const val = board[r][c];
                    return (
                      <div
                        key={r}
                        className={`aspect-square rounded-full border-2 shadow-inner transition-all duration-300 ${
                          val === "RED"
                            ? "bg-gradient-to-tr from-red-700 to-red-400 border-red-300 scale-105"
                            : val === "YELLOW"
                            ? "bg-gradient-to-tr from-amber-600 to-amber-300 border-amber-200 scale-105"
                            : "bg-slate-900 border-blue-900"
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result={gameResult}
        score={gameResult === "WIN" ? 800 : 200}
        virtualPointsEarned={30}
        onPlayAgain={startNewGame}
      />
    </div>
  );
}
