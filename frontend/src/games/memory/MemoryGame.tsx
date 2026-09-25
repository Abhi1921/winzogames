import React, { useState, useEffect } from "react";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { soundManager } from "../../components/games/shell/SoundManager";
import { Sparkles, Star, Zap, Shield, Flame, Heart, Crown, Gem } from "lucide-react";

const CARD_SYMBOLS = ["⭐", "💎", "🔥", "👑", "🚀", "⚡", "🍀", "🎯", "🎨", "🎮", "🧩", "🎲"];

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryGame() {
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const startNewGame = () => {
    setIsCountingDown(true);
    setIsResultOpen(false);
  };

  const handleCountdownComplete = () => {
    const pairCount = difficulty === "EASY" ? 6 : difficulty === "MEDIUM" ? 8 : 12;
    const selectedSymbols = CARD_SYMBOLS.slice(0, pairCount);
    const deck = [...selectedSymbols, ...selectedSymbols]
      .sort(() => Math.random() - 0.5)
      .map((sym, idx) => ({
        id: idx,
        symbol: sym,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setScore(0);
    setTimerSeconds(0);
    setIsCountingDown(false);
    setIsPlaying(true);
    setIsPaused(false);
  };

  useEffect(() => {
    if (!isPlaying || isPaused || isResultOpen) return;
    const interval = setInterval(() => setTimerSeconds((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, isResultOpen]);

  const handleCardClick = (index: number) => {
    if (!isPlaying || isPaused || cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2) return;

    soundManager.play("flip");
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (newCards[firstIdx].symbol === newCards[secondIdx].symbol) {
        // Match!
        soundManager.play("correct");
        newCards[firstIdx].isMatched = true;
        newCards[secondIdx].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
        setScore((s) => s + 100);

        // Check Victory
        if (newCards.every((c) => c.isMatched)) {
          soundManager.play("win");
          setIsPlaying(false);
          setIsResultOpen(true);
        }
      } else {
        // No match
        setTimeout(() => {
          soundManager.play("wrong");
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards(newCards);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  return (
    <div className="w-full flex flex-col min-h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative select-none">
      <GameHeader
        title="Memory Match"
        category="Brain Games"
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        timerSeconds={timerSeconds}
        score={score}
        onRestart={startNewGame}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="Memory Match" onComplete={handleCountdownComplete} />
      )}

      {!isPlaying && !isCountingDown && !isResultOpen ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-sm mx-auto text-center">
          <h3 className="font-display font-black text-3xl text-cyan-400">Memory Match</h3>
          <p className="text-xs text-slate-400">Test your visual memory by flipping and matching card pairs!</p>
          <button
            onClick={startNewGame}
            className="w-full py-4 bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-600 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            START MATCHING
          </button>
        </div>
      ) : (
        <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-4">
          <div className="text-xs font-bold text-slate-400">Moves: <span className="text-cyan-400 font-extrabold">{moves}</span></div>

          <div
            className={`grid gap-3 bg-slate-900 p-4 rounded-2xl border-2 border-slate-800 shadow-2xl max-w-md w-full ${
              difficulty === "EASY" ? "grid-cols-4" : difficulty === "MEDIUM" ? "grid-cols-4" : "grid-cols-6"
            }`}
          >
            {cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`aspect-square rounded-2xl border-2 font-bold text-2xl sm:text-3xl flex items-center justify-center transition-all duration-300 transform perspective-1000 ${
                  card.isFlipped || card.isMatched
                    ? "bg-slate-800 border-cyan-400/80 text-white scale-105 shadow-glow"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-700 hover:scale-95"
                }`}
              >
                {card.isFlipped || card.isMatched ? card.symbol : "❓"}
              </button>
            ))}
          </div>
        </div>
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result="WIN"
        score={Math.max(100, 1000 - moves * 20 - timerSeconds * 2)}
        virtualPointsEarned={30}
        onPlayAgain={startNewGame}
      />
    </div>
  );
}
