"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, Monitor, Gamepad2, Flame } from "lucide-react";

interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

interface RawgGame {
  id: number;
  name: string;
  background_image: string;
  metacritic: number | null;
  released: string;
  genres: { name: string }[];
  parent_platforms: Platform[];
}

export default function TrendingGames() {
  const [games, setGames] = useState<RawgGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingGames() {
      const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games?key=${apiKey}&ordering=-added&page_size=8`,
        );
        if (res.ok) {
          const data = await res.json();
          setGames(data.results);
        }
      } catch (error) {
        console.error("Failed to fetch trending games:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrendingGames();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full px-8 lg:px-16 py-12 flex flex-col items-center justify-center min-h-75">
        <div className="w-8 h-8 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4"></div>
        <p className="text-primary-400 font-mono text-xs animate-pulse">
          Loading Trending Titles...
        </p>
      </section>
    );
  }

  if (games.length === 0) return null;

  return (
    <section className="w-full px-6 lg:px-12 relative z-10">
      <div className="flex items-end justify-between mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary-400 text-xs font-bold tracking-widest uppercase">
            <Flame size={14} className="text-orange-500 animate-pulse" />
            Hot & Trending
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-base-50 tracking-tight">
            Popular{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-primary-600">
              Right Now
            </span>
          </h2>
        </div>
        <Link
          href="/games"
          className="hidden md:flex items-center gap-2 text-base-300 hover:text-white text-sm font-semibold transition-colors group"
        >
          View All{" "}
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {games.map((game) => (
          <Link
            href={`/games/${game.id}`}
            key={game.id}
            className="group relative flex flex-col overflow-hidden rounded-xl glass-panel bg-base-950 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(170,79,255,0.15)] border border-base-800/60 hover:border-primary-500/50"
          >
            <div className="relative w-full aspect-video overflow-hidden bg-base-900">
              <Image
                src={game.background_image || "/images/placeholder.jpg"}
                alt={game.name}
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-base-950 via-transparent to-transparent opacity-90" />
              {game.metacritic && (
                <div
                  className={`absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-md font-bold text-xs backdrop-blur-md border ${
                    game.metacritic >= 90
                      ? "bg-green-500/20 text-green-400 border-green-500/50"
                      : game.metacritic >= 75
                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                        : "bg-orange-500/20 text-orange-400 border-orange-500/50"
                  }`}
                >
                  {game.metacritic}
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col grow gap-3">
              <div className="grow">
                <h3 className="text-base font-bold text-base-50 mb-1.5 line-clamp-1 group-hover:text-primary-300 transition-colors">
                  {game.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-base-400 font-medium">
                  {game.released && (
                    <span className="flex items-center gap-1 bg-base-900 px-2 py-1 rounded-md">
                      <Calendar size={12} className="text-primary-400" />
                      {game.released.substring(0, 4)}
                    </span>
                  )}
                  {game.genres?.[0] && (
                    <span className="flex items-center gap-1 bg-base-900 px-2 py-1 rounded-md">
                      <Gamepad2 size={12} className="text-cyan-400" />
                      {game.genres[0].name}
                    </span>
                  )}
                </div>
              </div>
              <div className="pt-3 border-t border-base-800/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-base-400">
                  {game.parent_platforms?.some((p) =>
                    p.platform.slug.includes("pc"),
                  ) && <Monitor size={14} />}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-base-500">
                    {game.parent_platforms
                      ?.slice(0, 3)
                      .map((p) => p.platform.name)
                      .join(", ")}
                    {(game.parent_platforms?.length || 0) > 3 ? " +" : ""}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
