import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Gamepad2,
  Trophy,
  Sparkles,
  Flame,
  ShieldCheck,
  Play,
  ArrowRight,
  Puzzle,
  Brain,
  Smile,
  Coins,
  Dices,
  Crown,
  Users,
  Award
} from "lucide-react";
import { GameCard } from "../components/games/GameCard";

export function HomePage() {
  const [featuredGames, setFeaturedGames] = useState<any[]>([]);
  const [popularGames, setPopularGames] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/games?featured=true").then((r) => r.json()),
      fetch("/api/games?sort=popular").then((r) => r.json()),
      fetch("/api/leaderboards?type=GLOBAL").then((r) => r.json()),
    ])
      .then(([featuredRes, popularRes, leadRes]) => {
        setFeaturedGames(featuredRes.games || []);
        setPopularGames(popularRes.games || []);
        setLeaderboard((leadRes.leaderboards || []).slice(0, 5));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { slug: "board", name: "Board & Ludo", icon: Dices, count: "4 Games", color: "from-purple-500/10 to-indigo-600/10 border-purple-500/30 text-purple-600 dark:text-purple-400" },
    { slug: "arcade", name: "Retro Arcade", icon: Gamepad2, count: "5 Games", color: "from-cyan-500/10 to-blue-600/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400" },
    { slug: "puzzle", name: "Puzzle & Brain", icon: Puzzle, count: "6 Games", color: "from-emerald-500/10 to-teal-600/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" },
    { slug: "quiz", name: "Trivia & Quiz", icon: Sparkles, count: "5 Games", color: "from-amber-500/10 to-yellow-600/10 border-amber-500/30 text-amber-600 dark:text-amber-400" },
    { slug: "classic", name: "Classics", icon: Crown, count: "5 Games", color: "from-pink-500/10 to-rose-600/10 border-pink-500/30 text-pink-600 dark:text-pink-400" },
  ];

  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Requirement 7: Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 p-8 sm:p-12 lg:p-16 shadow-2xl text-white">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>100% Free-to-Play • Non-Monetary Virtual Points</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.1]">
            Play More. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400">
              Have More Fun.
            </span>
          </h1>

          <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
            Discover exciting browser games, challenge yourself, play Ludo with friends, and compete with players on virtual leaderboards.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 font-black">
            <Link
              to="/games/ludo"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 text-white text-base shadow-lg hover:scale-105 transition-transform flex items-center gap-2.5"
            >
              <Dices className="w-6 h-6" />
              <span>PLAY LUDO MULTIPLAYER</span>
            </Link>

            <Link
              to="/games"
              className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-base transition-colors flex items-center gap-2"
            >
              <span>EXPLORE ALL GAMES</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>

          <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Dices className="w-4 h-4 text-amber-400" />
              <span>Ludo Online & Local 4P</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span>Global Hall of Fame</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>Virtual XP & Points Only</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-amber-500 animate-bounce" />
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">Featured Games</h2>
          </div>
          <Link to="/games" className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-surface-dark animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game) => (
              <GameCard key={game.id} {...game} />
            ))}
          </div>
        )}
      </section>

      {/* Category Cards */}
      <section className="space-y-6">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">Game Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className={`p-5 rounded-2xl bg-gradient-to-br ${cat.color} border hover:scale-105 transition-all flex flex-col items-center justify-center text-center space-y-2 group shadow-sm`}
              >
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">{cat.name}</h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{cat.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Games & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-500" />
            <span>Most Popular Games</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {popularGames.slice(0, 4).map((game) => (
              <GameCard key={game.id} {...game} />
            ))}
          </div>
        </div>

        {/* Leaderboard Snapshot */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Top Players</span>
            </h2>
            <Link to="/leaderboard" className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400">
              Full Board
            </Link>
          </div>

          <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl p-4 space-y-3 shadow-soft">
            {leaderboard.map((player, idx) => (
              <div
                key={player.id || idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-border-dark"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      idx === 0
                        ? "bg-amber-400 text-black shadow-glow-gold"
                        : idx === 1
                        ? "bg-slate-300 text-black"
                        : idx === 2
                        ? "bg-amber-700 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <img
                    src={player.avatarUrl || "/avatars/avatar-1.png"}
                    alt={player.username}
                    className="w-8 h-8 rounded-full border border-slate-300 dark:border-border-dark object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://api.dicebear.com/7.x/bottts/svg?seed=" + player.username;
                    }}
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">{player.username}</span>
                    <span className="text-[10px] text-slate-400">Score: {player.score}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-xs text-amber-500 block">
                    {(player.points || 0).toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-400">Virtual PTS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
