import React, { useState, useEffect } from "react";
import { Trophy, Crown, Coins } from "lucide-react";

export function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"GLOBAL" | "WEEKLY">("GLOBAL");
  const [selectedGame, setSelectedGame] = useState("global");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, selectedGame]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboards?game=${selectedGame}&type=${activeTab}`);
      const data = await res.json();
      setLeaderboard(data.leaderboards || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const gameOptions = [
    { slug: "global", label: "Global Overall" },
    { slug: "ludo", label: "Ludo" },
    { slug: "chess", label: "Chess" },
    { slug: "snake", label: "Snake" },
    { slug: "2048", label: "2048" },
    { slug: "flappy-bird", label: "Flappy Sky Dash" },
    { slug: "quiz-gk", label: "General Knowledge Quiz" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase">
          <Crown className="w-4 h-4 text-amber-500" /> Hall of Fame
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white">
          Platform Leaderboards
        </h1>

        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Compete against players worldwide. Climb ranks by playing games and earning virtual points!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-3 rounded-2xl shadow-soft">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("GLOBAL")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === "GLOBAL"
                ? "bg-gradient-to-r from-amber-400 to-yellow-600 text-slate-950 shadow-md"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setActiveTab("WEEKLY")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === "WEEKLY"
                ? "bg-gradient-to-r from-amber-400 to-yellow-600 text-slate-950 shadow-md"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            This Week
          </button>
        </div>

        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-border-dark rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200"
        >
          {gameOptions.map((g) => (
            <option key={g.slug} value={g.slug}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl overflow-hidden shadow-soft">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-slate-900/60 grid grid-cols-12 text-xs font-bold text-slate-500 uppercase">
          <div className="col-span-2">Rank</div>
          <div className="col-span-6">Player</div>
          <div className="col-span-4 text-right">Virtual Points</div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading rankings...</div>
        ) : leaderboard.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No leaderboard entries yet.</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-border-dark">
            {leaderboard.map((entry) => (
              <div key={entry.id} className="px-6 py-4 grid grid-cols-12 items-center hover:bg-slate-50 dark:hover:bg-surface-dark-hover transition-colors">
                <div className="col-span-2 flex items-center">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                      entry.rank === 1
                        ? "bg-amber-400 text-black shadow-md"
                        : entry.rank === 2
                        ? "bg-slate-300 text-black"
                        : entry.rank === 3
                        ? "bg-amber-700 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                    }`}
                  >
                    #{entry.rank}
                  </span>
                </div>

                <div className="col-span-6 flex items-center gap-3">
                  <img
                    src={entry.avatarUrl || "/avatars/avatar-1.png"}
                    alt={entry.username}
                    className="w-9 h-9 rounded-full object-cover border bg-slate-200 dark:bg-slate-900"
                  />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{entry.username}</span>
                </div>

                <div className="col-span-4 text-right font-black text-amber-500 text-sm flex items-center justify-end gap-1">
                  <Coins className="w-4 h-4" />
                  {(entry.points || 0).toLocaleString()} PTS
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
