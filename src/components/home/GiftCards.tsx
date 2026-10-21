"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const GIFT_CARDS = [
  {
    id: 901,
    title: "PSN Gift Card",
    value: "$50",
    price: 49.99,
    image: "/images/GiftCard.png",
  },
  {
    id: 902,
    title: "PSN Gift Card",
    value: "$60",
    price: 59.99,
    image: "/images/GiftCard.png",
  },
  {
    id: 903,
    title: "PSN Gift Card",
    value: "$75",
    price: 74.99,
    image: "/images/GiftCard.png",
  },
  {
    id: 904,
    title: "PSN Gift Card",
    value: "$100",
    price: 98.99,
    image: "/images/GiftCard.png",
  },
];

export default function GiftCards() {
  const addItem = useCartStore((state) => state.addItem);
  const t = useTranslations("home.brandsAndGifts");

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
        {GIFT_CARDS.map((card) => (
          <div
            key={card.id}
            className="group relative flex flex-col items-center justify-between overflow-hidden rounded-2xl bg-base-950 border border-base-800/60 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-primary-500/50 hover:shadow-[0_8px_30px_rgba(170,79,255,0.15)]"
          >
            <div className="relative w-full aspect-[1.58/1] mb-6 flex items-center justify-center rounded-xl overflow-hidden shadow-lg transform transition-all duration-500 group-hover:scale-105 group-hover:-rotate-2 border border-white/10">
              <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image
                src={card.image}
                alt={`${card.title} ${card.value}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover relative z-10"
              />
            </div>
            <div className="w-full flex flex-col gap-1 text-center mb-4">
              <h3 className="text-sm font-bold text-base-50 group-hover:text-primary-300 transition-colors">
                {card.title} {card.value}
              </h3>
              <p className="text-[10px] text-base-400">{t("instantCode")}</p>
            </div>
            <div className="w-full pt-4 border-t border-base-800/50 flex items-center justify-between">
              <span className="text-lg font-black text-white">
                ${card.price}
              </span>
              <button
                type="button"
                aria-label={`Add ${card.title} ${card.value} to cart`}
                onClick={(e) => {
                  e.preventDefault();
                  addItem({
                    id: card.id,
                    title: `${card.title} ${card.value}`,
                    price: card.price,
                    image: card.image,
                  });
                  toast.success(`${card.title} ${card.value} added to loot!`);
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
