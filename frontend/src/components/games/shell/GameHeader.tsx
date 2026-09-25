import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2, VolumeX, Pause, Play, RotateCcw, Moon, Sun } from "lucide-react";
import { soundManager } from "./SoundManager";
import { useThemeStore } from "../../../store/themeStore";

interface GameHeaderProps {
  title: string;
  category?: string;
  score?: number;
  timerSeconds?: number;
  difficulty?: string;
  onDifficultyChange?: (diff: any) => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
  onRestart?: () => void;
  statusText?: string;
}

export function GameHeader({
  title,
  category,
  score = 0,
  timerSeconds,
  difficulty,
  onDifficultyChange,
  isPaused,
  onTogglePause,
  onRestart,
  statusText,
}: GameHeaderProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleToggleSound = () => {
    const muted = !soundManager.toggleMute();
    setIsMuted(muted);
    soundManager.play("click");
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    soundManager.play("click");
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <>
      <div className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 select-none">
        {/* Left Side: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Exit Game"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-sm sm:text-base leading-tight">{title}</h2>
              {category && (
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {category}
                </span>
              )}
            </div>
            {statusText && <div className="text-[11px] text-cyan-400 font-semibold">{statusText}</div>}
          </div>
        </div>

        {/* Center: Difficulty Selector */}
        {difficulty && onDifficultyChange && (
          <div className="hidden md:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(["EASY", "MEDIUM", "HARD"] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  soundManager.play("click");
                  onDifficultyChange(diff);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  difficulty === diff
                    ? "bg-cyan-500 text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        )}

        {/* Right Side: Score, Timer & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold">
          {typeof timerSeconds === "number" && (
            <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
              ⏱ {formatTimer(timerSeconds)}
            </div>
          )}

          <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-3 py-1.5 rounded-xl font-extrabold">
            Score: {score}
          </div>

          {onTogglePause && (
            <button
              onClick={() => {
                soundManager.play("click");
                onTogglePause();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              title={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? <Play className="w-4 h-4 fill-current text-cyan-400" /> : <Pause className="w-4 h-4" />}
            </button>
          )}

          {onRestart && (
            <button
              onClick={() => {
                soundManager.play("click");
                onRestart();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              title="Restart Match"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={handleToggleTheme}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            title="Toggle Light/Dark Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
          </button>
        </div>
      </div>

      {/* Leave Game Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <h3 className="font-display font-extrabold text-xl text-white">Leave Active Game?</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Your active match progress will be lost. Are you sure you want to return to games catalog?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
              >
                KEEP PLAYING
              </button>
              <button
                onClick={() => navigate("/games")}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-lg"
              >
                LEAVE GAME
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
