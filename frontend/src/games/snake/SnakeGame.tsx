import React, { useEffect, useRef, useState } from "react";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { soundManager } from "../../components/games/shell/SoundManager";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, RotateCcw } from "lucide-react";

const GRID_SIZE = 20;

export function SnakeGame() {
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">("UP");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  useEffect(() => {
    const saved = localStorage.getItem("winzo_snake_best");
    if (saved) setBestScore(parseInt(saved, 10));
  }, []);

  const generateFood = (currSnake: { x: number; y: number }[]) => {
    let x: number, y: number;
    while (true) {
      x = Math.floor(Math.random() * GRID_SIZE);
      y = Math.floor(Math.random() * GRID_SIZE);
      // eslint-disable-next-line no-loop-func
      if (!currSnake.some((s) => s.x === x && s.y === y)) break;
    }
    return { x, y };
  };

  const startNewGame = () => {
    setIsCountingDown(true);
    setIsResultOpen(false);
  };

  const handleCountdownComplete = () => {
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection("UP");
    setScore(0);
    setIsCountingDown(false);
    setIsPlaying(true);
    setIsPaused(false);
  };

  // Direction keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isPaused) return;
      if (e.key === "ArrowUp" && directionRef.current !== "DOWN") setDirection("UP");
      if (e.key === "ArrowDown" && directionRef.current !== "UP") setDirection("DOWN");
      if (e.key === "ArrowLeft" && directionRef.current !== "RIGHT") setDirection("LEFT");
      if (e.key === "ArrowRight" && directionRef.current !== "LEFT") setDirection("RIGHT");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isPaused]);

  // Main game tick loop
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const speedMs = difficulty === "EASY" ? 140 : difficulty === "MEDIUM" ? 100 : 70;
    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        const dir = directionRef.current;

        if (dir === "UP") head.y -= 1;
        if (dir === "DOWN") head.y += 1;
        if (dir === "LEFT") head.x -= 1;
        if (dir === "RIGHT") head.x += 1;

        // Wall Collision Check
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          handleGameOver();
          return prevSnake;
        }

        // Self Collision Check
        if (prevSnake.some((s) => s.x === head.x && s.y === head.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food Collision Check
        if (head.x === food.x && head.y === food.y) {
          soundManager.play("correct");
          const newScore = score + 10;
          setScore(newScore);
          if (newScore > bestScore) {
            setBestScore(newScore);
            localStorage.setItem("winzo_snake_best", String(newScore));
          }
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, Math.max(40, speedMs - Math.floor(score / 50) * 5));

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, food, score, difficulty, bestScore]);

  const handleGameOver = () => {
    setIsPlaying(false);
    setIsResultOpen(true);
  };

  const changeDir = (dir: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
    if (!isPlaying || isPaused) return;
    soundManager.play("click");
    if (dir === "UP" && directionRef.current !== "DOWN") setDirection("UP");
    if (dir === "DOWN" && directionRef.current !== "UP") setDirection("DOWN");
    if (dir === "LEFT" && directionRef.current !== "RIGHT") setDirection("LEFT");
    if (dir === "RIGHT" && directionRef.current !== "LEFT") setDirection("RIGHT");
  };

  return (
    <div className="w-full flex flex-col min-h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative select-none">
      <GameHeader
        title="Snake Retro"
        category="Arcade"
        score={score}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onRestart={startNewGame}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="Snake Retro" onComplete={handleCountdownComplete} />
      )}

      {!isPlaying && !isCountingDown && !isResultOpen ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-sm mx-auto text-center">
          <h3 className="font-display font-black text-3xl text-cyan-400">Snake Retro</h3>
          <p className="text-xs text-slate-400">Eat food, grow longer, avoid walls and your own tail!</p>
          <button
            onClick={startNewGame}
            className="w-full py-4 bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-600 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            START GAME
          </button>
        </div>
      ) : (
        <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-4">
          {/* 20x20 Grid Canvas */}
          <div
            className="grid gap-0.5 bg-slate-900 p-2 rounded-2xl border-2 border-slate-800 shadow-2xl"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              width: "100%",
              maxWidth: "380px",
              height: "380px",
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const isHead = snake[0].x === x && snake[0].y === y;
              const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
              const isFoodItem = food.x === x && food.y === y;

              return (
                <div
                  key={index}
                  className={`rounded-sm transition-all ${
                    isHead
                      ? "bg-cyan-400 shadow-glow scale-105 z-10"
                      : isBody
                      ? "bg-cyan-600 opacity-90"
                      : isFoodItem
                      ? "bg-amber-400 animate-bounce rounded-full shadow-glow-gold"
                      : "bg-slate-950/40"
                  }`}
                />
              );
            })}
          </div>

          {/* Virtual D-Pad for Mobile Touch Screens */}
          <div className="grid grid-cols-3 gap-2 w-44 pt-2 md:hidden">
            <div />
            <button onClick={() => changeDir("UP")} className="p-3 rounded-xl bg-slate-800 text-white flex items-center justify-center">
              <ArrowUp className="w-5 h-5" />
            </button>
            <div />
            <button onClick={() => changeDir("LEFT")} className="p-3 rounded-xl bg-slate-800 text-white flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button onClick={() => changeDir("DOWN")} className="p-3 rounded-xl bg-slate-800 text-white flex items-center justify-center">
              <ArrowDown className="w-5 h-5" />
            </button>
            <button onClick={() => changeDir("RIGHT")} className="p-3 rounded-xl bg-slate-800 text-white flex items-center justify-center">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result={score >= 100 ? "WIN" : "LOSS"}
        score={score}
        bestScore={bestScore}
        virtualPointsEarned={20}
        onPlayAgain={startNewGame}
      />
    </div>
  );
}
