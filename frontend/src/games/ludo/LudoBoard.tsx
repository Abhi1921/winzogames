import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LocalLudoState, PlayerColor, isMoveLegal, LudoToken } from "./ludoEngine";
import { soundManager } from "../../components/games/shell/SoundManager";
import { Dices, Crown, Sparkles } from "lucide-react";

interface LudoBoardProps {
  state: LocalLudoState;
  onRollDice: () => void;
  onSelectToken: (tokenId: number) => void;
  isAiThinking?: boolean;
}

export function LudoBoard({ state, onRollDice, onSelectToken, isAiThinking }: LudoBoardProps) {
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

  const getPlayerByColor = (color: PlayerColor) => state.players.find((p) => p.color === color);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto space-y-4 select-none">
      {/* Top Player Cards Bar (Red & Green) */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <PlayerHudCard player={getPlayerByColor("red")} isCurrentTurn={currentPlayer.color === "red"} />
        <PlayerHudCard player={getPlayerByColor("green")} isCurrentTurn={currentPlayer.color === "green"} />
      </div>

      {/* Traditional 15x15 Ludo Board */}
      <div className="w-full aspect-square max-w-[480px] bg-amber-50 dark:bg-slate-950 border-8 border-amber-900/80 dark:border-slate-800 rounded-3xl shadow-2xl relative grid grid-cols-15 grid-rows-15 p-1.5 gap-0.5 overflow-hidden">
        {/* RED YARD (Top-Left 6x6) */}
        <YardArea color="red" player={getPlayerByColor("red")} isHumanTurn={isHumanTurn} state={state} onSelectToken={onSelectToken} />

        {/* TOP PATH (Green Track 3x6) */}
        <TrackArm direction="TOP" state={state} isHumanTurn={isHumanTurn} onSelectToken={onSelectToken} />

        {/* GREEN YARD (Top-Right 6x6) */}
        <YardArea color="green" player={getPlayerByColor("green")} isHumanTurn={isHumanTurn} state={state} onSelectToken={onSelectToken} />

        {/* LEFT PATH (Red Track 6x3) */}
        <TrackArm direction="LEFT" state={state} isHumanTurn={isHumanTurn} onSelectToken={onSelectToken} />

        {/* CENTER FINISH GOAL (3x3) */}
        <div className="col-span-3 row-span-3 bg-slate-900 border-2 border-slate-700 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-2xl">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            <div className="bg-red-500 opacity-90 border-r border-b border-white/20" />
            <div className="bg-emerald-500 opacity-90 border-l border-b border-white/20" />
            <div className="bg-blue-500 opacity-90 border-r border-t border-white/20" />
            <div className="bg-amber-400 opacity-90 border-l border-t border-white/20" />
          </div>

          <div className="relative z-10 w-10 h-10 rounded-full bg-slate-950 border-2 border-amber-300 flex items-center justify-center shadow-glow text-amber-300">
            <Crown className="w-5 h-5 fill-current animate-bounce" />
          </div>
        </div>

        {/* RIGHT PATH (Yellow Track 6x3) */}
        <TrackArm direction="RIGHT" state={state} isHumanTurn={isHumanTurn} onSelectToken={onSelectToken} />

        {/* BLUE YARD (Bottom-Left 6x6) */}
        <YardArea color="blue" player={getPlayerByColor("blue")} isHumanTurn={isHumanTurn} state={state} onSelectToken={onSelectToken} />

        {/* BOTTOM PATH (Blue Track 3x6) */}
        <TrackArm direction="BOTTOM" state={state} isHumanTurn={isHumanTurn} onSelectToken={onSelectToken} />

        {/* YELLOW YARD (Bottom-Right 6x6) */}
        <YardArea color="yellow" player={getPlayerByColor("yellow")} isHumanTurn={isHumanTurn} state={state} onSelectToken={onSelectToken} />
      </div>

      {/* Bottom Player Cards Bar (Blue & Yellow) */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <PlayerHudCard player={getPlayerByColor("blue")} isCurrentTurn={currentPlayer.color === "blue"} />
        <PlayerHudCard player={getPlayerByColor("yellow")} isCurrentTurn={currentPlayer.color === "yellow"} />
      </div>

      {/* Dice & Turn Action Button */}
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

function PlayerHudCard({ player, isCurrentTurn }: { player?: any; isCurrentTurn: boolean }) {
  if (!player) return <div className="h-14 bg-slate-900/40 rounded-xl" />;

  const colorStyles: Record<PlayerColor, string> = {
    red: "border-red-500 text-red-400",
    green: "border-emerald-500 text-emerald-400",
    yellow: "border-amber-400 text-amber-300",
    blue: "border-blue-500 text-blue-400",
  };

  return (
    <div
      className={`bg-slate-900 border-2 p-3 rounded-2xl flex items-center justify-between shadow-lg transition-all ${
        colorStyles[player.color as PlayerColor]
      } ${isCurrentTurn ? "ring-4 ring-cyan-400/50 scale-105 bg-slate-850" : "opacity-80"}`}
    >
      <div>
        <div className="font-extrabold text-xs text-white truncate max-w-[110px]">{player.name}</div>
        <div className="text-[10px] text-slate-400 font-bold">Home: {player.tokensHome || 0}/4</div>
      </div>
      <div className="flex gap-1">
        {player.tokens.map((t: any) => (
          <span
            key={t.id}
            className={`w-2.5 h-2.5 rounded-full ${
              t.position === 999 ? "bg-amber-400" : t.position === -1 ? "bg-slate-700" : "bg-cyan-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function YardArea({
  color,
  player,
  isHumanTurn,
  state,
  onSelectToken,
}: {
  color: PlayerColor;
  player?: any;
  isHumanTurn: boolean;
  state: LocalLudoState;
  onSelectToken: (id: number) => void;
}) {
  const yardBg: Record<PlayerColor, string> = {
    red: "bg-red-600 border-red-700",
    green: "bg-emerald-600 border-emerald-700",
    yellow: "bg-amber-500 border-amber-600",
    blue: "bg-blue-600 border-blue-700",
  };

  return (
    <div className={`col-span-6 row-span-6 rounded-2xl p-3 flex items-center justify-center relative border-2 shadow-md ${yardBg[color]}`}>
      <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl border-4 border-white/60 p-2 grid grid-cols-2 grid-rows-2 gap-2 shadow-inner">
        {player?.tokens.map((token: LudoToken) => {
          const isInYard = token.position === -1;
          const isClickable =
            isHumanTurn &&
            state.hasRolledDice &&
            player.color === state.players[state.currentTurnIndex].color &&
            isMoveLegal(token, state.currentDiceValue || 0, state.rules);

          return (
            <div key={token.id} className="flex items-center justify-center">
              {isInYard ? (
                <TokenGraphic color={color} isClickable={isClickable} onClick={() => onSelectToken(token.id)} />
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-dashed border-slate-300/40 bg-slate-100/20" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrackArm({
  direction,
  state,
  isHumanTurn,
  onSelectToken,
}: {
  direction: "TOP" | "BOTTOM" | "LEFT" | "RIGHT";
  state: LocalLudoState;
  isHumanTurn: boolean;
  onSelectToken: (id: number) => void;
}) {
  const gridClass =
    direction === "TOP" || direction === "BOTTOM"
      ? "col-span-3 row-span-6 grid grid-cols-3 grid-rows-6"
      : "col-span-6 row-span-3 grid grid-cols-6 grid-rows-3";

  return (
    <div className={`${gridClass} gap-0.5 bg-slate-200 dark:bg-slate-900 p-0.5 border border-slate-300 dark:border-slate-800`}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-950 border border-slate-300/40 dark:border-slate-800/40 flex items-center justify-center relative">
          {/* Star safe indicators */}
          {((direction === "TOP" && i === 7) || (direction === "LEFT" && i === 6) || (direction === "RIGHT" && i === 11) || (direction === "BOTTOM" && i === 10)) && (
            <span className="text-amber-400 font-extrabold text-xs">★</span>
          )}
        </div>
      ))}
    </div>
  );
}

function TokenGraphic({ color, isClickable, onClick }: { color: PlayerColor; isClickable: boolean; onClick: () => void }) {
  const tokenGradients: Record<PlayerColor, string> = {
    red: "bg-gradient-to-tr from-red-700 via-red-500 to-red-300 border-red-200",
    green: "bg-gradient-to-tr from-emerald-700 via-emerald-500 to-emerald-300 border-emerald-200",
    yellow: "bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 border-amber-100",
    blue: "bg-gradient-to-tr from-blue-700 via-blue-500 to-blue-300 border-blue-200",
  };

  return (
    <button
      disabled={!isClickable}
      onClick={onClick}
      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 shadow-lg flex items-center justify-center transition-all ${
        tokenGradients[color]
      } ${isClickable ? "ring-4 ring-cyan-400 animate-bounce cursor-pointer scale-110 z-20" : ""}`}
    >
      <span className="w-2.5 h-2.5 rounded-full bg-white/80 shadow-inner" />
    </button>
  );
}
