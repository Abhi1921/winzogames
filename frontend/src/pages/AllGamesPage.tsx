import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Gamepad2, SlidersHorizontal } from "lucide-react";
import { GameCard } from "../components/games/GameCard";

export function AllGamesPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCat = searchParams.get("category") || "";

  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    fetchGames();
  }, [search, selectedCategory, selectedDifficulty, sortBy]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedDifficulty) params.append("difficulty", selectedDifficulty);
      if (sortBy) params.append("sort", sortBy);

      const res = await fetch(`/api/games?${params.toString()}`);
      const data = await res.json();
      setGames(data.games || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { slug: "", name: "All Categories" },
    { slug: "board", name: "Ludo & Board" },
    { slug: "arcade", name: "Arcade" },
    { slug: "puzzle", name: "Puzzle" },
    { slug: "strategy", name: "Strategy" },
    { slug: "quiz", name: "Trivia Quiz" },
    { slug: "classic", name: "Classics" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-cyan-500" />
          <span>Browse All Games</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Discover 100% free casual browser games. Filter by category, difficulty, or search by name.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-soft">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-border-dark rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 dark:text-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs font-semibold">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-border-dark rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-border-dark rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200"
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-border-dark rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-surface-dark animate-pulse" />
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl p-12 text-center text-slate-500">
          No games found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
      )}
    </div>
  );
}
