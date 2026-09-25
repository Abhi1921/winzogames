import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, Play, Users } from "lucide-react";

export interface GameCardProps {
  id?: string;
  slug?: string;
  name?: string;
  category?: string;
  thumbnail?: string;
  difficulty?: string;
  playCount?: number;
  rating?: number;
  isMultiplayer?: boolean;
  game?: any;
}

export function GameCard(props: GameCardProps) {
  const item = props.game || props;
  const id = item.id || "1";
  const slug = item.slug || "ludo";
  const name = item.name || "Game";
  const category = item.category || "Board";
  const thumbnail = item.thumbnail || "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600&auto=format&fit=crop&q=80";
  const difficulty = item.difficulty || "EASY";
  const playCount = item.playCount || 1000;
  const rating = item.rating || 4.8;
  const isMultiplayer = item.isMultiplayer || false;

  const [isFav, setIsFav] = useState(false);

  const formatPlays = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toLocaleString();
  };

  const difficultyColors: Record<string, string> = {
    EASY: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    HARD: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
  };

  return (
    <div className="group relative bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark hover:border-cyan-500 rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
      {/* Thumbnail Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <img
          src={thumbnail}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
          {category}
        </span>

        {/* Multiplayer Badge */}
        {isMultiplayer && (
          <span className="absolute top-3 left-24 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-600 text-white shadow-md">
            LIVE ONLINE
          </span>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFav(!isFav);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/70 backdrop-blur-md text-slate-300 hover:text-pink-500 transition-colors z-10"
        >
          <Heart className={`w-4 h-4 ${isFav ? "text-pink-500 fill-pink-500" : ""}`} />
        </button>

        {/* Play Overlay Button */}
        <Link
          to={`/games/${slug}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg text-white font-black transform group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-current translate-x-0.5" />
          </div>
        </Link>
      </div>

      {/* Info Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-base group-hover:text-cyan-500 transition-colors truncate">
              {name}
            </h3>
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase ${
                difficultyColors[difficulty] || difficultyColors.EASY
              }`}
            >
              {difficulty}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{formatPlays(playCount)} plays</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <Link
          to={`/games/${slug}`}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-border-dark group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-600 text-slate-800 dark:text-slate-200 group-hover:text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <span>PLAY NOW</span>
          <Play className="w-3.5 h-3.5 fill-current" />
        </Link>
      </div>
    </div>
  );
}
