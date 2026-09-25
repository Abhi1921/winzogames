import React, { useState } from "react";
import { LocalSLState, getCellRowCol, GAME_LADDERS, GAME_SNAKES, PlayerColor } from "./snakesLaddersEngine";
import { soundManager } from "../../components/games/shell/SoundManager";
import { Dices, Trophy, Crown } from "lucide-react";

interface SnakesLaddersBoardProps {
  state: LocalSLState;
  onRollDice: () => void;
  isAiThinking?: boolean;
}

export function SnakesLaddersBoard({ state, onRollDice, isAiThinking }: SnakesLaddersBoardProps) {
  const [isRolling, setIsRolling] = useState(false);
  const currentPlayer = state.players[state.currentTurnIndex];
  const isHumanTurn = currentPlayer && !currentPlayer.isAi;

  const handleRollClick = () => {
    if (!isHumanTurn || state.hasRolledDice || isRolling) return;
    setIsRolling(true);
    soundManager.play("dice");
    setTimeout(() => {
      setIsRolling(false);
      onRollDice();
    }, 400);
  };

  const getTokensAtCell = (cellNum: number) => {
    return state.players.filter((p) => p.position === cellNum);
  };

  const colorStyles: Record<PlayerColor, { bg: string; text: string; token: string }> = {
    red: { bg: "bg-red-500", text: "text-red-500", token: "bg-gradient-to-tr from-red-700 to-red-400 border-red-200" },
    blue: { bg: "bg-blue-500", text: "text-blue-500", token: "bg-gradient-to-tr from-blue-700 to-blue-400 border-blue-200" },
    green: { bg: "bg-emerald-500", text: "text-emerald-500", token: "bg-gradient-to-tr from-emerald-700 to-emerald-400 border-emerald-200" },
    yellow: { bg: "bg-amber-400", text: "text-amber-400", token: "bg-gradient-to-tr from-amber-600 to-amber-300 border-amber-100" },
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto space-y-4 select-none">
      {/* Current Turn & Log Bar */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-white text-xs sm:text-sm font-bold shadow-lg">
        <div className="flex items-center gap-2">
          <span className={`w-3.5 h-3.5 rounded-full ${colorStyles[currentPlayer.color].bg} animate-pulse`} />
          <span>Turn: <strong className={colorStyles[currentPlayer.color].text}>{currentPlayer.name}</strong></span>
        </div>

        {isAiThinking && (
          <span className="text-cyan-400 animate-pulse font-extrabold flex items-center gap-1.5">
            🤖 Computer rolling...
          </span>
        )}

        <div className="text-slate-400 font-normal truncate max-w-[200px] text-right">
          {state.log}
        </div>
      </div>

      {/* 10x10 Snakes & Ladders Board */}
      <div className="w-full aspect-square max-w-[480px] bg-amber-100 dark:bg-slate-950 border-8 border-amber-900/80 dark:border-slate-800 rounded-3xl shadow-2xl relative grid grid-cols-10 grid-rows-10 p-1.5 gap-1 overflow-hidden">
        {Array.from({ length: 100 }).map((_, idx) => {
          const num = 100 - idx;
          const { r, c } = getCellRowCol(num);
          const isEvenRow = (9 - r) % 2 === 0;
          const isAlternate = (r + c) % 2 === 0;
          const tokensHere = getTokensAtCell(num);

          const isLadderStart = GAME_LADDERS.some((l) => l.start === num);
          const isSnakeHead = GAME_SNAKES.some((s) => s.start === num);

          return (
            <div
              key={num}
              className={`relative flex items-start justify-start p-1 font-extrabold text-[10px] sm:text-xs rounded-lg border transition-all ${
                num === 100
                  ? "bg-amber-400 text-slate-950 border-amber-300 font-black shadow-glow"
                  : num === 1
                  ? "bg-cyan-500 text-white border-cyan-400 font-black"
                  : isAlternate
                  ? "bg-slate-800/80 text-slate-200 border-slate-700/60"
                  : "bg-slate-900 text-slate-300 border-slate-800/60"
              }`}
            >
              <span>{num}</span>

              {isLadderStart && <span className="absolute top-1 right-1 text-emerald-400 font-black text-xs">🪜</span>}
              {isSnakeHead && <span className="absolute top-1 right-1 text-rose-500 font-black text-xs">🐍</span>}

              {/* Render Tokens on this Cell */}
              <div className="absolute inset-0 flex items-center justify-center gap-1">
                {tokensHere.map((p) => (
                  <div
                    key={p.id}
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 shadow-lg flex items-center justify-center font-black text-[10px] text-white ${
                      colorStyles[p.color].token
                    } animate-bounce z-10`}
                  >
                    ●
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dice Control Bar */}
      <div className="flex items-center justify-center gap-6 pt-2">
        <button
          disabled={!isHumanTurn || state.hasRolledDice || isRolling}
          onClick={handleRollClick}
          className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-3 shadow-xl transition-all ${
            isHumanTurn && !state.hasRolledDice
              ? "bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-600 hover:scale-105 text-white active:scale-95 shadow-glow"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          <Dices className={`w-6 h-6 ${isRolling ? "animate-spin" : ""}`} />
          <span>{isRolling ? "ROLLING..." : "ROLL DICE"}</span>
        </button>

        <div className="w-14 h-14 bg-slate-900 border-2 border-slate-700 rounded-2xl flex items-center justify-center font-display font-black text-2xl text-cyan-400 shadow-glow">
          {state.currentDiceValue || "-"}
        </div>
      </div>
    </div>
  );
}
