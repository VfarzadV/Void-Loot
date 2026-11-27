"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Zap, Clock } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import WishlistButton from "../cart/WishlistButton";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

interface DealProduct {
  id: number;
  productId: number;
  title: string;
  category: string;
  price: number;
  discountPercentage: number;
  image: string;
  endsAt: string;
}

const fetchFlashDeals = async (): Promise<DealProduct[]> => {
  const res = await fetch("/api/flashsale");
  if (!res.ok) throw new Error("Failed to fetch flash deals");
  return (await res.json()) as DealProduct[];
};

export default function FlashSale() {
  const t = useTranslations("home.flashSale");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [currentTime, setCurrentTime] = useState(0);

  const addItem = useCartStore((state) => state.addItem);

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ["flashDealsList"],
    queryFn: fetchFlashDeals,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading || deals.length === 0) return null;

  const nearestEnd = Math.min(
    ...deals.map((deal) => new Date(deal.endsAt).getTime()),
  );
  const remainingSeconds =
    currentTime === 0
      ? 0
      : Math.max(0, Math.floor((nearestEnd - currentTime) / 1000));
  const timeLeft = {
    hours: Math.floor(remainingSeconds / 3600),
    minutes: Math.floor((remainingSeconds % 3600) / 60),
    seconds: remainingSeconds % 60,
  };

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
          const salePrice = Number(
            (deal.price - (deal.price * deal.discountPercentage) / 100).toFixed(
              2,
            ),
          );
          return (
            <div
              key={`flash-${deal.id}`}
              className="group relative overflow-hidden rounded-2xl bg-linear-to-b from-purple-950/40 via-base-950 to-base-950 border border-purple-500/20 p-5 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/60 hover:shadow-[0_10px_35px_rgba(168,85,247,0.25)]"
            >
              <div className="relative w-full aspect-4/3 rounded-xl bg-white/5 border border-purple-500/20 overflow-hidden flex items-center justify-center mb-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]" />
                <span className="absolute top-3 left-3 bg-pink-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md shadow-lg border border-pink-400/30 animate-pulse z-10">
                  -{deal.discountPercentage.toFixed(0)}%
                </span>
                <WishlistButton
                  product={{
                    id: deal.productId,
                    title: deal.title,
                    price: salePrice,
                    image: deal.image,
                  }}
                />
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                <p className="text-xs text-base-400">
                  {t("endsAt", {
                    date: new Intl.DateTimeFormat(locale, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(deal.endsAt)),
                  })}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-purple-500/10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-base-500 line-through">
                    ${deal.price.toFixed(2)}
                  </span>
                  <span className="text-lg font-black text-pink-400">
                    ${salePrice.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addItem({
                      id: deal.productId,
                      title: deal.title,
                      price: salePrice,
                      image: deal.image,
                    });
                    toast.success(tCommon("addedToLoot", { item: deal.title }));
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
