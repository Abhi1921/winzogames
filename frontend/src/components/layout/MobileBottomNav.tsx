import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Gamepad2, Trophy, User, Dices } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuthStore();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Games", href: "/games", icon: Gamepad2 },
    { label: "Play Ludo", href: "/games/ludo", icon: Dices },
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { label: "Profile", href: user ? "/dashboard" : "/login", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0b0e14]/95 backdrop-blur-lg border-t border-slate-200 dark:border-border-dark px-2 py-2">
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                isActive
                  ? "text-cyan-600 dark:text-cyan-400 font-extrabold bg-cyan-500/10 scale-105"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-cyan-600 dark:text-cyan-400" : ""}`} />
              <span className="text-[9px] font-bold truncate max-w-full">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
