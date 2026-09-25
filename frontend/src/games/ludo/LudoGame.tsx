import React, { useState, useEffect } from "react";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { LudoBoard } from "./LudoBoard";
import { createInitialLocalLudoState, executeLocalMove, isMoveLegal, LocalLudoState } from "./ludoEngine";
import { getAiBestMoveTokenId } from "./ludoAI";
import { soundManager } from "../../components/games/shell/SoundManager";
import { Users, Bot, Globe, ShieldCheck } from "lucide-react";

export function LudoGame() {
  const [mode, setMode] = useState<"VS_AI" | "LOCAL_2P" | "LOCAL_4P">("VS_AI");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [state, setState] = useState<LocalLudoState | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const startNewGame = () => {
    setIsCountingDown(true);
    setIsResultOpen(false);
  };

  const handleCountdownComplete = () => {
    setIsCountingDown(false);
    const initialState = createInitialLocalLudoState(mode, difficulty);
    setState(initialState);
  };

  const handleRollDice = () => {
    if (!state || state.hasRolledDice || state.status !== "PLAYING") return;
    const diceValue = Math.floor(Math.random() * 6) + 1;
    const currentPlayer = state.players[state.currentTurnIndex];

    const hasLegal = currentPlayer.tokens.some((t) => isMoveLegal(t, diceValue));
    let nextTurnIndex = state.currentTurnIndex;
    let logMsg = `${currentPlayer.name} rolled a ${diceValue}!`;

    if (!hasLegal && diceValue !== 6) {
      logMsg += " (No legal moves. Next turn)";
      nextTurnIndex = (state.currentTurnIndex + 1) % state.players.length;
    }

    setState({
      ...state,
      currentDiceValue: diceValue,
      hasRolledDice: hasLegal || diceValue === 6,
      currentTurnIndex: nextTurnIndex,
      log: logMsg,
    });
  };

  const handleSelectToken = (tokenId: number) => {
    if (!state || !state.hasRolledDice) return;
    const res = executeLocalMove(state, tokenId);
    if (res.captured) soundManager.play("capture");
    else soundManager.play("move");

    setState(res.newState);
    if (res.newState.status === "FINISHED") {
      setIsResultOpen(true);
    }
  };

  // AI Turn Handler
  useEffect(() => {
    if (!state || state.status !== "PLAYING" || isAiThinking) return;
    const currentPlayer = state.players[state.currentTurnIndex];
    if (!currentPlayer || !currentPlayer.isAi) return;

    setIsAiThinking(true);

    const timer1 = setTimeout(() => {
      // 1. AI Rolls Dice
      const diceValue = Math.floor(Math.random() * 6) + 1;
      soundManager.play("dice");

      const hasLegal = currentPlayer.tokens.some((t) => isMoveLegal(t, diceValue));
      let logMsg = `${currentPlayer.name} rolled a ${diceValue}!`;
      let nextTurn = state.currentTurnIndex;

      if (!hasLegal && diceValue !== 6) {
        logMsg += " (No valid move).";
        nextTurn = (state.currentTurnIndex + 1) % state.players.length;
        setState({
          ...state,
          currentDiceValue: diceValue,
          hasRolledDice: false,
          currentTurnIndex: nextTurn,
          log: logMsg,
        });
        setIsAiThinking(false);
        return;
      }

      const tempState: LocalLudoState = {
        ...state,
        currentDiceValue: diceValue,
        hasRolledDice: true,
        log: logMsg,
      };
      setState(tempState);

      // 2. AI Picks Best Token Move
      const timer2 = setTimeout(() => {
        const bestTokenId = getAiBestMoveTokenId(tempState, difficulty);
        if (typeof bestTokenId === "number") {
          const moveRes = executeLocalMove(tempState, bestTokenId);
          if (moveRes.captured) soundManager.play("capture");
          else soundManager.play("move");

          setState(moveRes.newState);
          if (moveRes.newState.status === "FINISHED") {
            setIsResultOpen(true);
          }
        }
        setIsAiThinking(false);
      }, 700);

      return () => clearTimeout(timer2);
    }, 800);

    return () => clearTimeout(timer1);
  }, [state, isAiThinking, difficulty]);

  return (
    <div className="w-full flex flex-col min-h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <GameHeader
        title="Ludo Classic & Multiplayer"
        category="Board Games"
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onRestart={startNewGame}
        statusText={state ? state.log : "Select Mode & Play"}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="Ludo Classic" onComplete={handleCountdownComplete} />
      )}

      {!state && !isCountingDown ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-lg mx-auto text-center">
          <div className="p-4 rounded-3xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Bot className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-black text-2xl">Ludo Match Setup</h3>
            <p className="text-xs text-slate-400">
              Select game mode to launch a local or AI match with full Ludo rule enforcement.
            </p>
          </div>

          {/* Mode Selection */}
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
            className="w-full py-4 bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-600 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            START LUDO MATCH
          </button>
        </div>
      ) : (
        state && (
          <div className="flex-1 p-4 flex items-center justify-center">
            <LudoBoard
              state={state}
              onRollDice={handleRollDice}
              onSelectToken={handleSelectToken}
              isAiThinking={isAiThinking}
            />
          </div>
        )
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result={state?.winner?.isAi ? "LOSS" : "WIN"}
        score={state?.winner?.isAi ? 200 : 1000}
        virtualPointsEarned={50}
        onPlayAgain={startNewGame}
        title={`Winner: ${state?.winner?.name || "Player"}`}
      />
    </div>
  );
}
