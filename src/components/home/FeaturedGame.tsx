"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trophy, Plus, Heart, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface SQLGameProduct {
  ProductID: number;
  Title: string;
  Price: number;
  ImageUrl?: string;
}

export default function FeaturedGame() {
  const [game, setGame] = useState<SQLGameProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toggleItem, isInWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  
  const t = useTranslations("home.featured");
  const tCommon = useTranslations("common");

  useEffect(() => {
    async function fetchFeaturedGame() {
      try {
        const res = await fetch("/api/games/featured");
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
  }, []);

  if (isLoading) {
    return (
      <section className="w-full h-96 my-12 bg-base-950 flex items-center justify-center relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-base-900/20 animate-pulse"></div>
        <div className="flex items-center gap-3 text-yellow-500/50 relative z-10">
          <Trophy className="animate-bounce" size={28} />
          <span className="font-bold tracking-widest uppercase text-sm">
            {t("unlocking")}
          </span>
        </div>
      </section>
    );
  }

  if (!game) return null;

  const isWishlisted = isInWishlist(game.ProductID);
  const salePrice = Number(game.Price) || 0;
  const imageUrl = game.ImageUrl || "/images/placeholder.jpg";

  return (
    <section className="relative w-full min-h-87.5 flex items-center border-y border-white/5">
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={game.Title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover opacity-30 object-top"
        />
        <div className="absolute inset-0 bg-linear-to-r from-base-950 via-base-950/80 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-base-950 via-transparent to-base-950" />
        <div className="absolute inset-0 bg-linear-to-b from-base-950 via-transparent to-transparent opacity-80" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full flex justify-start">
        <div className="max-w-2xl flex flex-col gap-5 glass-panel p-6 md:p-8 border-s-4 border-s-yellow-500/80 bg-base-950/40 backdrop-blur-xl hover:bg-base-950/50 transition-colors duration-500">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold tracking-widest uppercase w-fit shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <Trophy size={12} />
            {t("gameOfMonth")}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-base-50 tracking-tight leading-none drop-shadow-lg">
            {game.Title}
          </h2>
          
          <p className="text-base-300 leading-relaxed text-sm md:text-base line-clamp-4 mt-1">
            Experience the ultimate gaming adventure. Purchase this masterpiece directly from our store and get instant access to the digital key.
          </p>

          <div className="flex flex-wrap items-center gap-5 mt-1">
            <div className="flex items-center gap-3 text-base-50">
              <div className="w-auto px-5 h-11 rounded-xl bg-primary-500/20 border border-primary-500/50 flex items-center justify-center text-primary-400 font-black text-xl shadow-[0_0_15px_rgba(170,79,255,0.2)]">
                ${salePrice.toFixed(2)}
              </div>
              <span className="text-[10px] text-base-400 uppercase tracking-widest font-semibold">
                Instant Digital Key
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-base-800/50">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addItem({
                  id: game.ProductID,
                  title: game.Title,
                  price: salePrice,
                  image: imageUrl,
                });
                toast.success(tCommon("addedToLoot", { item: game.Title }));
              }}
              className="group flex items-center gap-3 bg-linear-to-r from-yellow-500 to-yellow-400 text-yellow-950 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:scale-105"
            >
              <ShoppingBag size={18} className="group-hover:-translate-y-1 transition-transform" />
              {tCommon("addToCart")}
            </button>
            <button
              type="button"
              onClick={() => {
                toggleItem({
                  id: game.ProductID,
                  title: game.Title,
                  price: salePrice,
                  image: imageUrl,
                });
              }}
              aria-pressed={isWishlisted}
              className={`group flex items-center gap-3 bg-base-900/50 hover:bg-base-800/80 border border-base-700/50 px-6 py-3 rounded-xl font-bold transition-all duration-300 backdrop-blur-md ${
                isWishlisted ? "text-rose-400 border-rose-500/50" : "text-base-50"
              }`}
            >
              {isWishlisted ? (
                <Heart size={18} className="fill-rose-400 text-rose-400" />
              ) : (
                <Plus size={18} className="text-base-400 group-hover:text-yellow-400 transition-colors" />
              )}
              {isWishlisted ? t("wishlisted") : t("addToWishlist")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}