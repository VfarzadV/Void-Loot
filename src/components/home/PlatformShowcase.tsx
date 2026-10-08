"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Monitor, Gamepad, ShoppingBag, Star } from "lucide-react";

interface PlatformShowcaseProps {
  platformId: number; // 1 for PC, 2 for PlayStation
  title: string;
  icon: "pc" | "playstation";
}

interface RawgGame {
  id: number;
  name: string;
  background_image: string;
  metacritic: number | null;
}

export default function PlatformShowcase({
  platformId,
  title,
  icon,
}: PlatformShowcaseProps) {
  const [games, setGames] = useState<RawgGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const IconComponent = icon === "playstation" ? Gamepad : Monitor;

  useEffect(() => {
    async function fetchPlatformGames() {
      const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games?key=${apiKey}&parent_platforms=${platformId}&ordering=-metacritic&page_size=6`,
        );
        if (res.ok) {
          const data = await res.json();
          setGames(data.results);
        }
      } catch (error) {
        console.error("Failed to fetch platform games:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPlatformGames();
  }, [platformId]);

  if (isLoading) return null;
  if (games.length === 0) return null;

  return (
    <section className="w-full px-8 lg:px-16 relative z-10">
      <div className="flex items-end justify-between mb-6 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-600 to-primary-900 p-px shadow-[0_0_15px_rgba(170,79,255,0.3)]">
            <div className="w-full h-full bg-base-950 rounded-xl flex items-center justify-center">
              <IconComponent size={20} className="text-primary-400" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md">
            {title}
          </h2>
        </div>
        <Link
          href={`/games?platform=${platformId}`}
          className="hidden md:flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-xs font-bold tracking-wider uppercase transition-colors group"
        >
          View All{" "}
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {games.map((game) => {
          const mockPrice = ((game.id % 40) + 19.99).toFixed(2);
          return (
            <div
              key={game.id}
              className="group relative flex flex-col overflow-hidden rounded-xl bg-base-950 border border-base-800/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-500/50 hover:shadow-[0_8px_25px_rgba(170,79,255,0.2)]"
            >
              <Link
                href={`/games/${game.id}`}
                className="relative w-full aspect-3/4 overflow-hidden bg-base-900 block"
              >
                <Image
                  src={game.background_image || "/images/placeholder.jpg"}
                  alt={game.name}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-base-950 via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-300" />
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary-500 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {game.metacritic && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/10">
                    <Star
                      size={10}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <span className="text-[10px] font-bold text-white">
                      {game.metacritic}
                    </span>
                  </div>
                )}
              </Link>
              <div className="p-3 flex flex-col grow gap-2 relative z-10 bg-base-950">
                <Link href={`/games/${game.id}`} className="grow">
                  <h3
                    className="text-xs font-bold text-base-50 line-clamp-2 group-hover:text-primary-300 transition-colors leading-relaxed"
                    title={game.name}
                  >
                    {game.name}
                  </h3>
                </Link>
                <div className="pt-2 border-t border-base-800/50 flex items-center justify-between mt-auto">
                  <span className="text-sm font-black text-white">
                    ${mockPrice}
                  </span>
                  <button className="w-7 h-7 rounded-lg bg-base-900 flex items-center justify-center transition-all border border-white/5 text-base-400 hover:text-white hover:bg-primary-600 hover:border-primary-500 hover:shadow-[0_0_10px_rgba(170,79,255,0.4)]">
                    <ShoppingBag size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
