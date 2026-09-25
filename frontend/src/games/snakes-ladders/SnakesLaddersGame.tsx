import React, { useState, useEffect } from "react";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { SnakesLaddersBoard } from "./SnakesLaddersBoard";
import { createInitialSLState, executeSLMove, LocalSLState } from "./snakesLaddersEngine";
import { soundManager } from "../../components/games/shell/SoundManager";
import { Users, Bot, Trophy } from "lucide-react";

export function SnakesLaddersGame() {
  const [mode, setMode] = useState<"VS_AI" | "LOCAL_2P" | "LOCAL_3P" | "LOCAL_4P">("VS_AI");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [state, setState] = useState<LocalSLState | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const startNewGame = () => {
    setIsCountingDown(true);
    setIsResultOpen(false);
  };

  const handleCountdownComplete = () => {
    setIsCountingDown(false);
    const initialState = createInitialSLState(mode, difficulty);
    setState(initialState);
  };

  const handleRollDice = () => {
    if (!state || state.hasRolledDice || state.status !== "PLAYING") return;
    const diceValue = Math.floor(Math.random() * 6) + 1;
    const resState = executeSLMove(state, diceValue);
    soundManager.play("move");

    setState(resState);
    if (resState.status === "FINISHED") {
      setIsResultOpen(true);
    }
  };

  // AI Turn Handler
  useEffect(() => {
    if (!state || state.status !== "PLAYING" || isAiThinking) return;
    const currentPlayer = state.players[state.currentTurnIndex];
    if (!currentPlayer || !currentPlayer.isAi) return;

    setIsAiThinking(true);

    const timer = setTimeout(() => {
      const diceValue = Math.floor(Math.random() * 6) + 1;
      soundManager.play("dice");

      const moveRes = executeSLMove(state, diceValue);
      setState(moveRes);

      if (moveRes.status === "FINISHED") {
        setIsResultOpen(true);
      }
      setIsAiThinking(false);
    }, 900);

    return () => clearTimeout(timer);
  }, [state, isAiThinking]);

  return (
    <div className="w-full flex flex-col min-h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <GameHeader
        title="Snakes & Ladders"
        category="Retro / Classic"
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onRestart={startNewGame}
        statusText={state ? state.log : "Select Mode & Play"}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="Snakes & Ladders" onComplete={handleCountdownComplete} />
      )}

      {!state && !isCountingDown ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-lg mx-auto text-center">
          <div className="p-4 rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Trophy className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-black text-2xl">Snakes & Ladders Setup</h3>
            <p className="text-xs text-slate-400">
              Race to 100 on the classic 100-square board! Climb ladders and dodge swallowing snakes.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full">
            <button
              onClick={() => setMode("VS_AI")}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                mode === "VS_AI"
                  ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-glow"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Bot className="w-6 h-6" /> VS Computer
            </button>

            <button
              onClick={() => setMode("LOCAL_2P")}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                mode === "LOCAL_2P"
                  ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-glow"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-6 h-6" /> 2 Players
            </button>

            <button
              onClick={() => setMode("LOCAL_4P")}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                mode === "LOCAL_4P"
                  ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-glow"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-6 h-6 text-amber-400" /> 4 Players
            </button>
          </div>

          <button
            onClick={startNewGame}
            className="w-full py-4 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            START SNAKES & LADDERS
          </button>
        </div>
      ) : (
        state && (
          <div className="flex-1 p-4 flex items-center justify-center">
            <SnakesLaddersBoard state={state} onRollDice={handleRollDice} isAiThinking={isAiThinking} />
          </div>
        )
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result={state?.winner?.isAi ? "LOSS" : "WIN"}
        score={state?.winner?.isAi ? 200 : 1000}
        virtualPointsEarned={40}
        onPlayAgain={startNewGame}
        title={`Winner: ${state?.winner?.name || "Player"}`}
      />
    </div>
  );
}
