import React from "react";
import { Lock } from "lucide-react";

export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-500 mb-2">
          <Lock className="w-10 h-10" />
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-slate-500 text-sm">Effective Date: September 2026</p>
      </div>

      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl p-8 shadow-card space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">Data Protection</h3>
        <p>
          We prioritize player privacy. We only collect basic profile information (username, display name, email) required to maintain game scores and leaderboard standing. We do not sell user data.
        </p>
      </div>
    </div>
  );
}
