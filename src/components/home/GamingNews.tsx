"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Flame,
  Calendar,
  ArrowUpRight,
  Gamepad2,
} from "lucide-react";

interface RawgNewsItem {
  id: number;
  name: string;
  background_image: string;
  released: string;
  genres: { name: string }[];
}

export default function GamingNews() {
  const [news, setNews] = useState<RawgNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestUpdates() {
      const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games?key=${apiKey}&dates=2026-01-01,2026-10-31&ordering=-added&page_size=3`,
        );
        if (res.ok) {
          const data = await res.json();
          setNews(data.results);
        }
      } catch (error) {
        console.error("Failed to fetch gaming news:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLatestUpdates();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full px-8 lg:px-16  relative z-10">
        <div className="h-100 w-full bg-base-900/40 animate-pulse rounded-3xl border border-white/5"></div>
      </section>
    );
  }
  if (news.length === 0) return null;
  const featuredNews = news[0];
  const sideNews = news.slice(1, 3);

  return (
    <section className="w-full px-8 lg:px-16  relative z-10">
      <div className="flex items-end justify-between mb-8 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary-600/20 to-primary-900/10 border border-primary-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(170,79,255,0.2)]">
            <Flame className="text-primary-500 animate-pulse" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-primary-400 text-[10px] font-bold tracking-widest uppercase mb-1">
              Stay Updated
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
              Latest <span className="text-primary-400">Drops & News</span>
            </h2>
          </div>
        </div>
        <Link
          href="/news"
          className="hidden md:flex items-center gap-1.5 text-base-400 hover:text-white text-xs font-bold tracking-wider uppercase transition-colors group px-4 py-2 rounded-lg bg-base-900/50 hover:bg-primary-600/20 border border-transparent hover:border-primary-500/30"
        >
          Read All Intel{" "}
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {featuredNews && (
          <Link
            href={`/games/${featuredNews.id}`}
            className="group lg:col-span-2 relative h-70 sm:h-85 rounded-3xl overflow-hidden bg-base-950 border border-base-800/60 transition-all duration-500 hover:border-primary-500/60 hover:shadow-[0_15px_40px_rgba(170,79,255,0.25)] hover:-translate-y-1 block"
          >
            <Image
              src={featuredNews.background_image || "/images/placeholder.jpg"}
              alt={featuredNews.name}
              fill
              unoptimized
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-base-950 via-base-950/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-linear-to-r from-base-950/80 to-transparent w-2/3" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(170,79,255,0.5)]">
                  Major Update
                </span>
                <span className="flex items-center gap-1.5 text-xs text-base-300 font-medium bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10">
                  <Calendar size={12} className="text-primary-400" />
                  {featuredNews.released}
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 line-clamp-2 leading-tight group-hover:text-primary-300 transition-colors">
                {featuredNews.name} : The Next Chapter
              </h3>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Gamepad2 size={16} className="text-base-400" />
                  <span className="text-sm font-semibold text-base-300">
                    {featuredNews.genres
                      ?.slice(0, 2)
                      .map((g) => g.name)
                      .join(" • ")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-primary-400 font-bold text-sm group-hover:text-primary-300">
                  View Details{" "}
                  <ArrowUpRight
                    size={18}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </div>
              </div>
            </div>
          </Link>
        )}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {sideNews.map((newsItem, idx) => (
            <Link
              key={newsItem.id}
              href={`/games/${newsItem.id}`}
              className="group relative h-32.5 sm:h-39.5 rounded-3xl overflow-hidden bg-base-950 border border-base-800/60 transition-all duration-500 hover:border-primary-500/50 hover:shadow-[0_10px_30px_rgba(170,79,255,0.2)] hover:-translate-y-1 block"
            >
              <Image
                src={newsItem.background_image || "/images/placeholder.jpg"}
                alt={newsItem.name}
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-base-950 via-base-950/80 to-base-950/20 opacity-95 group-hover:opacity-85 transition-opacity duration-500" />
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                  <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-white/10">
                    {idx === 0 ? "Trending" : "New Release"}
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-base-500 group-hover:text-primary-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 line-clamp-2 group-hover:text-primary-300 transition-colors leading-snug">
                    {newsItem.name}
                  </h3>
                  <p className="text-[11px] text-base-400 font-medium flex items-center gap-1.5">
                    <Calendar size={10} className="text-primary-500" />
                    Released: {newsItem.released}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
