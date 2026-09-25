import React, { useEffect, useState } from "react";
import { History, Trophy, Coins } from "lucide-react";

export function HistoryPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/me/game-history")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setSessions(data.sessions || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-border-dark pb-6">
        <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-2xl">
          <History className="w-8 h-8" />
        </div>
        <div>
          <h1 className="font-display font-black text-3xl text-slate-900 dark:text-white">Match History</h1>
          <p className="text-slate-500 text-sm">Review your past match performances and earned virtual points.</p>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400">Loading match history...</div>
      ) : sessions.length > 0 ? (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl p-4 flex items-center justify-between shadow-soft"
            >
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">{s.game?.name || "Casual Match"}</h4>
                <p className="text-xs text-slate-400">
                  Played on {new Date(s.createdAt).toLocaleDateString()} • Score: {s.score}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-amber-500/10 text-amber-500 font-extrabold px-3 py-1.5 rounded-xl text-xs border border-amber-500/30">
                <Coins className="w-4 h-4" /> +{s.pointsEarned} XP
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl space-y-2">
          <p className="text-slate-400 text-sm">No game history recorded yet. Jump into Ludo or Chess now!</p>
        </div>
      )}
    </div>
  );
}
