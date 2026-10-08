"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Swords,
  Crosshair,
  Car,
  Ghost,
  Brain,
  Trophy,
  Gamepad,
  LucideIcon,
} from "lucide-react";

interface GenreUIProps {
  icon: LucideIcon;
  color: string;
  accent: string;
  glow: string;
  iconColor: string;
}

const GENRE_UI_MAP: Record<string, GenreUIProps> = {
  action: {
    icon: Swords,
    color: "from-red-500/80 to-orange-500/20",
    accent: "group-hover:border-red-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]",
    iconColor: "text-red-400 group-hover:text-red-300",
  },
  shooter: {
    icon: Crosshair,
    color: "from-blue-500/80 to-cyan-500/20",
    accent: "group-hover:border-blue-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    iconColor: "text-blue-400 group-hover:text-blue-300",
  },
  "role-playing-games-rpg": {
    icon: Ghost,
    color: "from-primary-500/80 to-primary-800/20",
    accent: "group-hover:border-primary-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(170,79,255,0.3)]",
    iconColor: "text-primary-400 group-hover:text-primary-300",
  },
  racing: {
    icon: Car,
    color: "from-yellow-500/80 to-amber-500/20",
    accent: "group-hover:border-yellow-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]",
    iconColor: "text-yellow-400 group-hover:text-yellow-300",
  },
  strategy: {
    icon: Brain,
    color: "from-emerald-500/80 to-green-500/20",
    accent: "group-hover:border-emerald-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
    iconColor: "text-emerald-400 group-hover:text-emerald-300",
  },
  sports: {
    icon: Trophy,
    color: "from-pink-500/80 to-rose-500/20",
    accent: "group-hover:border-pink-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]",
    iconColor: "text-pink-400 group-hover:text-pink-300",
  },
};

interface RawgGenre {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}

export default function Genres() {
  const [genres, setGenres] = useState<RawgGenre[]>([]);

  useEffect(() => {
    async function fetchRawgGenres() {
      const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
      try {
        const res = await fetch(`https://api.rawg.io/api/genres?key=${apiKey}`);
        if (res.ok) {
          const data = await res.json();
          const mappedGenres = data.results.filter(
            (g: RawgGenre) => GENRE_UI_MAP[g.slug],
          );
          setGenres(mappedGenres.slice(0, 6));
        }
      } catch (error) {
        console.error("RAWG Genres Error", error);
      }
    }
    fetchRawgGenres();
  }, []);

  if (genres.length === 0) return null;

  return (
    <section className="w-full px-8 lg:px-16 py-24 relative z-10">
      <div className="flex items-end justify-between mb-12">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary-400 text-sm font-bold tracking-widest uppercase">
            <span className="w-8 h-0.5 bg-primary-500 rounded-full"></span>
            Categories
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-base-50 tracking-tight">
            Explore by{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-primary-600">
              Genre
            </span>
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {genres.map((genre) => {
          const ui = GENRE_UI_MAP[genre.slug] || {
            icon: Gamepad,
            color: "from-gray-500 to-gray-800",
            accent: "group-hover:border-gray-500",
            glow: "",
            iconColor: "text-gray-400",
          };
          const IconComponent = ui.icon;
          return (
            <Link
              href={`/categories/${genre.id}`}
              key={genre.id}
              className={`group relative overflow-hidden rounded-2xl glass-panel min-h-60 p-8 transition-all duration-500 hover:-translate-y-2 border border-base-800/80 bg-base-950 ${ui.accent} ${ui.glow}`}
            >
              <Image
                src={genre.image_background}
                alt={genre.name}
                fill
                unoptimized
                className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-linear-to-t from-base-950 via-base-950/70 to-transparent" />
              <div
                className={`absolute inset-0 bg-linear-to-br ${ui.color} opacity-10 group-hover:opacity-30 transition-opacity duration-500 mix-blend-overlay`}
              />
              <div className="relative z-10 flex flex-col h-full gap-4 justify-between">
                <div className="flex items-start justify-between">
                  <div
                    className={`p-4 rounded-xl bg-base-950/60 border border-white/10 backdrop-blur-md transition-colors ${ui.iconColor}`}
                  >
                    <IconComponent size={32} strokeWidth={1.5} />
                  </div>
                </div>
                <div className="mt-auto">
                  <h3 className="text-2xl font-bold text-base-50 mb-1 group-hover:text-white transition-colors drop-shadow-md">
                    {genre.name}
                  </h3>
                  <p className="text-sm text-base-300 leading-relaxed group-hover:text-base-200 transition-colors drop-shadow">
                    {genre.games_count.toLocaleString()} Games
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
