import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Save, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export function EditProfilePage() {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.profile?.bio || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, avatar }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      if (user) {
        login({ ...user, name, avatar, profile: { ...user.profile, bio } });
      }

      setMsg("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={() => navigate("/profile")}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-500 font-bold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Profile
      </button>

      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl p-8 shadow-card space-y-6">
        <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-6 h-6 text-cyan-500" /> Edit Profile Settings
        </h2>

        {msg && (
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 rounded-xl text-xs font-bold">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-border-dark rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Avatar Image URL</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-border-dark rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Bio</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other gamers about yourself..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-border-dark rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> {loading ? "Saving..." : "SAVE PROFILE"}
          </button>
        </form>
      </div>
    </div>
  );
}
