import React from "react";
import { FileText, ShieldCheck } from "lucide-react";

export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-500 mb-2">
          <FileText className="w-10 h-10" />
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
          Terms & Free-to-Play Policy
        </h1>
        <p className="text-slate-500 text-sm">Effective Date: September 2026</p>
      </div>

      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl p-8 shadow-card space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-600 dark:text-amber-400 font-bold flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 shrink-0" />
          <span>IMPORTANT LEGAL NOTICE: THIS PLATFORM DOES NOT INVOLVE REAL MONEY OR CASH WAGERING.</span>
        </div>

        <h3 className="font-bold text-base text-slate-900 dark:text-white">1. Free-To-Play Nature</h3>
        <p>
          WinzoGames is an online casual gaming entertainment portal. All games are provided free of charge for entertainment and skill development.
        </p>

        <h3 className="font-bold text-base text-slate-900 dark:text-white">2. Virtual Points Disclaimer</h3>
        <p>
          "Coins", "Points", or "XP" displayed in user balances have no monetary value, cannot be converted into cash, cannot be transferred between accounts, and cannot be redeemed for real-world currency or goods.
        </p>
      </div>
    </div>
  );
}
