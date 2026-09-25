import React, { useEffect, useState } from "react";
import { Trophy, Award, Lock, CheckCircle2 } from "lucide-react";

export function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/achievements")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setAchievements(data.achievements || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-border-dark pb-6">
        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <h1 className="font-display font-black text-3xl text-slate-900 dark:text-white">Achievements & Badges</h1>
          <p className="text-slate-500 text-sm">Unlock rewards and showcase your skill badges on your profile.</p>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400">Loading achievements list...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl p-6 space-y-4 shadow-soft flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">{ach.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{ach.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-border-dark text-xs font-bold">
                <span className="text-amber-500">+{ach.pointsReward} XP</span>
                <span className="flex items-center gap-1 text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" /> Unlocked
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
