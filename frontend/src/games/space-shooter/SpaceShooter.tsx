import React, { useRef, useEffect, useState } from "react";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { soundManager } from "../../components/games/shell/SoundManager";

export function SpaceShooter() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");

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
    setScore(0);
    setHealth(100);
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
    let playerX = canvas.width / 2 - 20;
    const playerY = canvas.height - 50;

    const lasers: { x: number; y: number }[] = [];
    const enemies: { x: number; y: number; speed: number }[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      if (relX > 0 && relX < canvas.width) {
        playerX = relX - 20;
      }
    };

    const handleCanvasClick = () => {
      soundManager.play("move");
      lasers.push({ x: playerX + 18, y: playerY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleCanvasClick);

    let spawnTimer = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Stars Background
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 20; i++) {
        const sx = (Math.sin(i * 99 + spawnTimer * 0.05) * 0.5 + 0.5) * canvas.width;
        const sy = ((i * 30 + spawnTimer * 2) % canvas.height);
        ctx.fillRect(sx, sy, 2, 2);
      }

      // Draw Player Ship
      ctx.fillStyle = "#00f0ff";
      ctx.beginPath();
      ctx.moveTo(playerX + 20, playerY);
      ctx.lineTo(playerX, playerY + 30);
      ctx.lineTo(playerX + 40, playerY + 30);
      ctx.closePath();
      ctx.fill();

      // Spawn Enemies
      spawnTimer++;
      if (spawnTimer % 45 === 0) {
        enemies.push({
          x: Math.random() * (canvas.width - 30),
          y: -30,
          speed: 2 + Math.random() * 2,
        });
      }

      // Update & Draw Lasers
      ctx.fillStyle = "#ff007f";
      for (let i = lasers.length - 1; i >= 0; i--) {
        lasers[i].y -= 8;
        ctx.fillRect(lasers[i].x, lasers[i].y, 4, 12);
        if (lasers[i].y < -10) lasers.splice(i, 1);
      }

      // Update & Draw Enemies
      ctx.fillStyle = "#ffd700";
      for (let eIdx = enemies.length - 1; eIdx >= 0; eIdx--) {
        const enemy = enemies[eIdx];
        enemy.y += enemy.speed;

        ctx.fillRect(enemy.x, enemy.y, 30, 25);

        // Laser Collision
        for (let lIdx = lasers.length - 1; lIdx >= 0; lIdx--) {
          const l = lasers[lIdx];
          if (l.x > enemy.x && l.x < enemy.x + 30 && l.y > enemy.y && l.y < enemy.y + 25) {
            soundManager.play("capture");
            enemies.splice(eIdx, 1);
            lasers.splice(lIdx, 1);
            setScore((s) => s + 50);
            break;
          }
        }

        // Player Collision or Bottom Reach
        if (enemy.y > canvas.height - 40) {
          enemies.splice(eIdx, 1);
          soundManager.play("wrong");
          setHealth((h) => {
            if (h <= 20) {
              soundManager.play("lose");
              setIsPlaying(false);
              setGameResult("LOSS");
              setIsResultOpen(true);
              return 0;
            }
            return h - 20;
          });
        }
      }

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
        title="Galactic Shooter"
        category="Arcade"
        score={score}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onRestart={startNewGame}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="Galactic Shooter" onComplete={handleCountdownComplete} />
      )}

      {!isPlaying && !isCountingDown && !isResultOpen ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-sm mx-auto text-center">
          <h3 className="font-display font-black text-3xl text-pink-500">Galactic Shooter</h3>
          <p className="text-xs text-slate-400">Aim your spaceship, fire plasma lasers, and defend against alien fleets!</p>
          <button
            onClick={startNewGame}
            className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            LAUNCH SPACESHIP
          </button>
        </div>
      ) : (
        <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-4">
          <div className="w-full max-w-md bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300" style={{ width: `${health}%` }} />
          </div>

          <canvas
            ref={canvasRef}
            width={460}
            height={360}
            className="bg-slate-950 border-2 border-slate-800 rounded-2xl shadow-2xl cursor-crosshair"
          />
        </div>
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result={gameResult}
        score={score}
        virtualPointsEarned={35}
        onPlayAgain={startNewGame}
      />
    </div>
  );
}
