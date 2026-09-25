import React, { useState, useEffect } from "react";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { soundManager } from "../../components/games/shell/SoundManager";
import { Flag, Bomb, Smile, Frown } from "lucide-react";

interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export function MinesweeperGame() {
  const [rows, setRows] = useState(9);
  const [cols, setCols] = useState(9);
  const [minesCount, setMinesCount] = useState(10);
  const [board, setBoard] = useState<Cell[][]>([]);
  const [firstClick, setFirstClick] = useState(true);
  const [flagMode, setFlagMode] = useState(false);

  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [timerSeconds, setTimerSeconds] = useState(0);

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [gameResult, setGameResult] = useState<"WIN" | "LOSS">("WIN");

  const startNewGame = () => {
    setIsCountingDown(true);
    setIsResultOpen(false);
  };

  const handleCountdownComplete = () => {
    const r = difficulty === "EASY" ? 9 : difficulty === "MEDIUM" ? 12 : 16;
    const c = difficulty === "EASY" ? 9 : difficulty === "MEDIUM" ? 12 : 16;
    const m = difficulty === "EASY" ? 10 : difficulty === "MEDIUM" ? 25 : 40;

    setRows(r);
    setCols(c);
    setMinesCount(m);

    const newBoard: Cell[][] = [];
    for (let i = 0; i < r; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < c; j++) {
        row.push({ r: i, c: j, isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0 });
      }
      newBoard.push(row);
    }

    setBoard(newBoard);
    setFirstClick(true);
    setTimerSeconds(0);
    setIsCountingDown(false);
    setIsPlaying(true);
    setIsPaused(false);
  };

  useEffect(() => {
    if (!isPlaying || isPaused || isResultOpen || firstClick) return;
    const timer = setInterval(() => setTimerSeconds((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [isPlaying, isPaused, isResultOpen, firstClick]);

  const plantMines = (safeR: number, safeC: number, b: Cell[][]) => {
    let planted = 0;
    while (planted < minesCount) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if ((r !== safeR || c !== safeC) && !b[r][c].isMine) {
        b[r][c].isMine = true;
        planted++;
      }
    }

    // Calculate neighbor numbers
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!b[i][j].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = i + dr, nc = j + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && b[nr][nc].isMine) {
                count++;
              }
            }
          }
          b[i][j].neighborMines = count;
        }
      }
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (!isPlaying || isPaused || board[r][c].isRevealed) return;

    if (flagMode) {
      toggleFlag(r, c);
      return;
    }

    if (board[r][c].isFlagged) return;

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    if (firstClick) {
      plantMines(r, c, newBoard);
      setFirstClick(false);
    }

    const cell = newBoard[r][c];

    if (cell.isMine) {
      // Boom! Game Over
      soundManager.play("lose");
      revealAllMines(newBoard);
      setBoard(newBoard);
      setIsPlaying(false);
      setGameResult("LOSS");
      setIsResultOpen(true);
      return;
    }

    soundManager.play("click");
    revealCell(r, c, newBoard);
    setBoard(newBoard);

    // Check Win Condition
    let unrevealedSafeCells = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!newBoard[i][j].isMine && !newBoard[i][j].isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }

    if (unrevealedSafeCells === 0) {
      soundManager.play("win");
      setIsPlaying(false);
      setGameResult("WIN");
      setIsResultOpen(true);
    }
  };

  const revealCell = (r: number, c: number, b: Cell[][]) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || b[r][c].isRevealed || b[r][c].isFlagged) return;
    b[r][c].isRevealed = true;

    if (b[r][c].neighborMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          revealCell(r + dr, c + dc, b);
        }
      }
    }
  };

  const toggleFlag = (r: number, c: number) => {
    if (!isPlaying || board[r][c].isRevealed) return;
    soundManager.play("click");
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
    setBoard(newBoard);
  };

  const revealAllMines = (b: Cell[][]) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (b[i][j].isMine) b[i][j].isRevealed = true;
      }
    }
  };

  const flaggedCount = board.flat().filter((cell) => cell.isFlagged).length;

  return (
    <div className="w-full flex flex-col min-h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative select-none">
      <GameHeader
        title="Minesweeper"
        category="Puzzle"
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        timerSeconds={timerSeconds}
        onRestart={startNewGame}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="Minesweeper" onComplete={handleCountdownComplete} />
      )}

      {!isPlaying && !isCountingDown && !isResultOpen ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-sm mx-auto text-center">
          <h3 className="font-display font-black text-3xl text-rose-400">Minesweeper</h3>
          <p className="text-xs text-slate-400">Flag hidden mines and clear all safe tiles!</p>
          <button
            onClick={startNewGame}
            className="w-full py-4 bg-gradient-to-r from-rose-500 via-purple-600 to-cyan-400 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            START MINESWEEPER
          </button>
        </div>
      ) : (
        <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-between w-full max-w-sm text-xs font-bold text-slate-400 bg-slate-900 p-2 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1 text-rose-400">
              <Bomb className="w-4 h-4" /> {minesCount - flaggedCount} Mines
            </span>
            <button
              onClick={() => setFlagMode(!flagMode)}
              className={`px-3 py-1 rounded-lg flex items-center gap-1 text-xs font-extrabold transition-all ${
                flagMode ? "bg-rose-500 text-white shadow-glow" : "bg-slate-800 text-slate-300"
              }`}
            >
              <Flag className="w-3.5 h-3.5" /> {flagMode ? "FLAGGING ON" : "REVEAL MODE"}
            </button>
          </div>

          <div
            className="grid gap-1 bg-slate-900 p-3 rounded-2xl border-2 border-slate-800 shadow-2xl max-w-sm w-full overflow-auto"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    toggleFlag(r, c);
                  }}
                  className={`aspect-square rounded-md flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                    cell.isRevealed
                      ? cell.isMine
                        ? "bg-rose-600 text-white animate-pulse"
                        : "bg-slate-950 text-cyan-400 border border-slate-800/40"
                      : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                  }`}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? (
                      <Bomb className="w-3.5 h-3.5" />
                    ) : cell.neighborMines > 0 ? (
                      cell.neighborMines
                    ) : (
                      ""
                    )
                  ) : cell.isFlagged ? (
                    <Flag className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  ) : (
                    ""
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result={gameResult}
        score={gameResult === "WIN" ? 500 - timerSeconds * 2 : 50}
        virtualPointsEarned={25}
        onPlayAgain={startNewGame}
      />
    </div>
  );
}
