import { create } from "zustand";

export interface UserState {
  id: string;
  name?: string;
  email: string;
  username: string;
  fullName?: string;
  role: string;
  avatar?: string;
  virtualPoints: number;
  currentStreak?: number;
  profile?: {
    avatarUrl?: string;
    bio?: string;
    showPublicLeaderboard?: boolean;
    themePreference?: string;
    totalGamesPlayed?: number;
    totalWins?: number;
    currentStreak?: number;
  };
  gameSessions?: any[];
  achievements?: any[];
}

interface AuthStore {
  user: UserState | null;
  isLoading: boolean;
  setUser: (user: UserState | null) => void;
  login: (user: UserState) => void;
  fetchCurrentUser: () => Promise<void>;
  updateVirtualPoints: (newTotal: number) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  login: (user) => set({ user, isLoading: false }),
  fetchCurrentUser: async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch {
      set({ user: null, isLoading: false });
    }
  },
  updateVirtualPoints: (newTotal) =>
    set((state) => ({
      user: state.user ? { ...state.user, virtualPoints: newTotal } : null,
    })),
  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    set({ user: null, isLoading: false });
  },
}));
