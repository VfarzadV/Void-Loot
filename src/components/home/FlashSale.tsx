"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Zap, Clock, Star } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import WishlistButton from "../cart/WishlistButton";
import { useTranslations } from "next-intl";

interface DealProduct {
  id: number;
  title: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  thumbnail: string;
  stock: number;
}

const fetchFlashDeals = async (): Promise<DealProduct[]> => {
  const res = await fetch(
    "https://dummyjson.com/products?sortBy=discountPercentage&order=desc&limit=4",
  );
  if (!res.ok) throw new Error("Failed to fetch flash deals");
  const data = await res.json();
  return data.products;
};

export default function FlashSale() {
  const t = useTranslations("home.flashSale");
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 30,
  });
  const addItem = useCartStore((state) => state.addItem);

  const { data: deals = [] } = useQuery({
    queryKey: ["flashDealsList"],
    queryFn: fetchFlashDeals,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (deals.length === 0) return null;

  return (
    <section className="w-full px-8 lg:px-16 relative z-10 flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-linear-to-r from-purple-950/60 via-base-950 to-base-950 p-8 rounded-2xl border border-purple-500/30 relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold tracking-widest uppercase">
            <Zap size={16} className="text-yellow-400 animate-bounce" />{" "}
            {t("limitedTime")}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            {t("flashSale").split(" ")[0]}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">
              {t("flashSale").split(" ").slice(1).join(" ")}
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center gap-1.5 text-xs text-base-300 font-semibold mr-2">
            <Clock size={16} className="text-purple-400 animate-pulse" />{" "}
            {t("endsIn")}
          </div>
          <div className="flex items-center gap-2 font-mono font-bold text-white">
            <span className="bg-purple-900/60 border border-purple-500/40 px-3 py-1.5 rounded-xl shadow-md">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-purple-400">:</span>
            <span className="bg-purple-900/60 border border-purple-500/40 px-3 py-1.5 rounded-xl shadow-md">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-purple-400">:</span>
            <span className="bg-purple-900/60 border border-purple-500/40 px-3 py-1.5 rounded-xl shadow-md text-pink-400">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {deals.map((deal) => {
          const salePrice = (
            deal.price -
            (deal.price * deal.discountPercentage) / 100
          ).toFixed(2);
          return (
            <div
              key={deal.id}
              className="group relative overflow-hidden rounded-2xl bg-linear-to-b from-purple-950/40 via-base-950 to-base-950 border border-purple-500/20 p-5 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/60 hover:shadow-[0_10px_35px_rgba(168,85,247,0.25)]"
            >
              <div className="relative w-full aspect-4/3 rounded-xl bg-white/5 border border-purple-500/20 overflow-hidden flex items-center justify-center mb-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]" />
                <span className="absolute top-3 left-3 bg-pink-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md shadow-lg border border-pink-400/30 animate-pulse z-10">
                  -{deal.discountPercentage.toFixed(0)}%
                </span>
                <WishlistButton
                  product={{
                    id: deal.id,
                    title: deal.title,
                    price: deal.price,
                    image: deal.thumbnail,
                  }}
                />
                <Image
                  src={deal.thumbnail}
                  alt={deal.title}
                  fill
                  unoptimized
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col gap-2 grow">
                <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider">
                  {deal.category.replace("-", " ")}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                  {deal.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-base-300 my-1">
                  <div className="flex items-center text-yellow-400">
                    <Star size={14} className="fill-yellow-400" />
                  </div>
                  <span className="font-bold text-white">
                    {deal.rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  <div className="flex justify-between text-[10px] text-base-400 font-medium">
                    <span>
                      {t("stockLeft")} {deal.stock}
                    </span>
                    <span className="text-pink-400">{t("limitedStock")}</span>
                  </div>
                  <div className="w-full h-1.5 bg-base-900 rounded-full overflow-hidden border border-purple-500/20">
                    <div
                      className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{
                        width: `${Math.min((deal.stock / 100) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-purple-500/10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-base-500 line-through">
                    ${deal.price.toFixed(2)}
                  </span>
                  <span className="text-lg font-black text-pink-400">
                    ${salePrice}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addItem({
                      id: deal.id,
                      title: deal.title,
                      price: deal.price,
                      image: deal.thumbnail,
                    });
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                >
                  {t("addToCart")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
