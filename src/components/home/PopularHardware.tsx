"use client";

import Link from "next/link";
import { Star, ShoppingBag, ArrowRight, Heart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  rating: number;
  reviews: string;
  badge?: string;
}

const POPULAR_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Nexus Pro Wireless Mechanical Keyboard",
    category: "Keyboards",
    price: "$189.99",
    rating: 4.9,
    reviews: "(128)",
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "CyberDeck Programmable Macro Pad X9",
    category: "Workspace Gear",
    price: "$85.00",
    rating: 4.8,
    reviews: "(94)",
    badge: "Hot",
  },
  {
    id: "3",
    name: "AuraStream RGB Monitor Light Bar",
    category: "Lighting",
    price: "$64.50",
    rating: 4.9,
    reviews: "(215)",
  },
  {
    id: "4",
    name: "Vanguard Custom Gaming Rig RTX 5090",
    category: "Custom PCs",
    price: "$2,899.00",
    rating: 5.0,
    reviews: "(42)",
    badge: "Ultimate",
  },
];

export default function PopularHardware() {
  return (
    <section className="w-full px-8 lg:px-16 py-20 relative z-10 flex flex-col gap-10">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary-400 text-xs font-bold tracking-widest uppercase">
            <span className="w-8 h-[2px] bg-purple-500 rounded-full"></span>
            Trending Store Items
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-base-50 tracking-tight">
            Most Popular{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
              Hardware & Gear
            </span>
          </h2>
        </div>
        <Link
          href="/shop/popular"
          className="hidden md:flex items-center gap-2 text-base-300 hover:text-white font-semibold transition-colors group text-sm"
        >
          View All Items{" "}
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {POPULAR_PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-purple-950/40 via-base-950 to-base-950 border border-purple-500/20 p-5 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/60 hover:shadow-[0_10px_35px_rgba(168,85,247,0.25)]"
          >
            <div className="relative w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-purple-900/30 to-base-900 border border-purple-500/20 overflow-hidden flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)]" />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-purple-600/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md shadow-lg border border-purple-400/30">
                  {product.badge}
                </span>
              )}
              <button className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-base-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 hover:text-white hover:bg-purple-600/40 transition-colors backdrop-blur-md">
                <Heart size={16} />
              </button>
              <ShoppingBag
                size={48}
                className="text-purple-400/60 group-hover:scale-110 group-hover:text-purple-300 transition-all duration-500"
              />
            </div>
            <div className="flex flex-col gap-2 flex-grow">
              <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider">
                {product.category}
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                {product.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-base-300 my-1">
                <div className="flex items-center text-yellow-400">
                  <Star size={14} className="fill-yellow-400" />
                </div>
                <span className="font-bold text-white">{product.rating}</span>
                <span className="text-base-500">{product.reviews}</span>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-purple-500/10 flex items-center justify-between">
              <span className="text-lg font-black text-white">
                {product.price}
              </span>
              <button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
