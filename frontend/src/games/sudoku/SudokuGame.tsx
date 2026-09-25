import React, { useState, useEffect } from "react";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { soundManager } from "../../components/games/shell/SoundManager";
import { Lightbulb, Edit3, CheckCircle2, RotateCcw } from "lucide-react";

const SAMPLE_SOLVED_SUDOKU = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

export function SudokuGame() {
  const [solution] = useState(SAMPLE_SOLVED_SUDOKU);
  const [board, setBoard] = useState<number[][]>([]);
  const [initialMask, setInitialMask] = useState<boolean[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);

  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const generatePuzzle = () => {
    setIsCountingDown(true);
    setIsResultOpen(false);
  };

  const handleCountdownComplete = () => {
    const holes = difficulty === "EASY" ? 30 : difficulty === "MEDIUM" ? 45 : 55;
    const newBoard = solution.map((row) => [...row]);
    const mask = Array.from({ length: 9 }, () => Array(9).fill(false));

    let removed = 0;
    while (removed < holes) {
      const r = Math.floor(Math.random() * 9);
      const c = Math.floor(Math.random() * 9);
      if (newBoard[r][c] !== 0) {
        newBoard[r][c] = 0;
        mask[r][c] = true; // Editable cell
        removed++;
      }
    }

    setBoard(newBoard);
    setInitialMask(mask);
    setSelectedCell(null);
    setTimerSeconds(0);
    setMistakes(0);
    setIsCountingDown(false);
    setIsPlaying(true);
    setIsPaused(false);
  };

  useEffect(() => {
    if (!isPlaying || isPaused || isResultOpen) return;
    const interval = setInterval(() => {
      setTimerSeconds((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, isResultOpen]);

  const handleInputNumber = (num: number) => {
    if (!selectedCell || !isPlaying || isPaused) return;
    const { r, c } = selectedCell;
    if (!initialMask[r][c]) return; // Cannot edit original fixed cells

    soundManager.play("click");
    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = num;
    setBoard(newBoard);

    // Mistake check
    if (num !== 0 && num !== solution[r][c]) {
      soundManager.play("wrong");
      setMistakes((m) => m + 1);
    }

    // Check completion
    if (JSON.stringify(newBoard) === JSON.stringify(solution)) {
      soundManager.play("win");
      setIsPlaying(false);
      setIsResultOpen(true);
    }
  };

  const handleHint = () => {
    if (!selectedCell || !isPlaying || isPaused) return;
    const { r, c } = selectedCell;
    if (!initialMask[r][c]) return;

    soundManager.play("correct");
    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = solution[r][c];
    setBoard(newBoard);
  };

  return (
    <div className="w-full flex flex-col min-h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative select-none">
      <GameHeader
        title="Sudoku Solver"
        category="Puzzle"
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        timerSeconds={timerSeconds}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onRestart={generatePuzzle}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="Sudoku Solver" onComplete={handleCountdownComplete} />
      )}

      {!isPlaying && !isCountingDown && !isResultOpen ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-sm mx-auto text-center">
          <h3 className="font-display font-black text-3xl text-purple-400">Sudoku Solver</h3>
          <p className="text-xs text-slate-400">Fill the 9x9 grid so every row, column and 3x3 box has 1 to 9!</p>
          <button
            onClick={generatePuzzle}
            className="w-full py-4 bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-400 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            START SUDOKU
          </button>
        </div>
      ) : (
        <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-between w-full max-w-sm text-xs font-bold text-slate-400">
            <span className="text-rose-400">Mistakes: {mistakes} / 3</span>
            <button
              onClick={handleHint}
              className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg flex items-center gap-1 font-extrabold"
            >
              <Lightbulb className="w-4 h-4" /> Hint
            </button>
          </div>

          {/* 9x9 Grid */}
          <div className="grid grid-cols-9 gap-0.5 bg-slate-800 p-1.5 rounded-2xl border-2 border-slate-700 shadow-2xl w-full max-w-sm aspect-square">
            {board.map((row, r) =>
              row.map((val, c) => {
                const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                const isEditable = initialMask[r]?.[c];
                const isIncorrect = val !== 0 && val !== solution[r][c];

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => setSelectedCell({ r, c })}
                    className={`flex items-center justify-center font-bold text-base sm:text-lg transition-all ${
                      isSelected
                        ? "bg-cyan-500/40 ring-2 ring-cyan-400 z-10"
                        : isEditable
                        ? "bg-slate-900 text-cyan-300"
                        : "bg-slate-950 text-slate-200"
                    } ${isIncorrect ? "bg-rose-500/30 text-rose-400 font-black" : ""}`}
                  >
                    {val > 0 ? val : ""}
                  </button>
                );
              })
            )}
          </div>

          {/* Keypad */}
          <div className="flex items-center justify-center gap-2 max-w-sm w-full pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => handleInputNumber(n)}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-white font-black text-sm shadow-md transition-all active:scale-95"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result="WIN"
        score={1000 - timerSeconds * 2 - mistakes * 50}
        virtualPointsEarned={35}
        onPlayAgain={generatePuzzle}
      />
    </div>
  );
}
