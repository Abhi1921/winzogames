import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, RotateCcw, Gamepad2, Home, Award, Coins } from "lucide-react";
import confetti from "canvas-confetti";
import { soundManager } from "./SoundManager";

interface GameResultModalProps {
  isOpen: boolean;
  result: "WIN" | "LOSS" | "DRAW";
  score: number;
  bestScore?: number;
  virtualPointsEarned?: number;
  onPlayAgain: () => void;
  title?: string;
}

export function GameResultModal({
  isOpen,
  result,
  score,
  bestScore,
  virtualPointsEarned = 25,
  onPlayAgain,
  title = "Match Results",
}: GameResultModalProps) {
  useEffect(() => {
    if (isOpen) {
      if (result === "WIN") {
        soundManager.play("win");
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } else {
        soundManager.play("lose");
      }
    }
  }, [isOpen, result]);

  if (!isOpen) return null;

  const isWin = result === "WIN";

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow Header */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40 ${
            isWin ? "bg-amber-500" : "bg-purple-600"
          }`}
        />

        {/* Badge Icon */}
        <div className="relative z-10 inline-flex items-center justify-center p-4 rounded-3xl bg-slate-800 border border-slate-700 shadow-xl">
          {isWin ? (
            <Trophy className="w-14 h-14 text-amber-400 animate-bounce" />
          ) : (
            <Gamepad2 className="w-14 h-14 text-purple-400" />
          )}
        </div>

        {/* Title */}
        <div className="relative z-10 space-y-1">
          <h2 className="font-display font-black text-3xl tracking-tight">
            {isWin ? "🏆 YOU WIN!" : result === "DRAW" ? "🤝 DRAW MATCH" : "💥 GAME OVER"}
          </h2>
          <p className="text-xs text-slate-400 font-semibold">{title}</p>
        </div>

        {/* Score & Points Metrics */}
        <div className="relative z-10 grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Match Score</span>
            <div className="font-display font-black text-2xl text-cyan-400">{score}</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Virtual Coins</span>
            <div className="font-display font-black text-2xl text-amber-400 flex items-center justify-center gap-1">
              <Coins className="w-4 h-4" /> +{isWin ? virtualPointsEarned : Math.max(5, Math.floor(virtualPointsEarned / 2))} XP
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="relative z-10 text-[11px] text-slate-400 bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
          🎮 <strong>WinzoGames Non-Monetary Play:</strong> Points are virtual XP metrics for leaderboards.
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 space-y-2.5 pt-2">
          <button
            onClick={() => {
              soundManager.play("click");
              onPlayAgain();
            }}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-white font-black text-sm rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> PLAY AGAIN
          </button>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/games"
              className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <Gamepad2 className="w-4 h-4 text-cyan-400" /> MORE GAMES
            </Link>
            <Link
              to="/"
              className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <Home className="w-4 h-4 text-amber-400" /> HOME
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
