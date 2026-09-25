import React from "react";
import { Gamepad2, ShieldCheck, Heart, Sparkles } from "lucide-react";

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-500 mb-2">
          <Gamepad2 className="w-10 h-10" />
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
          About WinzoGames
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
          India's Premier Casual Browser Gaming Portal built strictly for free-to-play entertainment, skill-building, and social fun.
        </p>
      </div>

      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl p-8 shadow-card space-y-6">
        <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-500" /> Our Mission
          </h3>
          <p>
            At WinzoGames, we believe casual gaming should be joyful, accessible, instant, and completely free from financial risks. We provide a curated library of high-quality browser games including Ludo, Chess, Sudoku, Snake, and Arcade games.
          </p>

          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-border-dark">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> 100% Free-To-Play Model
          </h3>
          <p>
            WinzoGames operates strictly on virtual points and achievement badges. There are no cash deposits, no real-money betting, no monetary prizes, and no cash withdrawals whatsoever. Every coin earned on our platform has zero monetary value.
          </p>
        </div>
      </div>
    </div>
  );
}
