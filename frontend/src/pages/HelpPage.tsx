import React from "react";
import { HelpCircle, Mail, MessageSquare } from "lucide-react";

export function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 text-purple-500 mb-2">
          <HelpCircle className="w-10 h-10" />
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
          Help & Support
        </h1>
        <p className="text-slate-500 text-sm">Frequently asked questions and gamer assistance.</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl p-6 shadow-soft space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">How do Virtual Points work?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Virtual Points are non-monetary score metrics awarded when completing matches, setting high scores, or unlocking achievements. They allow you to climb global leaderboards!
          </p>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl p-6 shadow-soft space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Is real money involved?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No! WinzoGames is strictly free-to-play. We do not support real-money deposits, withdrawals, wagering, or cash prizes.
          </p>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl p-6 shadow-soft space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">How do I create a Ludo room to play with friends?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Go to Ludo, select 'Online Multiplayer', click 'Create Private Room', and share your 6-digit room code with your friends!
          </p>
        </div>
      </div>
    </div>
  );
}
