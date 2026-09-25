import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { MobileBottomNav } from "./components/layout/MobileBottomNav";
import { NonMonetaryBanner } from "./components/layout/NonMonetaryBanner";
import { useThemeStore } from "./store/themeStore";
import { useAuthStore } from "./store/authStore";

// Pages
import { HomePage } from "./pages/HomePage";
import { AllGamesPage } from "./pages/AllGamesPage";
import { GameDetailPage } from "./pages/GameDetailPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { UserDashboardPage } from "./pages/UserDashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { EditProfilePage } from "./pages/EditProfilePage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { HistoryPage } from "./pages/HistoryPage";
import { AchievementsPage } from "./pages/AchievementsPage";
import { AdminPage } from "./pages/AdminPage";
import { AboutPage } from "./pages/AboutPage";
import { HelpPage } from "./pages/HelpPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";

export default function App() {
  const { initTheme } = useThemeStore();
  const { fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    initTheme();
    fetchCurrentUser();
  }, [initTheme, fetchCurrentUser]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-bg-dark text-slate-900 dark:text-text-dark font-sans flex flex-col transition-colors duration-200 pb-16 md:pb-0">
        <NonMonetaryBanner />
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<AllGamesPage />} />
            <Route path="/games/:slug" element={<GameDetailPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Routes>
        </main>

        <Footer />
        <MobileBottomNav />
      </div>
    </BrowserRouter>
  );
}
