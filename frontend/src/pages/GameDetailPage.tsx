import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Users, Gamepad2, ArrowLeft } from "lucide-react";
import { LudoGame } from "../games/ludo/LudoGame";
import { ChessGame } from "../games/chess/ChessGame";
import { SnakeGame } from "../games/snake/SnakeGame";
import { Game2048 } from "../games/game2048/Game2048";
import { SudokuGame } from "../games/sudoku/SudokuGame";
import { MinesweeperGame } from "../games/minesweeper/MinesweeperGame";
import { MemoryGame } from "../games/memory/MemoryGame";
import { TicTacToeGame } from "../games/tictactoe/TicTacToeGame";
import { ConnectFourGame } from "../games/connect-four/ConnectFourGame";
import { CheckersGame } from "../games/checkers/CheckersGame";
import { SolitaireGame } from "../games/solitaire/SolitaireGame";
import { QuizGame } from "../games/quiz/QuizGame";
import { BrickBreakerGame } from "../games/brick-breaker/BrickBreakerGame";
import { SpaceShooter } from "../games/space-shooter/SpaceShooter";
import { BubbleShooterGame } from "../games/bubble-shooter/BubbleShooterGame";
import { RPSGame } from "../games/rps/RPSGame";
import { CricketGame } from "../games/cricket/CricketGame";
import { SnakesLaddersGame } from "../games/snakes-ladders/SnakesLaddersGame";

export function GameDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/games/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setGame(data.game);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="p-16 text-center text-slate-400">Loading game arena...</div>;
  }

  if (!game) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Game Not Found</h2>
        <Link to="/games" className="px-4 py-2 bg-cyan-500 text-white font-bold rounded-xl inline-block">
          Return to Games
        </Link>
      </div>
    );
  }

  const renderGameModule = () => {
    switch (slug) {
      case "snakes-and-ladders":
        return <SnakesLaddersGame />;
      case "cricket":
        return <CricketGame />;
      case "ludo":
        return <LudoGame />;
      case "chess":
        return <ChessGame />;
      case "snake":
        return <SnakeGame />;
      case "2048":
        return <Game2048 />;
      case "sudoku":
        return <SudokuGame />;
      case "minesweeper":
        return <MinesweeperGame />;
      case "memory-match":
        return <MemoryGame />;
      case "tic-tac-toe":
        return <TicTacToeGame />;
      case "connect-four":
      case "four-in-row":
        return <ConnectFourGame />;
      case "checkers":
        return <CheckersGame />;
      case "solitaire":
        return <SolitaireGame />;
      case "quiz-gk":
      case "quiz-sports":
      case "quiz-bollywood":
      case "quiz-india":
      case "quiz-logo":
        return <QuizGame />;
      case "brick-breaker":
        return <BrickBreakerGame />;
      case "space-shooter":
        return <SpaceShooter />;
      case "bubble-shooter":
        return <BubbleShooterGame />;
      case "rock-paper-scissors":
        return <RPSGame />;
      default:
        return <LudoGame />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-border-dark pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Link to="/" className="hover:text-cyan-500">Home</Link>
            <span>/</span>
            <Link to="/games" className="hover:text-cyan-500">Games</Link>
            <span>/</span>
            <span className="text-cyan-500 font-bold">{game.name}</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
            {game.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{game.description}</p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/30">
            <Star className="w-4 h-4 fill-current" />
            <span>{game.rating?.toFixed(1) || "4.8"} / 5.0</span>
          </div>
          <div className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/30">
            <Users className="w-4 h-4" />
            <span>{(game.playCount || 0).toLocaleString()} Plays</span>
          </div>
        </div>
      </div>

      {/* Main Game Module Container */}
      <div className="w-full min-h-[600px]">
        {renderGameModule()}
      </div>

      {/* Game Instructions */}
      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl p-6 space-y-4 shadow-soft">
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-cyan-500" /> How to Play & Controls
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{game.instructions}</p>
        <div className="pt-2 border-t border-slate-200 dark:border-border-dark text-xs text-slate-500 dark:text-slate-400">
          <strong className="text-cyan-500">Controls:</strong> {game.controls}
        </div>
      </div>
    </div>
  );
}
