"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Gamepad2, Flame, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import WishlistButton from "../cart/WishlistButton";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

interface SQLGameProduct {
  ProductID: number;
  Title: string;
  Price: number;
  ImageUrl?: string;
  Category?: string;
  Stock?: number;
}

const fetchTrendingGames = async (): Promise<SQLGameProduct[]> => {
  const res = await fetch("/api/games/trending");
  if (!res.ok) throw new Error("Failed to fetch trending games");
  return res.json();
};

export default function TrendingGames() {
  const t = useTranslations("home.trending");
  const tCommon = useTranslations("common");
  const addItem = useCartStore((state) => state.addItem);

  const { data: games = [], isLoading } = useQuery({
    queryKey: ["trendingGamesSQL"],
    queryFn: fetchTrendingGames,
  });

  if (isLoading) {
    return (
      <section className="w-full px-8 lg:px-16 py-12 flex flex-col items-center justify-center min-h-75">
        <div className="w-8 h-8 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4"></div>
        <p className="text-primary-400 font-mono text-xs animate-pulse">
          {t("loading")}
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
            {t("hotTrending")}
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-primary-600">
            {t("popularRightNow")}
          </h2>
        </div>
        <Link
          href="/games"
          className="hidden md:flex items-center gap-2 text-base-300 hover:text-white text-sm font-semibold transition-colors group"
        >
          {t("viewAll")}{" "}
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {games.map((game) => {
          const salePrice = Number(game.Price) || 0;
          return (
            <div
              key={game.ProductID}
              className="group relative flex flex-col overflow-hidden rounded-xl glass-panel bg-base-950 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(170,79,255,0.15)] border border-base-800/60 hover:border-primary-500/50"
            >
              <Link
                href={`/games/${game.ProductID}`}
                className="relative w-full aspect-video overflow-hidden bg-base-900 block"
              >
                <Image
                  src={game.ImageUrl || "/images/placeholder.jpg"}
                  alt={game.Title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-base-950 via-transparent to-transparent opacity-90" />

                {/* نشان کلید دیجیتال جایگزین متاکریتیک شد */}
                <div className="absolute top-3 left-3 flex items-center justify-center bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-md border border-white/10">
                  <Gamepad2
                    size={14}
                    className="text-primary-400 mr-1.5 rtl:ml-1.5"
                  />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                    Digital Key
                  </span>
                </div>
              </Link>

              <WishlistButton
                product={{
                  id: game.ProductID,
                  title: game.Title,
                  price: salePrice,
                  image: game.ImageUrl || "/images/placeholder.jpg",
                }}
              />

              <div className="p-4 flex flex-col grow gap-3 pointer-events-none">
                <div className="grow pointer-events-auto">
                  <Link href={`/games/${game.ProductID}`}>
                    <h3 className="text-base font-bold text-base-50 mb-1.5 line-clamp-1 group-hover:text-primary-300 transition-colors">
                      {game.Title}
                    </h3>
                  </Link>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-base-400 font-medium">
                    <span className="flex items-center gap-1 bg-base-900 px-2 py-1 rounded-md border border-white/5 uppercase">
                      {game.Category}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-base-800/50 flex items-center justify-between pointer-events-auto mt-auto">
                  <span className="text-lg font-black text-white">
                    ${salePrice.toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addItem({
                        id: game.ProductID,
                        title: game.Title,
                        price: salePrice,
                        image: game.ImageUrl || "/images/placeholder.jpg",
                      });
                      toast.success(
                        tCommon("addedToLoot", { item: game.Title }),
                      );
                    }}
                    className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(170,79,255,0.3)]"
                  >
                    <ShoppingBag size={14} />
                    {tCommon("addToCart")}
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
