"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface RawSQLProduct {
  ProductID: number;
  Title: string;
  Price: number;
  ImageUrl?: string;
}

const fetchGiftCards = async (): Promise<RawSQLProduct[]> => {
  const res = await fetch("/api/giftcards");
  if (!res.ok) throw new Error("Failed to fetch gift cards");
  return res.json();
};

export default function GiftCards() {
  const addItem = useCartStore((state) => state.addItem);
  const t = useTranslations("home.brandsAndGifts");

  const { data: giftCards = [], isLoading } = useQuery({
    queryKey: ["giftCardsList"],
    queryFn: fetchGiftCards,
  });

  if (isLoading || giftCards.length === 0) return null;

  return (
    <section className="w-full px-8 lg:px-16 relative z-10">
      <div className="flex items-end justify-between mb-6 border-b border-white/5 pb-3">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          {t("digitalGiftCards").split(" ")[0]}{" "}
          <span className="text-primary-400">
            {t("digitalGiftCards").split(" ").slice(1).join(" ")}
          </span>
        </h2>
        <Link
          href="/shop"
          className="hidden md:flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-xs font-bold tracking-wider uppercase transition-colors group"
        >
          {t("viewAll")}{" "}
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"
          />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {giftCards.map((card) => (
          <div
            key={card.ProductID}
            className="group relative flex flex-col items-center justify-between overflow-hidden rounded-2xl bg-base-950 border border-base-800/60 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-primary-500/50 hover:shadow-[0_8px_30px_rgba(170,79,255,0.15)]"
          >
            <div className="relative w-full aspect-[1.58/1] mb-6 flex items-center justify-center rounded-xl overflow-hidden shadow-lg transform transition-all duration-500 group-hover:scale-105 group-hover:-rotate-2 border border-white/10">
              <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image
                src={card.ImageUrl || "/images/GiftCard.png"}
                alt={card.Title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover relative z-10"
              />
            </div>
            <div className="w-full flex flex-col gap-1 text-center mb-4">
              <h3 className="text-sm font-bold text-base-50 group-hover:text-primary-300 transition-colors">
                {card.Title}
              </h3>
              <p className="text-[10px] text-base-400">{t("instantCode")}</p>
            </div>
            <div className="w-full pt-4 border-t border-base-800/50 flex items-center justify-between">
              <span className="text-lg font-black text-white">
                ${Number(card.Price).toFixed(2)}
              </span>
              <button
                type="button"
                aria-label={`Add ${card.Title} to cart`}
                onClick={(e) => {
                  e.preventDefault();
                  addItem({
                    id: card.ProductID,
                    title: card.Title,
                    price: Number(card.Price),
                    image: card.ImageUrl || "/images/GiftCard.png",
                  });
                  toast.success(`${card.Title} added to loot!`);
                }}
                className="w-8 h-8 rounded-lg bg-base-900 flex items-center justify-center transition-all border border-white/5 text-base-400 hover:text-white hover:bg-primary-600 hover:border-primary-500 hover:shadow-[0_0_10px_rgba(170,79,255,0.4)]"
              >
                <ShoppingBag size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
