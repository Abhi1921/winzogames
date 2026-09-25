import React, { useEffect, useState } from "react";
import { soundManager } from "./SoundManager";

interface GameLaunchCountdownProps {
  onComplete: () => void;
  gameTitle?: string;
}

export function GameLaunchCountdown({ onComplete, gameTitle }: GameLaunchCountdownProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    soundManager.play("bounce");
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          soundManager.play("win");
          setTimeout(onComplete, 500);
          return 0; // GO!
        }
        soundManager.play("bounce");
        return prev - 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center text-white select-none">
      {gameTitle && <h3 className="font-display font-bold text-slate-400 text-sm mb-4">{gameTitle}</h3>}

      <div className="relative flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border-4 border-cyan-500/30 animate-ping absolute" />
        <div className="font-display font-black text-6xl sm:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 animate-pulse">
          {count > 0 ? count : "GO!"}
        </div>
      </div>
    </div>
  );
}
