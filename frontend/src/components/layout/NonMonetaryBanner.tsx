import React from "react";
import { ShieldCheck, Info } from "lucide-react";

export function NonMonetaryBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white text-xs py-1.5 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>
            <strong className="text-emerald-300">100% FREE-TO-PLAY PORTAL:</strong> All coins & points are strictly virtual with <span className="underline decoration-emerald-300">zero monetary value</span>. No real money deposits, cash wagering, or cash prizes.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1 text-slate-200 text-[11px]">
          <Info className="w-3.5 h-3.5 text-cyan-300" />
          <span>Skill & Casual Entertainment Only</span>
        </div>
      </div>
    </div>
  );
}
