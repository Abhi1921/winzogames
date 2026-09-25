import React, { useState, useEffect } from "react";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { soundManager } from "../../components/games/shell/SoundManager";
import { RotateCcw, Undo, Award } from "lucide-react";

export function Game2048() {
  const [grid, setGrid] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [prevGrid, setPrevGrid] = useState<number[][] | null>(null);
  const [score, setScore] = useState(0);
  const [prevScore, setPrevScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
    const savedBest = localStorage.getItem("winzo_2048_best");
    if (savedBest) setBestScore(parseInt(savedBest, 10));
  }, []);

  const addRandomTile = (g: number[][]) => {
    const emptySpots: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (g[r][c] === 0) emptySpots.push({ r, c });
      }
    }
    if (emptySpots.length === 0) return g;
    const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
    const val = Math.random() < 0.9 ? 2 : 4;
    const newG = g.map((row) => [...row]);
    newG[spot.r][spot.c] = val;
    return newG;
  };

  const startNewGame = () => {
    setIsCountingDown(true);
    setIsResultOpen(false);
    setIsWon(false);
  };

  const handleCountdownComplete = () => {
    let initialGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    initialGrid = addRandomTile(initialGrid);
    initialGrid = addRandomTile(initialGrid);
    setGrid(initialGrid);
    setPrevGrid(null);
    setScore(0);
    setIsCountingDown(false);
    setIsPlaying(true);
  };

  const slide = (row: number[]) => {
    let arr = row.filter((val) => val !== 0);
    let newScoreAdded = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        newScoreAdded += arr[i];
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter((val) => val !== 0);
    while (arr.length < 4) arr.push(0);
    return { arr, addedScore: newScoreAdded };
  };

  const rotate = (g: number[][]) => {
    const newG = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        newG[c][3 - r] = g[r][c];
      }
    }
    return newG;
  };

  const move = (dir: "LEFT" | "RIGHT" | "UP" | "DOWN") => {
    if (!isPlaying) return;

    let workGrid = grid.map((r) => [...r]);
    let rotations = 0;
    if (dir === "RIGHT") rotations = 2;
    if (dir === "UP") rotations = 3;
    if (dir === "DOWN") rotations = 1;

    for (let i = 0; i < rotations; i++) workGrid = rotate(workGrid);

    let totalAdded = 0;
    let slidedGrid = workGrid.map((row) => {
      const res = slide(row);
      totalAdded += res.addedScore;
      return res.arr;
    });

    for (let i = 0; i < (4 - rotations) % 4; i++) slidedGrid = rotate(slidedGrid);

    if (JSON.stringify(slidedGrid) !== JSON.stringify(grid)) {
      soundManager.play("move");
      setPrevGrid(grid);
      setPrevScore(score);

      const nextGrid = addRandomTile(slidedGrid);
      setGrid(nextGrid);

      const newScore = score + totalAdded;
      setScore(newScore);

      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem("winzo_2048_best", String(newScore));
      }

      // Check for 2048 tile win
      if (!isWon && nextGrid.some((row) => row.includes(2048))) {
        setIsWon(true);
        soundManager.play("win");
      }

      // Check Game Over (No empty cells & no adjacent matches)
      if (isGameOverState(nextGrid)) {
        setIsPlaying(false);
        setIsResultOpen(true);
      }
    }
  };

  const isGameOverState = (g: number[][]) => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (g[r][c] === 0) return false;
        if (c < 3 && g[r][c] === g[r][c + 1]) return false;
        if (r < 3 && g[r][c] === g[r + 1][c]) return false;
      }
    }
    return true;
  };

  const handleUndo = () => {
    if (!prevGrid) return;
    soundManager.play("click");
    setGrid(prevGrid);
    setScore(prevScore);
    setPrevGrid(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") move("LEFT");
      if (e.key === "ArrowRight") move("RIGHT");
      if (e.key === "ArrowUp") move("UP");
      if (e.key === "ArrowDown") move("DOWN");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [grid, isPlaying]);

  const getTileStyle = (val: number) => {
    switch (val) {
      case 2: return "bg-slate-800 text-slate-100 border-slate-700";
      case 4: return "bg-cyan-900/80 text-cyan-200 border-cyan-700";
      case 8: return "bg-cyan-600 text-white border-cyan-400 font-bold shadow-md";
      case 16: return "bg-indigo-600 text-white border-indigo-400 font-bold shadow-md";
      case 32: return "bg-purple-600 text-white border-purple-400 font-extrabold shadow-lg";
      case 64: return "bg-pink-600 text-white border-pink-400 font-extrabold shadow-lg";
      case 128:
      case 256:
      case 512:
        return "bg-amber-500 text-slate-950 font-black border-amber-300 shadow-glow";
      case 1024:
      case 2048:
        return "bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black border-white shadow-glow-gold animate-pulse";
      default:
        return "bg-slate-950/60 border-slate-900";
    }
  };

  return (
    <div className="w-full flex flex-col min-h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative select-none">
      <GameHeader
        title="2048 Puzzle"
        category="Puzzle"
        score={score}
        onRestart={startNewGame}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="2048 Puzzle" onComplete={handleCountdownComplete} />
      )}

      {!isPlaying && !isCountingDown && !isResultOpen ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-sm mx-auto text-center">
          <h3 className="font-display font-black text-3xl text-amber-400">2048 Puzzle</h3>
          <p className="text-xs text-slate-400">Slide matching tiles to double their value and reach 2048!</p>
          <button
            onClick={startNewGame}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            START 2048 MATCH
          </button>
        </div>
      ) : (
        <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-between w-full max-w-xs text-xs font-bold text-slate-400">
            <span>Best: <strong className="text-cyan-400">{bestScore}</strong></span>
            {prevGrid && (
              <button
                onClick={handleUndo}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-1"
              >
                <Undo className="w-3.5 h-3.5" /> Undo
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2.5 bg-slate-900 p-3 rounded-2xl border-2 border-slate-800 shadow-2xl w-full max-w-xs aspect-square">
            {grid.map((row, r) =>
              row.map((val, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`rounded-xl border flex items-center justify-center font-display font-black text-xl sm:text-2xl transition-all duration-150 ${getTileStyle(
                    val
                  )}`}
                >
                  {val > 0 ? val : ""}
                </div>
              ))
            )}
          </div>

          <p className="text-[11px] text-slate-400 text-center">Use Arrow Keys on desktop or swipe gestures to slide tiles.</p>
        </div>
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result={isWon ? "WIN" : "LOSS"}
        score={score}
        bestScore={bestScore}
        virtualPointsEarned={30}
        onPlayAgain={startNewGame}
      />
    </div>
  );
}
