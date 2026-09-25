import React, { useState } from "react";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { soundManager } from "../../components/games/shell/SoundManager";

type Choice = "ROCK" | "PAPER" | "SCISSORS";

export function RPSGame() {
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [aiChoice, setAiChoice] = useState<Choice | null>(null);
  const [roundResult, setRoundResult] = useState<string | null>(null);

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const startNewGame = () => {
    setIsCountingDown(true);
    setIsResultOpen(false);
  };

  const handleCountdownComplete = () => {
    setPlayerScore(0);
    setAiScore(0);
    setPlayerChoice(null);
    setAiChoice(null);
    setRoundResult(null);
    setIsCountingDown(false);
    setIsPlaying(true);
  };

  const handleChoose = (choice: Choice) => {
    if (!isPlaying) return;
    soundManager.play("click");

    const choices: Choice[] = ["ROCK", "PAPER", "SCISSORS"];
    const compChoice = choices[Math.floor(Math.random() * choices.length)];

    setPlayerChoice(choice);
    setAiChoice(compChoice);

    if (choice === compChoice) {
      setRoundResult("ROUND DRAW!");
    } else if (
      (choice === "ROCK" && compChoice === "SCISSORS") ||
      (choice === "PAPER" && compChoice === "ROCK") ||
      (choice === "SCISSORS" && compChoice === "PAPER")
    ) {
      soundManager.play("win");
      const newScore = playerScore + 1;
      setPlayerScore(newScore);
      setRoundResult("YOU WIN THIS ROUND!");

      if (newScore >= 3) {
        setIsPlaying(false);
        setIsResultOpen(true);
      }
    } else {
      soundManager.play("wrong");
      const newAiScore = aiScore + 1;
      setAiScore(newAiScore);
      setRoundResult("COMPUTER WINS THIS ROUND!");

      if (newAiScore >= 3) {
        setIsPlaying(false);
        setIsResultOpen(true);
      }
    }
  };

  const icons: Record<Choice, string> = {
    ROCK: "✊",
    PAPER: "✋",
    SCISSORS: "✌️",
  };

  return (
    <div className="w-full flex flex-col min-h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative select-none">
      <GameHeader
        title="Rock Paper Scissors"
        category="Classic"
        score={playerScore * 100}
        onRestart={startNewGame}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="Rock Paper Scissors" onComplete={handleCountdownComplete} />
      )}

      {!isPlaying && !isCountingDown && !isResultOpen ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-sm mx-auto text-center">
          <h3 className="font-display font-black text-3xl text-amber-400">Rock Paper Scissors</h3>
          <p className="text-xs text-slate-400">Best of 5 match against Computer AI!</p>
          <button
            onClick={startNewGame}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            START MATCH
          </button>
        </div>
      ) : (
        <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center justify-between w-full max-w-md bg-slate-900 p-4 rounded-2xl border border-slate-800 text-white font-bold">
            <div className="text-center">
              <div className="text-xs text-slate-400">YOU</div>
              <div className="font-display font-black text-3xl text-cyan-400">{playerScore}</div>
            </div>
            <div className="text-sm font-extrabold text-amber-400 font-mono">FIRST TO 3</div>
            <div className="text-center">
              <div className="text-xs text-slate-400">COMPUTER</div>
              <div className="font-display font-black text-3xl text-purple-400">{aiScore}</div>
            </div>
          </div>

          {/* Showdown Display */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-slate-900 border-2 border-cyan-500/40 p-6 rounded-3xl text-center space-y-2">
              <div className="text-5xl">{playerChoice ? icons[playerChoice] : "❓"}</div>
              <div className="text-xs font-bold text-slate-300">Your Choice</div>
            </div>
            <div className="bg-slate-900 border-2 border-purple-500/40 p-6 rounded-3xl text-center space-y-2">
              <div className="text-5xl">{aiChoice ? icons[aiChoice] : "❓"}</div>
              <div className="text-xs font-bold text-slate-300">Computer Choice</div>
            </div>
          </div>

          {roundResult && <div className="font-display font-black text-base text-amber-400">{roundResult}</div>}

          {/* Choice Buttons */}
          <div className="flex gap-4">
            {(["ROCK", "PAPER", "SCISSORS"] as const).map((choice) => (
              <button
                key={choice}
                onClick={() => handleChoose(choice)}
                className="w-20 h-20 bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-cyan-400 rounded-2xl flex flex-col items-center justify-center text-3xl shadow-xl hover:scale-110 transition-all active:scale-95"
              >
                {icons[choice]}
              </button>
            ))}
          </div>
        </div>
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result={playerScore >= 3 ? "WIN" : "LOSS"}
        score={playerScore * 300}
        virtualPointsEarned={25}
        onPlayAgain={startNewGame}
      />
    </div>
  );
}
