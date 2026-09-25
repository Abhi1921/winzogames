import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Gamepad2, Coins, Award, Flame, Star, Play, History, Dices } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { GameCard } from "../components/games/GameCard";

export function UserDashboardPage() {
  const { user } = useAuthStore();
  const [history, setHistory] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/users/history").then((r) => (r.ok ? r.json() : { history: [] })),
      fetch("/api/achievements").then((r) => (r.ok ? r.json() : { achievements: [] })),
      fetch("/api/games?featured=true").then((r) => (r.ok ? r.json() : { games: [] })),
    ])
      .then(([histData, achData, gameData]) => {
        setHistory(histData.history || []);
        setAchievements((achData.achievements || []).filter((a: any) => a.isUnlocked));
        setRecommended((gameData.games || []).slice(0, 4));
      })
      .catch((err) => console.error(err));
  }, []);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Please log in to view your dashboard</h2>
        <Link to="/login" className="px-6 py-2.5 bg-cyan-500 text-white font-bold rounded-xl inline-block">
          LOG IN
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
            <Flame className="w-4 h-4 fill-current" /> {user.currentStreak || 1} Day Streak Active!
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl">
            Welcome back, {user.fullName || user.username}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Track your games, virtual points balance, unlocked badges, and daily challenges.
          </p>
        </div>

        <Link
          to="/games/ludo"
          className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-black text-sm shadow-md hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Dices className="w-5 h-5 text-purple-600" /> PLAY LUDO NOW
        </Link>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-5 rounded-2xl space-y-2 shadow-soft">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Games Played</span>
          <span className="font-display font-black text-2xl text-slate-900 dark:text-white block">{history.length}</span>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-5 rounded-2xl space-y-2 shadow-soft">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Virtual Points</span>
          <span className="font-display font-black text-2xl text-amber-500 block flex items-center gap-1">
            <Coins className="w-5 h-5" /> {(user.virtualPoints || 500).toLocaleString()}
          </span>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-5 rounded-2xl space-y-2 shadow-soft">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Unlocked Badges</span>
          <span className="font-display font-black text-2xl text-emerald-500 block">{achievements.length} Badges</span>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-5 rounded-2xl space-y-2 shadow-soft col-span-2 lg:col-span-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily Streak</span>
          <span className="font-display font-black text-2xl text-rose-500 block">{user.currentStreak || 1} Days</span>
        </div>
      </div>

      {/* Recommended Games */}
      <div className="space-y-6">
        <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">Recommended For You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommended.map((g) => (
            <GameCard key={g.id} {...g} />
          ))}
        </div>
      </div>
    </div>
  );
}
