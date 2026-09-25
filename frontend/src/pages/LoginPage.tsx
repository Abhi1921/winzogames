import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dices, LogIn, Lock, User, Sparkles } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        setUser(data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = (email: string, pass: string) => {
    setEmailOrUsername(email);
    setPassword(pass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl p-8 shadow-soft space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 font-display font-black text-2xl text-slate-900 dark:text-white">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
              <Dices className="w-5 h-5 text-white" />
            </div>
            <span>Winzo<span className="text-cyan-500">Games</span></span>
          </Link>
          <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white pt-2">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Log in to play games and claim virtual points</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Quick Demo Fill Buttons */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-border-dark space-y-2 text-xs">
          <span className="font-bold text-slate-600 dark:text-slate-300 block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> One-Click Quick Autofill:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => autofillDemo("player1@winzo.com", "Password123!")}
              className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 border text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:border-cyan-500"
            >
              Demo Player
            </button>
            <button
              type="button"
              onClick={() => autofillDemo("admin@winzo.com", "Password123!")}
              className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 border text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:border-amber-500"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Email or Username</label>
            <input
              type="text"
              required
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="player1@winzo.com"
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-border-dark rounded-xl py-2.5 px-4 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-border-dark rounded-xl py-2.5 px-4 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-600 text-white font-extrabold text-sm shadow-md hover:opacity-95 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? "Logging in..." : "LOG IN"}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
            Register Free
          </Link>
        </div>
      </div>
    </div>
  );
}
