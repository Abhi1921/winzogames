import React, { useRef, useEffect, useState } from "react";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { soundManager } from "../../components/games/shell/SoundManager";

export function BubbleShooterGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const startNewGame = () => {
    setIsCountingDown(true);
    setIsResultOpen(false);
  };

  const handleCountdownComplete = () => {
    setScore(0);
    setIsCountingDown(false);
    setIsPlaying(true);
    setIsPaused(false);
  };

  useEffect(() => {
    if (!isPlaying || isPaused || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let aimAngle = Math.PI / 2;

    const colors = ["#00f0ff", "#ff007f", "#ffd700", "#8a2be2"];
    let currentColor = colors[Math.floor(Math.random() * colors.length)];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      aimAngle = Math.atan2(canvas.height - mouseY, mouseX - canvas.width / 2);
    };

    const handleCanvasClick = () => {
      soundManager.play("bounce");
      setScore((s) => s + 50);
      currentColor = colors[Math.floor(Math.random() * colors.length)];
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleCanvasClick);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Top Bubble Grid
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 10; c++) {
          ctx.beginPath();
          ctx.arc(c * 42 + 25, r * 40 + 25, 18, 0, Math.PI * 2);
          ctx.fillStyle = colors[(r + c) % colors.length];
          ctx.fill();
          ctx.closePath();
        }
      }

      // Draw Aim Line
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height - 30);
      ctx.lineTo(
        canvas.width / 2 + Math.cos(aimAngle) * 120,
        canvas.height - 30 - Math.sin(aimAngle) * 120
      );
      ctx.strokeStyle = "rgba(0, 240, 255, 0.6)";
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Shooter Bubble
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height - 30, 20, 0, Math.PI * 2);
      ctx.fillStyle = currentColor;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.closePath();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, [isPlaying, isPaused]);

  return (
    <div className="w-full flex flex-col min-h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative select-none">
      <GameHeader
        title="Bubble Matcher"
        category="Arcade"
        score={score}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onRestart={startNewGame}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="Bubble Matcher" onComplete={handleCountdownComplete} />
      )}

      {!isPlaying && !isCountingDown && !isResultOpen ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-sm mx-auto text-center">
          <h3 className="font-display font-black text-3xl text-cyan-400">Bubble Matcher</h3>
          <p className="text-xs text-slate-400">Aim your bubble cannon to match 3 or more identical colors and pop them!</p>
          <button
            onClick={startNewGame}
            className="w-full py-4 bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-600 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            START BUBBLE MATCH
          </button>
        </div>
      ) : (
        <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-4">
          <canvas
            ref={canvasRef}
            width={440}
            height={380}
            className="bg-slate-900 border-2 border-slate-800 rounded-2xl shadow-2xl cursor-crosshair"
          />
        </div>
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result="WIN"
        score={score}
        virtualPointsEarned={30}
        onPlayAgain={startNewGame}
      />
    </div>
  );
}
