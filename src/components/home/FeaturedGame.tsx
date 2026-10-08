"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Calendar, Download, Plus } from "lucide-react";

interface RawgGame {
  id: number;
  name: string;
  background_image: string;
  description_raw: string;
  metacritic: number | null;
  released: string;
}

export default function FeaturedGame({ slug }: { slug: string }) {
  const [game, setGame] = useState<RawgGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedGame() {
      const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games/${slug}?key=${apiKey}`,
        );
        if (res.ok) {
          const data = await res.json();
          setGame(data);
        }
      } catch (error) {
        console.error("Failed to fetch featured game:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeaturedGame();
  }, [slug]); 

  if (isLoading) {
    return (
      <section className="w-full h-150 my-24 bg-base-950 flex items-center justify-center relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-base-900/20 animate-pulse"></div>
        <div className="flex items-center gap-3 text-yellow-500/50 relative z-10">
          <Trophy className="animate-bounce" size={32} />
          <span className="font-bold tracking-widest uppercase">
            Unlocking Masterpiece...
          </span>
        </div>
      </section>
    );
  }
  if (!game) return null;
  return (
    <section className="relative w-full min-h-150 my-24 flex items-center border-y border-white/5">
      <div className="absolute inset-0 z-0">
        <Image
          src={game.background_image}
          alt={game.name}
          fill
          unoptimized
          className="object-cover opacity-30 object-top"
        />
        <div className="absolute inset-0 bg-linear-to-r from-base-950 via-base-950/80 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-base-950 via-transparent to-base-950" />
        <div className="absolute inset-0 bg-linear-to-b from-base-950 via-transparent to-transparent opacity-80" />
      </div>
      <div className="container mx-auto px-8 lg:px-16 relative z-10 w-full flex justify-start">
        <div className="max-w-2xl flex flex-col gap-6 glass-panel p-8 md:p-12 border-l-4 border-l-yellow-500/80 bg-base-950/40 backdrop-blur-xl hover:bg-base-950/50 transition-colors duration-500">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold tracking-widest uppercase w-fit shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <Trophy size={14} />
            Game of the Month
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-base-50 tracking-tight leading-none drop-shadow-lg">
            {game.name}
          </h2>
          <p className="text-base-300 leading-relaxed text-sm md:text-base line-clamp-4 mt-2">
            {game.description_raw}
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-2">
            {game.metacritic && (
              <div className="flex items-center gap-3 text-base-50">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-400 font-bold text-lg shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  {game.metacritic}
                </div>
                <span className="text-xs text-base-400 uppercase tracking-widest font-semibold">
                  Metascore
                </span>
              </div>
            )}
            <div className="w-px h-8 bg-white/10"></div>
            {game.released && (
              <div className="flex items-center gap-3 text-base-50">
                <div className="w-12 h-12 rounded-xl bg-base-800/50 border border-base-700 flex items-center justify-center text-base-300">
                  <Calendar size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">
                    {game.released.substring(0, 4)}
                  </span>
                  <span className="text-xs text-base-400 uppercase tracking-widest">
                    Released
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-base-800/50">
            <Link
              href={`/games/${game.id}`}
              className="group flex items-center gap-3 bg-linear-to-r from-yellow-500 to-yellow-400 text-yellow-950 px-8 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:scale-105"
            >
              <Download
                size={18}
                className="group-hover:-translate-y-1 transition-transform"
              />
              Get it Now
            </Link>
            <button className="group flex items-center gap-3 bg-base-900/50 hover:bg-base-800/80 border border-base-700/50 text-base-50 px-8 py-3.5 rounded-xl font-bold transition-all duration-300 backdrop-blur-md">
              <Plus
                size={18}
                className="text-base-400 group-hover:text-yellow-400 transition-colors"
              />
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
