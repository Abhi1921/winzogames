import React, { useRef, useEffect, useState } from "react";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { soundManager } from "../../components/games/shell/SoundManager";
import { Shield, Zap, Target, Trophy } from "lucide-react";

type ShotType = "DRIVE" | "LOFT" | "PULL" | "DEFEND";

export function CricketGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [ballsBowled, setBallsBowled] = useState(0);
  const maxBalls = 12; // 2 Overs
  const targetRuns = 25; // Target to win

  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [commentary, setCommentary] = useState("Press SWING BAT when the ball reaches the hitting zone!");
  const [timingMeter, setTimingMeter] = useState<number>(0);
  const [isBallInFlight, setIsBallInFlight] = useState(false);
  const [lastShotResult, setLastShotResult] = useState<string | null>(null);

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [gameResult, setGameResult] = useState<"WIN" | "LOSS">("WIN");

  const startNewGame = () => {
    setIsCountingDown(true);
    setIsResultOpen(false);
  };

  const handleCountdownComplete = () => {
    setRuns(0);
    setWickets(0);
    setBallsBowled(0);
    setCommentary("Match started! Target: 25 runs in 12 balls.");
    setLastShotResult(null);
    setIsBallInFlight(false);
    setIsCountingDown(false);
    setIsPlaying(true);
    setIsPaused(false);
  };

  // Ball animation & Pitch loop
  useEffect(() => {
    if (!isPlaying || isPaused || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let ballY = 60; // Bowler end
    let ballX = canvas.width / 2;
    let ballSpeed = difficulty === "EASY" ? 3.5 : difficulty === "MEDIUM" ? 5 : 7;
    let ballActive = false;

    const drawStadium = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Green Grass Outfield
      ctx.fillStyle = "#15803d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Boundary Oval Line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 15, canvas.height / 2 - 15, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Pitch Strip
      ctx.fillStyle = "#d97706";
      ctx.fillRect(canvas.width / 2 - 25, 50, 50, 260);

      // Crease Lines & Stumps
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      // Bowler Crease
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 20, 70);
      ctx.lineTo(canvas.width / 2 + 20, 70);
      ctx.stroke();
      // Batsman Crease
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 20, 280);
      ctx.lineTo(canvas.width / 2 + 20, 280);
      ctx.stroke();

      // Stumps (Batsman End)
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(canvas.width / 2 - 6, 282, 3, 12);
      ctx.fillRect(canvas.width / 2 - 1, 282, 3, 12);
      ctx.fillRect(canvas.width / 2 + 4, 282, 3, 12);

      // Hitting Zone Box
      ctx.fillStyle = "rgba(0, 240, 255, 0.15)";
      ctx.fillRect(canvas.width / 2 - 30, 250, 60, 40);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.6)";
      ctx.strokeRect(canvas.width / 2 - 30, 250, 60, 40);

      // Batsman Silhouette
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(canvas.width / 2 + 15, 275, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(canvas.width / 2 + 12, 283, 6, 18);

      // Draw Ball
      if (ballActive) {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const updateBall = () => {
      drawStadium();

      if (ballActive) {
        ballY += ballSpeed;
        setTimingMeter((ballY - 50) / 250);

        if (ballY >= 310) {
          // Missed ball! Stumps rattled or Dot ball
          ballActive = false;
          setIsBallInFlight(false);
          soundManager.play("wrong");
          setWickets((w) => {
            const newW = w + 1;
            setCommentary("❌ BOWLED OUT! Stumps rattled!");
            if (newW >= 3) {
              handleGameEnd("LOSS");
            }
            return newW;
          });
          setBallsBowled((b) => {
            const newB = b + 1;
            if (newB >= maxBalls && wickets < 3) {
              handleGameEnd(runs >= targetRuns ? "WIN" : "LOSS");
            }
            return newB;
          });
        }
      }

      animId = requestAnimationFrame(updateBall);
    };

    ballActive = true;
    setIsBallInFlight(true);
    updateBall();

    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isPaused, ballsBowled, difficulty]);

  const handleSwingBat = (shot: ShotType) => {
    if (!isPlaying || !isBallInFlight) return;
    setIsBallInFlight(false);

    // Evaluate timing meter (0.0 to 1.0; Perfect zone: 0.75 - 0.85)
    const meter = timingMeter;
    let runResult = 0;
    let comment = "";

    if (meter >= 0.72 && meter <= 0.88) {
      // Perfect Timing!
      if (shot === "LOFT") {
        runResult = 6;
        comment = "🚀 SIXER! Huge shot over the boundary!";
        soundManager.play("win");
      } else if (shot === "DRIVE") {
        runResult = 4;
        comment = "⚡ FOUR! Beautiful cover drive to the fence!";
        soundManager.play("correct");
      } else {
        runResult = 2;
        comment = "🏏 Smooth placement! 2 Runs taken.";
        soundManager.play("move");
      }
    } else if (meter >= 0.55 && meter <= 0.95) {
      // Good Timing
      runResult = 1;
      comment = "👍 Single taken.";
      soundManager.play("move");
    } else {
      // Poor timing -> CAUGHT OUT!
      soundManager.play("wrong");
      comment = "💥 CAUGHT OUT! Miscued the shot directly to fielder!";
      setWickets((w) => {
        const newW = w + 1;
        if (newW >= 3) handleGameEnd("LOSS");
        return newW;
      });
      setBallsBowled((b) => {
        const newB = b + 1;
        if (newB >= maxBalls) handleGameEnd(runs >= targetRuns ? "WIN" : "LOSS");
        return newB;
      });
      setCommentary(comment);
      return;
    }

    const newRuns = runs + runResult;
    setRuns(newRuns);
    setLastShotResult(`+${runResult}`);
    setCommentary(comment);

    const newBalls = ballsBowled + 1;
    setBallsBowled(newBalls);

    if (newRuns >= targetRuns) {
      handleGameEnd("WIN");
    } else if (newBalls >= maxBalls) {
      handleGameEnd(newRuns >= targetRuns ? "WIN" : "LOSS");
    }
  };

  const handleGameEnd = (result: "WIN" | "LOSS") => {
    setIsPlaying(false);
    setGameResult(result);
    setIsResultOpen(true);
    if (result === "WIN") soundManager.play("win");
    else soundManager.play("lose");
  };

  return (
    <div className="w-full flex flex-col min-h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative select-none">
      <GameHeader
        title="Cricket Premier League"
        category="Sports"
        score={runs}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onRestart={startNewGame}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="Cricket Premier League" onComplete={handleCountdownComplete} />
      )}

      {!isPlaying && !isCountingDown && !isResultOpen ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-sm mx-auto text-center">
          <div className="p-4 rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Trophy className="w-12 h-12" />
          </div>
          <h3 className="font-display font-black text-3xl text-amber-400">Cricket Action</h3>
          <p className="text-xs text-slate-400">Chase 25 runs in 2 Overs (12 balls)! Time your shots to score 4s and 6s!</p>
          <button
            onClick={startNewGame}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            START MATCH
          </button>
        </div>
      ) : (
        <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-4">
          {/* Scoreboard Banner */}
          <div className="flex items-center justify-between w-full max-w-md bg-slate-900 border border-slate-800 p-3 rounded-2xl text-white text-xs font-bold shadow-lg">
            <div>
              <span className="text-slate-400">Score:</span>{" "}
              <strong className="text-cyan-400 text-base">{runs}/{wickets}</strong>
            </div>
            <div>
              <span className="text-slate-400">Overs:</span>{" "}
              <strong className="text-amber-400">{Math.floor(ballsBowled / 6)}.{ballsBowled % 6} / 2.0</strong>
            </div>
            <div>
              <span className="text-slate-400">Target:</span>{" "}
              <strong className="text-emerald-400">25</strong>
            </div>
          </div>

          {/* Stadium Canvas */}
          <canvas
            ref={canvasRef}
            width={440}
            height={340}
            className="bg-slate-900 border-2 border-slate-800 rounded-2xl shadow-2xl"
          />

          {/* Commentary Log */}
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-center text-cyan-300 font-bold truncate">
            {commentary}
          </div>

          {/* Shot Buttons */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-md">
            <button
              onClick={() => handleSwingBat("DRIVE")}
              className="py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              ⚡ COVER DRIVE (4)
            </button>

            <button
              onClick={() => handleSwingBat("LOFT")}
              className="py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              🚀 LOFTED SIX (6)
            </button>

            <button
              onClick={() => handleSwingBat("DEFEND")}
              className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              🛡️ DEFEND (1-2)
            </button>
          </div>
        </div>
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result={gameResult}
        score={runs * 50}
        virtualPointsEarned={35}
        onPlayAgain={startNewGame}
        title={`Final Score: ${runs}/${wickets} in ${Math.floor(ballsBowled / 6)}.${ballsBowled % 6} overs`}
      />
    </div>
  );
}
