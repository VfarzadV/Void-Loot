import Image from "next/image";
import Link from "next/link";
import { Flame, Clock, Tag, ArrowRight, Star } from "lucide-react";

interface DealProduct {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  rating: number;
  thumbnail: string;
}

async function getDeals() {
  try {
    const res = await fetch(
      "https://dummyjson.com/products?limit=12&sortBy=discountPercentage&order=desc",
      {
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products;
  } catch (error) {
    return [];
  }
}

export default async function DealsPage() {
  const deals = await getDeals();

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-8 max-w-[1600px] mx-auto overflow-hidden">
      <div className="relative w-full h-[40vh] min-h-87.5 rounded-3xl overflow-hidden mb-12 flex items-center p-8 md:p-12 border border-primary-500/20">
        <div className="absolute inset-0 bg-linear-to-r from-primary-950/80 via-base-950 to-base-950 z-0"></div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="relative z-10 flex flex-col gap-4 max-w-xl">
          <div className="flex items-center gap-2 text-primary-400 text-xs font-bold tracking-widest uppercase">
            <Flame size={16} className="animate-pulse" /> Limited Time Offers
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Cyber{" "}
            <span className="text-primary-500 drop-shadow-[0_0_15px_rgba(170,79,255,0.5)]">
              Deals
            </span>
          </h1>
          <p className="text-sm text-base-300">
            Save up to 80% on premium gaming gear, laptops, and digital keys.
            These deals will vanish into the void soon.
          </p>
          <div className="flex items-center gap-4 mt-4 bg-black/40 backdrop-blur-md border border-primary-500/30 w-fit px-4 py-2.5 rounded-xl">
            <Clock size={18} className="text-primary-500 animate-pulse" />
            <div className="text-white font-mono font-bold text-lg flex items-center gap-2">
              <span>
                12
                <span className="text-xs text-base-400 font-sans ml-1">h</span>
              </span>{" "}
              :
              <span>
                45
                <span className="text-xs text-base-400 font-sans ml-1">m</span>
              </span>{" "}
              :
              <span className="text-primary-400">
                30
                <span className="text-xs text-primary-400/50 font-sans ml-1">
                  s
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Tag size={24} className="text-primary-500" /> Active Promotions
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {deals.map((deal: DealProduct) => {
          const salePrice = (
            deal.price -
            (deal.price * deal.discountPercentage) / 100
          ).toFixed(2);
          return (
            <div
              key={deal.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl glass-panel bg-base-950 border border-base-800/60 transition-all duration-500 hover:-translate-y-2 hover:border-primary-500/50 hover:shadow-[0_10px_30px_rgba(170,79,255,0.15)]"
            >
              <div className="relative w-full aspect-4/3 bg-white/5 flex items-center justify-center p-6 overflow-hidden">
                <span className="absolute top-3 left-3 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-[0_0_15px_rgba(170,79,255,0.5)] z-10 animate-bounce">
                  -{Math.round(deal.discountPercentage)}%
                </span>
                <Image
                  src={deal.thumbnail}
                  alt={deal.title}
                  fill
                  unoptimized
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 relative z-0"
                />
              </div>
              <div className="p-5 flex flex-col grow gap-2 border-t border-base-800/50">
                <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-primary-400 transition-colors">
                  {deal.title}
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-white font-bold">{deal.rating}</span>
                </div>
                <div className="flex items-end justify-between mt-auto pt-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-base-500 line-through">
                      ${deal.price}
                    </span>
                    <span className="text-xl font-black text-primary-400">
                      ${salePrice}
                    </span>
                  </div>
                  <Link
                    href={`/shop/${deal.id}`}
                    aria-label={`View ${deal.title}`}
                    className="w-10 h-10 rounded-xl bg-base-900 border border-white/10 flex items-center justify-center text-base-300 hover:text-white hover:bg-primary-600 hover:border-primary-500 transition-all"
                  >
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
