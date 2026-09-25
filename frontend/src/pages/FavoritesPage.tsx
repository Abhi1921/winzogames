import React, { useEffect, useState } from "react";
import { Heart, Gamepad2 } from "lucide-react";
import { GameCard } from "../components/games/GameCard";

import { GAMES_CATALOG } from "../data/gamesCatalog";

export function FavoritesPage() {
  const [favoriteGames, setFavoriteGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/games?popular=true")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.games && data.games.length > 0) {
          setFavoriteGames(data.games.slice(0, 4));
        } else {
          setFavoriteGames(GAMES_CATALOG.slice(0, 4));
        }
      })
      .catch((err) => {
        setFavoriteGames(GAMES_CATALOG.slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-border-dark pb-6">
        <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <div>
          <h1 className="font-display font-black text-3xl text-slate-900 dark:text-white">Your Favorite Games</h1>
          <p className="text-slate-500 text-sm">Quick access to the games you love playing most.</p>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400">Loading favorites...</div>
      ) : favoriteGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteGames.map((game) => (
            <GameCard key={game.id} game={{ ...game, isFavorite: true }} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl space-y-4">
          <Gamepad2 className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">No Favorites Saved Yet</h3>
          <p className="text-xs text-slate-400">Click the heart icon on any game card to add it here!</p>
        </div>
      )}
    </div>
  );
}
