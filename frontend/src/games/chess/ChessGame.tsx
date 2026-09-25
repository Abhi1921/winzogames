import React, { useState, useEffect, useRef } from "react";
import { Chess, Square, Move } from "chess.js";
import { GameHeader } from "../../components/games/shell/GameHeader";
import { GameResultModal } from "../../components/games/shell/GameResultModal";
import { GameLaunchCountdown } from "../../components/games/shell/GameLaunchCountdown";
import { soundManager } from "../../components/games/shell/SoundManager";
import { RotateCcw, ShieldAlert, Trophy, Clock, Bot, User } from "lucide-react";

interface ChessGameProps {
  onGameOver?: (score: number, resultType: "WIN" | "LOSS") => void;
}

export function ChessGame({ onGameOver }: ChessGameProps) {
  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);

  const [mode, setMode] = useState<"VS_AI" | "LOCAL_2P">("VS_AI");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [clockMinutes, setClockMinutes] = useState<number | null>(10);
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [gameResult, setGameResult] = useState<"WIN" | "LOSS" | "DRAW">("WIN");
  const [statusMsg, setStatusMsg] = useState("White's turn to move");

  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]);

  const startMatch = () => {
    chess.reset();
    setFen(chess.fen());
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setMoveHistory([]);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setWhiteTime((clockMinutes || 10) * 60);
    setBlackTime((clockMinutes || 10) * 60);
    setIsResultOpen(false);
    setIsCountingDown(true);
  };

  const handleCountdownComplete = () => {
    setIsCountingDown(false);
    setIsStarted(true);
    setStatusMsg("White's turn");
  };

  // Clock countdown timer
  useEffect(() => {
    if (!isStarted || isResultOpen || !clockMinutes) return;

    const timer = setInterval(() => {
      if (chess.turn() === "w") {
        setWhiteTime((t) => {
          if (t <= 1) {
            handleGameEnd("LOSS", "Time Out! Black wins.");
            return 0;
          }
          return t - 1;
        });
      } else {
        setBlackTime((t) => {
          if (t <= 1) {
            handleGameEnd("WIN", "Time Out! White wins.");
            return 0;
          }
          return t - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isResultOpen, clockMinutes, fen]);

  const handleSquareClick = (square: Square) => {
    if (!isStarted || isResultOpen || (mode === "VS_AI" && chess.turn() === "b")) return;

    if (selectedSquare) {
      // Attempt move from selectedSquare to target square
      try {
        const move = chess.move({
          from: selectedSquare,
          to: square,
          promotion: "q", // Auto-promote to Queen for quick play
        });

        if (move) {
          executeMoveEffects(move);
          setSelectedSquare(null);
          setLegalMoves([]);
          return;
        }
      } catch {
        // Invalid move selection
      }
    }

    // Select new piece if legal
    const piece = chess.get(square);
    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
      const moves = chess.moves({ square, verbose: true });
      setLegalMoves(moves.map((m) => m.to));
      soundManager.play("click");
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const executeMoveEffects = (move: Move) => {
    setFen(chess.fen());
    setLastMove({ from: move.from, to: move.to });
    setMoveHistory((prev) => [...prev, move.san]);

    if (move.captured) {
      soundManager.play("capture");
      if (move.color === "w") setCapturedBlack((prev) => [...prev, move.captured!]);
      else setCapturedWhite((prev) => [...prev, move.captured!]);
    } else {
      soundManager.play("move");
    }

    // Check game over status
    if (chess.isCheckmate()) {
      const winner = chess.turn() === "w" ? "LOSS" : "WIN";
      handleGameEnd(winner, `Checkmate! ${winner === "WIN" ? "You Win!" : "Computer Wins!"}`);
      return;
    }

    if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition()) {
      handleGameEnd("DRAW", "Draw / Stalemate!");
      return;
    }

    if (chess.inCheck()) {
      soundManager.play("wrong");
      setStatusMsg(`${chess.turn() === "w" ? "White" : "Black"} is in CHECK!`);
    } else {
      setStatusMsg(`${chess.turn() === "w" ? "White" : "Black"}'s turn`);
    }
  };

  // AI Move Engine
  useEffect(() => {
    if (!isStarted || isResultOpen || mode !== "VS_AI" || chess.turn() !== "b" || chess.isGameOver()) return;

    setIsAiThinking(true);
    const timer = setTimeout(() => {
      const moves = chess.moves({ verbose: true });
      if (moves.length === 0) return;

      let chosenMove: Move = moves[0];

      if (difficulty === "EASY") {
        chosenMove = moves[Math.floor(Math.random() * moves.length)];
      } else {
        // Medium & Hard: Prioritize captures & check moves
        const captureMoves = moves.filter((m) => m.captured);
        if (captureMoves.length > 0) {
          chosenMove = captureMoves[Math.floor(Math.random() * captureMoves.length)];
        } else {
          chosenMove = moves[Math.floor(Math.random() * moves.length)];
        }
      }

      const moveRes = chess.move(chosenMove);
      if (moveRes) {
        executeMoveEffects(moveRes);
      }
      setIsAiThinking(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [fen, isStarted, isResultOpen, mode, difficulty]);

  const handleGameEnd = (res: "WIN" | "LOSS" | "DRAW", msg: string) => {
    setGameResult(res);
    setStatusMsg(msg);
    setIsResultOpen(true);
    if (onGameOver) onGameOver(res === "WIN" ? 1250 : 300, res === "DRAW" ? "WIN" : res);
  };

  const unicodePieces: Record<string, string> = {
    pw: "♟", rw: "♜", nw: "♞", bw: "♝", qw: "♛", kw: "♚",
    pb: "♙", rb: "♖", nb: "♘", bb: "♗", qb: "♕", kb: "♔",
  };

  return (
    <div className="w-full flex flex-col min-h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <GameHeader
        title="Chess Masters"
        category="Board Games"
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onRestart={startMatch}
        statusText={statusMsg}
      />

      {isCountingDown && (
        <GameLaunchCountdown gameTitle="Chess Masters" onComplete={handleCountdownComplete} />
      )}

      {!isStarted && !isCountingDown ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white space-y-6 max-w-md mx-auto text-center">
          <div className="p-4 rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Trophy className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-black text-2xl">Chess Match Setup</h3>
            <p className="text-xs text-slate-400">Play full legal Chess vs Computer AI or Local 2 Player.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={() => setMode("VS_AI")}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold ${
                mode === "VS_AI" ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-glow" : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              <Bot className="w-6 h-6" /> VS Computer
            </button>
            <button
              onClick={() => setMode("LOCAL_2P")}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold ${
                mode === "LOCAL_2P" ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-glow" : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              <User className="w-6 h-6" /> Local 2 Player
            </button>
          </div>

          <button
            onClick={startMatch}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            START CHESS MATCH
          </button>
        </div>
      ) : (
        <div className="flex-1 p-4 flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Main 8x8 Chess Board */}
          <div className="aspect-square w-full max-w-[440px] bg-slate-900 border-4 border-slate-800 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-8 grid-rows-8 select-none">
            {chess.board().map((row, r) =>
              row.map((cell, c) => {
                const square = `${String.fromCharCode(97 + c)}${8 - r}` as Square;
                const isDarkSquare = (r + c) % 2 === 1;
                const isSelected = selectedSquare === square;
                const isLegalDestination = legalMoves.includes(square);
                const isLastMove = lastMove?.from === square || lastMove?.to === square;
                const isCheck = chess.inCheck() && cell?.type === "k" && cell.color === chess.turn();

                return (
                  <div
                    key={square}
                    onClick={() => handleSquareClick(square)}
                    className={`relative flex items-center justify-center font-bold text-3xl sm:text-4xl cursor-pointer transition-all ${
                      isDarkSquare ? "bg-amber-900/60 text-amber-100" : "bg-amber-100 text-amber-900"
                    } ${isSelected ? "ring-4 ring-cyan-400 z-10" : ""} ${
                      isLastMove ? "bg-cyan-500/30" : ""
                    } ${isCheck ? "bg-rose-600 animate-pulse text-white" : ""}`}
                  >
                    {/* Legal Move Indicator Dot */}
                    {isLegalDestination && (
                      <div className="w-3.5 h-3.5 rounded-full bg-cyan-400/80 shadow-glow absolute z-20 pointer-events-none" />
                    )}

                    {cell && (
                      <span className="drop-shadow-md transform hover:scale-110 transition-transform">
                        {unicodePieces[`${cell.type}${cell.color}`]}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Side Telemetry & Clocks */}
          <div className="w-full md:w-64 space-y-4 text-white text-xs">
            {/* Black Player Card */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-400" />
                <span className="font-bold">{mode === "VS_AI" ? `Computer (${difficulty})` : "Player 2 (Black)"}</span>
              </div>
              <div className="font-mono font-bold text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                {Math.floor(blackTime / 60)}:{blackTime % 60 < 10 ? "0" : ""}{blackTime % 60}
              </div>
            </div>

            {/* Move History Log */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2 h-44 flex flex-col justify-between">
              <div className="font-bold text-slate-400 border-b border-slate-800 pb-1">Move Log</div>
              <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[11px] text-slate-300 pr-1">
                {moveHistory.map((m, i) => (
                  <div key={i} className="flex justify-between border-b border-slate-800/40 pb-0.5">
                    <span className="text-slate-500">#{i + 1}</span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* White Player Card */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                <span className="font-bold">You (White)</span>
              </div>
              <div className="font-mono font-bold text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                {Math.floor(whiteTime / 60)}:{whiteTime % 60 < 10 ? "0" : ""}{whiteTime % 60}
              </div>
            </div>
          </div>
        </div>
      )}

      <GameResultModal
        isOpen={isResultOpen}
        result={gameResult}
        score={gameResult === "WIN" ? 1250 : 400}
        virtualPointsEarned={35}
        onPlayAgain={startMatch}
        title={statusMsg}
      />
    </div>
  );
}
