import React, { useEffect, useState } from "react";
import { ShieldCheck, Users, Gamepad2, AlertTriangle, Activity } from "lucide-react";

export function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/admin/users").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([statsData, usersData]) => {
        if (statsData) setStats(statsData.stats);
        if (usersData) setUsersList(usersData.users || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleSuspend = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSuspended: !currentStatus }),
      });
      if (res.ok) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isSuspended: !currentStatus } : u))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-slate-400">Loading admin telemetry...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-border-dark pb-6">
        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h1 className="font-display font-black text-3xl text-slate-900 dark:text-white">
            WinzoGames Admin Portal
          </h1>
          <p className="text-slate-500 text-sm">
            Platform control center, DAU analytics, anti-cheat & player management.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-6 rounded-2xl space-y-2 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Total Registered Users</span>
            <Users className="w-5 h-5 text-cyan-500" />
          </div>
          <div className="font-display font-black text-3xl text-slate-900 dark:text-white">
            {stats?.totalUsers || 0}
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-6 rounded-2xl space-y-2 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Games Catalog</span>
            <Gamepad2 className="w-5 h-5 text-purple-500" />
          </div>
          <div className="font-display font-black text-3xl text-slate-900 dark:text-white">
            {stats?.totalGames || 0}
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-6 rounded-2xl space-y-2 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Matches Completed</span>
            <Activity className="w-5 h-5 text-amber-500" />
          </div>
          <div className="font-display font-black text-3xl text-slate-900 dark:text-white">
            {stats?.totalMatches || 0}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl p-6 space-y-4 shadow-soft">
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Player Roster</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-900 text-slate-500">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Virtual Coins</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                    {u.name} <span className="text-slate-400 text-xs font-normal">(@{u.username})</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold">{u.role}</td>
                  <td className="px-4 py-3 font-bold text-amber-500">{u.virtualPoints} XP</td>
                  <td className="px-4 py-3">
                    {u.isSuspended ? (
                      <span className="px-2.5 py-1 bg-rose-500/10 text-rose-500 rounded-full text-xs font-bold">
                        SUSPENDED
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold">
                        ACTIVE
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleSuspend(u.id, u.isSuspended)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${
                        u.isSuspended ? "bg-emerald-500 text-white" : "bg-rose-500/10 text-rose-500"
                      }`}
                    >
                      {u.isSuspended ? "RESTORE" : "SUSPEND"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
