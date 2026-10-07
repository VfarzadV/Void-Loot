"use client";

import { useState, useEffect } from "react";
import { Zap, Clock, ShoppingBag, Star } from "lucide-react";

interface DealItem {
  id: string;
  name: string;
  category: string;
  originalPrice: string;
  salePrice: string;
  discount: string;
  rating: number;
  soldPercentage: number;
}

const FLASH_DEALS: DealItem[] = [
  {
    id: "1",
    name: "Nexus Phantom RGB Gaming Headset",
    category: "Headsets",
    originalPrice: "$129.99",
    salePrice: "$84.99",
    discount: "-35%",
    rating: 4.9,
    soldPercentage: 78,
  },
  {
    id: "2",
    name: "CyberStorm Wireless Mechanical Keyboard",
    category: "Keyboards",
    originalPrice: "$199.99",
    salePrice: "$139.99",
    discount: "-30%",
    rating: 4.8,
    soldPercentage: 85,
  },
  {
    id: "3",
    name: "Vortex Pro RGB Gaming Mouse",
    category: "Mice",
    originalPrice: "$89.99",
    salePrice: "$59.99",
    discount: "-33%",
    rating: 4.9,
    soldPercentage: 62,
  },
  {
    id: "4",
    name: "Nexus Glide XL Extended Desk Mat",
    category: "Accessories",
    originalPrice: "$39.99",
    salePrice: "$24.99",
    discount: "-37%",
    rating: 4.7,
    soldPercentage: 91,
  },
];

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full px-8 lg:px-16 py-20 relative z-10 flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-purple-950/60 via-base-950 to-base-950 p-8 rounded-2xl border border-purple-500/30 relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold tracking-widest uppercase">
            <Zap size={16} className="text-yellow-400 animate-bounce" />
            Limited Time Offer
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Flash{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Sale Deals
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center gap-1.5 text-xs text-base-300 font-semibold mr-2">
            <Clock size={16} className="text-purple-400 animate-pulse" />
            Ends in:
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
        {FLASH_DEALS.map((deal) => (
          <div
            key={deal.id}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-purple-950/40 via-base-950 to-base-950 border border-purple-500/20 p-5 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/60 hover:shadow-[0_10px_35px_rgba(168,85,247,0.25)]"
          >
            <div className="relative w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-purple-900/30 to-base-900 border border-purple-500/20 overflow-hidden flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)]" />
              <span className="absolute top-3 left-3 bg-pink-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md shadow-lg border border-pink-400/30 animate-pulse">
                {deal.discount}
              </span>
              <ShoppingBag
                size={44}
                className="text-purple-400/60 group-hover:scale-110 group-hover:text-purple-300 transition-all duration-500"
              />
            </div>
            <div className="flex flex-col gap-2 flex-grow">
              <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider">
                {deal.category}
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                {deal.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-base-300 my-1">
                <div className="flex items-center text-yellow-400">
                  <Star size={14} className="fill-yellow-400" />
                </div>
                <span className="font-bold text-white">{deal.rating}</span>
              </div>
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex justify-between text-[10px] text-base-400 font-medium">
                  <span>Sold: {deal.soldPercentage}%</span>
                  <span>Limited Stock</span>
                </div>
                <div className="w-full h-1.5 bg-base-900 rounded-full overflow-hidden border border-purple-500/20">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                    style={{ width: `${deal.soldPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-purple-500/10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-base-500 line-through">
                  {deal.originalPrice}
                </span>
                <span className="text-lg font-black text-white text-pink-400">
                  {deal.salePrice}
                </span>
              </div>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
