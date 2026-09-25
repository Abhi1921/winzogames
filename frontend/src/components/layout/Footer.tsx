import React from "react";
import { Link } from "react-router-dom";
import { Dices, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-[#080b10] border-t border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand */}
        <div className="md:col-span-1 space-y-3">
          <Link to="/" className="flex items-center gap-2 font-display font-black text-xl text-slate-900 dark:text-white">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
              <Dices className="w-5 h-5 text-white" />
            </div>
            <span>Winzo<span className="text-cyan-500">Games</span></span>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            India&apos;s premier casual online gaming portal. Play Ludo, Chess, 2048, Snake, Sudoku, Minesweeper, and Brain Quizzes instantly!
          </p>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs pt-1">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Free-to-Play Guaranteed</span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">Game Categories</h4>
          <ul className="space-y-2">
            <li><Link to="/category/board" className="hover:text-cyan-500 transition-colors">Ludo & Board Games</Link></li>
            <li><Link to="/category/arcade" className="hover:text-cyan-500 transition-colors">Retro Arcade</Link></li>
            <li><Link to="/category/puzzle" className="hover:text-cyan-500 transition-colors">Puzzle & Brain</Link></li>
            <li><Link to="/category/quiz" className="hover:text-cyan-500 transition-colors">Trivia & Quizzes</Link></li>
            <li><Link to="/category/multiplayer" className="hover:text-cyan-500 transition-colors">Online Multiplayer</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">User Platform</h4>
          <ul className="space-y-2">
            <li><Link to="/leaderboard" className="hover:text-cyan-500 transition-colors">Global Leaderboards</Link></li>
            <li><Link to="/dashboard" className="hover:text-cyan-500 transition-colors">User Dashboard</Link></li>
            <li><Link to="/achievements" className="hover:text-cyan-500 transition-colors">Badges & Achievements</Link></li>
            <li><Link to="/favorites" className="hover:text-cyan-500 transition-colors">Favorite Games</Link></li>
            <li><Link to="/history" className="hover:text-cyan-500 transition-colors">Match History</Link></li>
          </ul>
        </div>

        {/* Support & Legal */}
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">Support & Rules</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-cyan-500 transition-colors">About Us</Link></li>
            <li><Link to="/help" className="hover:text-cyan-500 transition-colors">Help & How to Play</Link></li>
            <li><Link to="/contact" className="hover:text-cyan-500 transition-colors">Contact Support</Link></li>
            <li><Link to="/terms" className="hover:text-cyan-500 transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-cyan-500 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Non-Monetary Strict Legal Disclaimer Box */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl p-4 mb-6">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-center">
          <strong className="text-slate-800 dark:text-slate-200">IMPORTANT PRODUCT NOTICE:</strong> WinzoGames is strictly a free-to-play social gaming portal. We do NOT support or offer real-money betting, gambling, cash deposits, cash withdrawals, or monetary rewards. All points, coins, scores, and trophies displayed are virtual non-monetary digital counters designed solely for casual fun and friendly competition.
        </p>
      </div>

      <div className="max-w-7xl mx-auto pt-4 border-t border-slate-200 dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <p>© {new Date().getFullYear()} WinzoGames Platform. All rights reserved.</p>
        <p className="flex items-center gap-1 font-semibold">
          Made with <Heart className="w-3.5 h-3.5 text-pink-500 fill-current" /> for gamers everywhere.
        </p>
      </div>
    </footer>
  );
}
