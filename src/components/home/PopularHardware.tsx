"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, Heart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useQuery } from "@tanstack/react-query";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useTranslations } from "next-intl"; 

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  thumbnail: string;
  stock: number;
}

const fetchPopularHardware = async (): Promise<Product[]> => {
  const res = await fetch(
    "https://dummyjson.com/products/category/laptops?limit=4",
  );
  if (!res.ok) throw new Error("Failed to fetch popular hardware");
  const data = await res.json();
  return data.products;
};

export default function PopularHardware() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["popularHardware"],
    queryFn: fetchPopularHardware,
  });
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const t = useTranslations("home.popularHardware"); 

  if (isLoading) {
    return (
      <section className="w-full px-8 lg:px-16 relative z-10 flex flex-col gap-10">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-3">
            <div className="w-32 h-4 bg-base-900/60 rounded-full animate-pulse"></div>
            <div className="w-64 md:w-96 h-10 bg-base-900/60 rounded-xl animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl bg-base-950 border border-purple-500/10 p-5 h-85 animate-pulse"
            >
              <div className="w-full aspect-4/3 rounded-xl bg-base-900/40 mb-4"></div>
              <div className="w-16 h-3 bg-base-900/60 rounded mb-2"></div>
              <div className="w-full h-5 bg-base-900/60 rounded mb-2"></div>
              <div className="w-24 h-4 bg-base-900/60 rounded mt-auto"></div>
              <div className="pt-4 mt-3 border-t border-purple-500/10 flex justify-between items-center">
                <div className="w-16 h-6 bg-base-900/60 rounded"></div>
                <div className="w-24 h-8 bg-base-900/60 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="w-full px-8 lg:px-16 relative z-10 flex flex-col gap-10">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary-400 text-xs font-bold tracking-widest uppercase">
            <span className="w-8 h-0.5 bg-purple-500 rounded-full"></span>
            {t("trendingItems")}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-base-50 tracking-tight">
            {t("mostPopular").split(" ")[0]}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-purple-600">
              {t("mostPopular").split(" ").slice(1).join(" ")}
            </span>
          </h2>
        </div>
        <Link
          href="/shop/popular"
          className="hidden md:flex items-center gap-2 text-base-300 hover:text-white font-semibold transition-colors group text-sm"
        >
          {t("viewAllItems")}{" "}
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"
          />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-2xl bg-linear-to-b from-purple-950/40 via-base-950 to-base-950 border border-purple-500/20 p-5 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/60 hover:shadow-[0_10px_35px_rgba(168,85,247,0.25)]"
          >
            <div className="relative w-full aspect-4/3 rounded-xl bg-white/5 border border-purple-500/20 overflow-hidden flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]" />
              <button
                type="button"
                aria-label={`Add ${product.title} to wishlist`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleItem({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.thumbnail,
                  });
                }}
                className={`absolute top-3 right-3 w-8 h-8 rounded-lg bg-base-950/60 border flex items-center justify-center backdrop-blur-md z-10 transition-all ${
                  isInWishlist(product.id)
                    ? "text-rose-500 border-rose-500/50 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                    : "border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-600/40"
                }`}
              >
                <Heart
                  size={16}
                  className={isInWishlist(product.id) ? "fill-rose-500" : ""}
                  aria-hidden="true"
                />
              </button>
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                unoptimized
                className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col gap-2 grow">
              <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider">
                {product.category}
              </span>
              <h3
                className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1"
                title={product.title}
              >
                {product.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-base-300 my-1">
                <div className="flex items-center text-yellow-400">
                  <Star size={14} className="fill-yellow-400" />
                </div>
                <span className="font-bold text-white">{product.rating}</span>
                <span className="text-base-500">
                  ({product.stock} {t("inStock")})
                </span>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-purple-500/10 flex items-center justify-between">
              <span className="text-lg font-black text-white">
                ${product.price.toFixed(2)}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addItem({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.thumbnail,
                  });
                }}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
              >
                {t("addToCart")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
