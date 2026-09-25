import React, { useState, useEffect, useRef } from "react";

interface FlappyGameProps {
  onScoreUpdate: (score: number) => void;
  onGameOver: (score: number, resultType: "WIN" | "LOSS") => void;
}

export function FlappyGame({ onScoreUpdate, onGameOver }: FlappyGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [birdY, setBirdY] = useState(150);
  const [velocity, setVelocity] = useState(0);
  const [score, setScore] = useState(0);
  const [pipes, setPipes] = useState<{ x: number; top: number; bottom: number }[]>([]);
  const [isStarted, setIsStarted] = useState(false);

  const handleFlap = () => {
    if (!isStarted) setIsStarted(true);
    setVelocity(-7);
  };

  useEffect(() => {
    if (!isStarted) return;

    const timer = setInterval(() => {
      setBirdY((prev) => {
        const nextY = prev + velocity;
        if (nextY >= 300 || nextY <= 0) {
          onGameOver(score, "LOSS");
          setIsStarted(false);
          return 150;
        }
        return nextY;
      });
      setVelocity((v) => v + 0.5);

      // Pipes
      setPipes((prevPipes) => {
        let newPipes = prevPipes.map((p) => ({ ...p, x: p.x - 4 }));
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < 180) {
          const top = Math.floor(Math.random() * 120) + 30;
          newPipes.push({ x: 320, top, bottom: 300 - top - 90 });
        }
        if (newPipes.length > 0 && newPipes[0].x < -40) {
          newPipes.shift();
          const newScore = score + 10;
          setScore(newScore);
          onScoreUpdate(newScore);
        }
        return newPipes;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [isStarted, velocity, score]);

  return (
    <div
      onClick={handleFlap}
      className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-4 cursor-pointer select-none"
    >
      <div className="relative w-72 h-80 bg-gradient-to-b from-cyan-400 via-indigo-900 to-slate-950 rounded-2xl overflow-hidden border-4 border-cyan-500 shadow-2xl flex items-center justify-center">
        {/* Bird Avatar */}
        <div
          className="absolute w-8 h-8 rounded-full bg-amber-400 border-2 border-white shadow-md flex items-center justify-center font-bold text-xs"
          style={{ top: `${birdY}px`, left: "60px" }}
        >
          🐤
        </div>

        {/* Pipes */}
        {pipes.map((p, idx) => (
          <React.Fragment key={idx}>
            <div
              className="absolute w-10 bg-emerald-500 border-2 border-emerald-300 rounded-b-lg"
              style={{ left: `${p.x}px`, top: 0, height: `${p.top}px` }}
            />
            <div
              className="absolute w-10 bg-emerald-500 border-2 border-emerald-300 rounded-t-lg"
              style={{ left: `${p.x}px`, bottom: 0, height: `${p.bottom}px` }}
            />
          </React.Fragment>
        ))}

        {!isStarted && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4">
            <span className="text-white font-extrabold text-lg mb-2">TAP TO FLAP</span>
            <p className="text-xs text-slate-300">Click or press Spacebar to flap wings!</p>
          </div>
        )}
      </div>
    </div>
  );
}
