import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Gamepad2,
  Trophy,
  Search,
  Coins,
  Bell,
  Sun,
  Moon,
  Laptop,
  User,
  LogOut,
  Shield,
  Heart,
  History,
  Award,
  Settings,
  Menu,
  X,
  Flame,
  Dices,
  Sparkles
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          useAuthStore.getState().setUser(data.user);
        } else {
          useAuthStore.getState().setUser(null);
        }
      })
      .catch(() => useAuthStore.getState().setUser(null));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/games?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0b0e14]/90 backdrop-blur-md border-b border-slate-200 dark:border-border-dark transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo - WinzoGames */}
        <Link to="/" className="flex items-center gap-2.5 font-display font-black text-xl tracking-wider group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Dices className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            Winzo<span className="text-cyan-500 font-extrabold">Games</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Link
            to="/"
            className={`hover:text-cyan-500 transition-colors ${
              location.pathname === "/" ? "text-cyan-500 font-extrabold" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/games"
            className={`hover:text-cyan-500 transition-colors ${
              location.pathname.startsWith("/games") ? "text-cyan-500 font-extrabold" : ""
            }`}
          >
            All Games
          </Link>
          <Link
            to="/category/board"
            className="hover:text-cyan-500 transition-colors flex items-center gap-1 text-purple-600 dark:text-purple-400"
          >
            <Dices className="w-3.5 h-3.5" /> Ludo & Board
          </Link>
          <Link
            to="/leaderboard"
            className={`hover:text-cyan-500 transition-colors flex items-center gap-1 ${
              location.pathname === "/leaderboard" ? "text-cyan-500 font-extrabold" : ""
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" /> Leaderboards
          </Link>
          <Link
            to="/help"
            className="hover:text-cyan-500 transition-colors"
          >
            How to Play
          </Link>
        </nav>

        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-xs relative">
          <input
            type="text"
            placeholder="Search Ludo, 2048, Quiz..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-full py-1.5 pl-9 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        {/* Right Controls & User Profile */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher Button */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-slate-700 dark:text-slate-300 hover:text-cyan-500 transition-colors"
              title="Switch Theme (Light/Dark)"
            >
              {theme === "light" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : theme === "dark" ? (
                <Moon className="w-4 h-4 text-cyan-400" />
              ) : (
                <Laptop className="w-4 h-4 text-purple-400" />
              )}
            </button>

            {themeDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-[#121824] border border-slate-200 dark:border-border-dark shadow-xl py-1.5 z-50 text-xs font-bold"
                onMouseLeave={() => setThemeDropdownOpen(false)}
              >
                <button
                  onClick={() => {
                    setTheme("light");
                    setThemeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-surface-dark-hover ${
                    theme === "light" ? "text-cyan-600 dark:text-cyan-400 font-extrabold" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" /> Light Mode ☀️
                </button>
                <button
                  onClick={() => {
                    setTheme("dark");
                    setThemeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-surface-dark-hover ${
                    theme === "dark" ? "text-cyan-600 dark:text-cyan-400 font-extrabold" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-cyan-400" /> Dark Mode 🌙
                </button>
              </div>
            )}
          </div>

          {user ? (
            <>
              {/* Virtual Points Counter Pill */}
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 font-extrabold text-xs shadow-sm hover:scale-105 transition-transform"
                title="Virtual Points (Non-Monetary)"
              >
                <Coins className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>{(user.virtualPoints || 500).toLocaleString()}</span>
                <span className="text-[10px] opacity-80">PTS</span>
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-slate-200 dark:border-border-dark bg-slate-100 dark:bg-surface-dark"
                >
                  <img
                    src={user.profile?.avatarUrl || "/avatars/avatar-1.png"}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover bg-slate-200 dark:bg-slate-900"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://api.dicebear.com/7.x/bottts/svg?seed=" + user.username;
                    }}
                  />
                  <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-white max-w-[100px] truncate pr-2">
                    {user.username}
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#121824] border border-slate-200 dark:border-border-dark shadow-2xl py-2 z-50 text-xs"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-border-dark">
                      <p className="text-slate-400 text-[11px]">Signed in as</p>
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user.fullName || user.username}</p>
                      <div className="flex items-center gap-1 text-amber-500 text-[11px] font-bold mt-0.5">
                        <Flame className="w-3 h-3 fill-current" /> {user.currentStreak || 1} Day Streak
                      </div>
                    </div>

                    <div className="py-1 font-semibold">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-dark-hover"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 text-cyan-500" /> User Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-dark-hover"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 text-purple-500" /> My Profile
                      </Link>
                      <Link
                        to="/favorites"
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-dark-hover"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Heart className="w-4 h-4 text-pink-500" /> Favorite Games
                      </Link>
                      <Link
                        to="/history"
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-dark-hover"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <History className="w-4 h-4 text-blue-500" /> Match History
                      </Link>
                      <Link
                        to="/achievements"
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-dark-hover"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Award className="w-4 h-4 text-emerald-500" /> Badges & XP
                      </Link>

                      {user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-amber-600 dark:text-amber-300 bg-amber-500/10 font-bold"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Shield className="w-4 h-4 text-amber-500" /> Admin Panel
                        </Link>
                      ) : null}
                    </div>

                    <div className="pt-1 border-t border-slate-200 dark:border-border-dark">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-500 hover:bg-rose-500/10 font-bold text-left"
                      >
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 font-bold text-xs">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-dark-hover transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-600 text-white font-extrabold shadow-md hover:opacity-95 transition-opacity"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-slate-700 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
