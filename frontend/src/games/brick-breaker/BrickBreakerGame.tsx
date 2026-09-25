import React, { useRef, useEffect, useState } from "react";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { soundManager } from "../../components/games/shell/SoundManager";

export function BrickBreakerGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
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
    setLives(3);
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
    let paddleWidth = 90;
    let paddleX = (canvas.width - paddleWidth) / 2;

    let ballX = canvas.width / 2;
    let ballY = canvas.height - 30;
    let dx = 3;
    let dy = -3;
    const ballRadius = 7;

    const rowCount = 5;
    const colCount = 7;
    const brickWidth = 55;
    const brickHeight = 18;
    const brickPadding = 8;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 20;

    const bricks: { x: number; y: number; status: number }[][] = [];
    for (let c = 0; c < colCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < rowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Bricks
      let activeBricks = 0;
      for (let c = 0; c < colCount; c++) {
        for (let r = 0; r < rowCount; r++) {
          if (bricks[c][r].status === 1) {
            activeBricks++;
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;

            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = r % 2 === 0 ? "#00f0ff" : "#8a2be2";
            ctx.fill();
            ctx.closePath();
          }
        }
      }

      if (activeBricks === 0) {
        soundManager.play("win");
        setIsPlaying(false);
        setGameResult("WIN");
        setIsResultOpen(true);
        return;
      }

      // Draw Ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#ffd700";
      ctx.fill();
      ctx.closePath();

      // Draw Paddle
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - 15, paddleWidth, 10);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.closePath();

      // Collision with Wall
      if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
        dx = -dx;
      }
      if (ballY + dy < ballRadius) {
        dy = -dy;
      } else if (ballY + dy > canvas.height - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
          soundManager.play("bounce");
          dy = -dy;
        } else {
          // Ball lost
          soundManager.play("wrong");
          setLives((l) => {
            if (l <= 1) {
              soundManager.play("lose");
              setIsPlaying(false);
              setGameResult("LOSS");
              setIsResultOpen(true);
              return 0;
            }
            ballX = canvas.width / 2;
            ballY = canvas.height - 30;
            dx = 3;
            dy = -3;
            return l - 1;
          });
        }
      }

      // Brick Collision
      for (let c = 0; c < colCount; c++) {
        for (let r = 0; r < rowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
              dy = -dy;
              b.status = 0;
              soundManager.play("move");
              setScore((s) => s + 20);
            }
          }
        }
      }

      ballX += dx;
      ballY += dy;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isPlaying, isPaused]);

  return (
    <div className="w-full flex flex-col min-h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative select-none">
      <GameHeader
        title="Brick Breaker"
        category="Arcade"
        score={score}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onRestart={startNewGame}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="Brick Breaker" onComplete={handleCountdownComplete} />
      )}

      {!isPlaying && !isCountingDown && !isResultOpen ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-sm mx-auto text-center">
          <h3 className="font-display font-black text-3xl text-cyan-400">Brick Breaker</h3>
          <p className="text-xs text-slate-400">Move your paddle to bounce the ball and smash all brick grid rows!</p>
          <button
            onClick={startNewGame}
            className="w-full py-4 bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-600 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            START SMASHING
          </button>
        </div>
      ) : (
        <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-4">
          <div className="text-xs font-bold text-rose-400">Lives: {"❤️ ".repeat(lives)}</div>
          <canvas
            ref={canvasRef}
            width={460}
            height={360}
            className="bg-slate-900 border-2 border-slate-800 rounded-2xl shadow-2xl"
          />
        </div>
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result={gameResult}
        score={score}
        virtualPointsEarned={30}
        onPlayAgain={startNewGame}
      />
    </div>
  );
}
