import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, Trophy, Coins, Flame, Heart, History, Settings, ShieldCheck, Gamepad2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export function UserProfilePage() {
  const { user } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setProfileData(data.user);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const activeUser = profileData || user;

  if (loading) {
    return <div className="p-16 text-center text-slate-400">Loading gamer profile...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-cyan-600 via-purple-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white relative shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-20 pointer-events-none">
          <Gamepad2 className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900 border-4 border-white/20 overflow-hidden flex items-center justify-center shrink-0 shadow-2xl">
            {activeUser?.avatar ? (
              <img src={activeUser.avatar} alt={activeUser.username} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-cyan-400" />
            )}
          </div>

          {/* Identity Info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="font-display font-black text-2xl sm:text-3xl">{activeUser?.name || "Casual Gamer"}</h1>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                @{activeUser?.username || "player"}
              </span>
              {activeUser?.role === "ADMIN" && (
                <span className="px-3 py-1 bg-amber-400 text-black font-extrabold rounded-full text-xs">
                  ADMINISTRATOR
                </span>
              )}
            </div>

            <p className="text-white/80 text-sm max-w-xl">
              {activeUser?.profile?.bio || "Casual gamer exploring Ludo, Chess & arcade games on WinzoGames!"}
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2 text-xs font-semibold">
              <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-lg">
                <Coins className="w-4 h-4 text-amber-300" /> {activeUser?.virtualPoints || 500} Virtual Coins
              </span>
              <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-lg">
                <Flame className="w-4 h-4 text-orange-300" /> {activeUser?.profile?.currentStreak || 1} Day Streak
              </span>
            </div>
          </div>

          {/* Edit Profile Action */}
          <Link
            to="/profile/edit"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white font-bold text-xs flex items-center gap-2 border border-white/20 shrink-0"
          >
            <Settings className="w-4 h-4" /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-5 rounded-2xl space-y-1 shadow-soft">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Matches Played</div>
          <div className="font-display font-black text-2xl text-slate-900 dark:text-white">
            {activeUser?.profile?.totalGamesPlayed || 0}
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-5 rounded-2xl space-y-1 shadow-soft">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Total Wins</div>
          <div className="font-display font-black text-2xl text-cyan-500">
            {activeUser?.profile?.totalWins || 0}
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-5 rounded-2xl space-y-1 shadow-soft">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Virtual XP</div>
          <div className="font-display font-black text-2xl text-amber-500">
            {activeUser?.virtualPoints || 500}
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-5 rounded-2xl space-y-1 shadow-soft">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Badges</div>
          <div className="font-display font-black text-2xl text-purple-500">
            {activeUser?.achievements?.length || 1}
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Match History */}
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl p-6 space-y-4 shadow-soft">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-500" /> Recent Game Sessions
          </h3>

          {activeUser?.gameSessions && activeUser.gameSessions.length > 0 ? (
            <div className="space-y-3">
              {activeUser.gameSessions.map((session: any) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-border-dark"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {session.game?.name || "Casual Game"}
                    </div>
                    <div className="text-xs text-slate-400">Score: {session.score}</div>
                  </div>
                  <span className="text-xs font-extrabold text-amber-500">+{session.pointsEarned} XP</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No recent game sessions found. Go play a game!
            </div>
          )}
        </div>

        {/* Unlocked Achievements */}
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl p-6 space-y-4 shadow-soft">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Earned Badges
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Welcome Adventurer</div>
                <div className="text-[10px] text-slate-400">Joined WinzoGames</div>
              </div>
            </div>
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-cyan-500 shrink-0" />
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Fair Player</div>
                <div className="text-[10px] text-slate-400">Non-monetary play</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
