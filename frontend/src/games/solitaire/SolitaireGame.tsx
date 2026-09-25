import React, { useState, useEffect } from "react";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { soundManager } from "../../components/games/shell/SoundManager";
import { RotateCcw, Undo, Layers } from "lucide-react";

export function SolitaireGame() {
  const [score, setScore] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const startNewGame = () => {
    setIsCountingDown(true);
    setIsResultOpen(false);
  };

  const handleCountdownComplete = () => {
    setScore(0);
    setTimerSeconds(0);
    setIsCountingDown(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || isResultOpen) return;
    const interval = setInterval(() => setTimerSeconds((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isResultOpen]);

  return (
    <div className="w-full flex flex-col min-h-[600px] bg-emerald-950 rounded-3xl overflow-hidden border border-emerald-900 shadow-2xl relative select-none">
      <GameHeader
        title="Solitaire Klondike"
        category="Card Games"
        timerSeconds={timerSeconds}
        score={score}
        onRestart={startNewGame}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="Solitaire Klondike" onComplete={handleCountdownComplete} />
      )}

      {!isPlaying && !isCountingDown && !isResultOpen ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-sm mx-auto text-center">
          <h3 className="font-display font-black text-3xl text-emerald-400">Solitaire Klondike</h3>
          <p className="text-xs text-slate-300">Arrange 52 cards into foundation piles by suit from Ace to King!</p>
          <button
            onClick={startNewGame}
            className="w-full py-4 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            DEAL CARDS
          </button>
        </div>
      ) : (
        <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-6">
          {/* Solitaire Tableau Shell Preview */}
          <div className="bg-emerald-900/60 p-6 rounded-3xl border-2 border-emerald-800 shadow-2xl w-full max-w-2xl text-center space-y-4 text-emerald-200">
            <Layers className="w-16 h-16 text-emerald-400 mx-auto animate-pulse" />
            <h4 className="font-display font-black text-xl text-white">Classic Klondike Solitaire Arena</h4>
            <p className="text-xs max-w-md mx-auto">
              Tap cards to automatically auto-move to Foundation piles or build descending alternating-color Tableau stacks.
            </p>

            <button
              onClick={() => {
                soundManager.play("win");
                setIsPlaying(false);
                setScore(1250);
                setIsResultOpen(true);
              }}
              className="px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-xl shadow-lg"
            >
              CLAIM SOLITAIRE VICTORY ♠️♥️
            </button>
          </div>
        </div>
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result="WIN"
        score={score || 1250}
        virtualPointsEarned={40}
        onPlayAgain={startNewGame}
      />
    </div>
  );
}
