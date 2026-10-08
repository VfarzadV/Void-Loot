"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const BRANDS = [
  { name: "HyperX", image: "/images/HyperX.jpg" },
  { name: "ROG", image: "/images/ROG.png" },
  { name: "Razer", image: "/images/RAZER.png" },
  { name: "Logitech", image: "/images/LOGITECH.png" },
  { name: "SteelSeries", image: "/images/steelseries.png" },
  { name: "COOLERMASTER", image: "/images/COOLERMASTER.png" },
  { name: "OMEN", image: "/images/omen.png" },
  { name: "ADRUS", image: "/images/ADRUS.png" },
  { name: "Xbox", image: "/images/Xbox.jpg" },
  { name: "PlayStation", image: "/images/PlayStation.webp" },
];

export default function BrandsRow() {
  return (
    <section className="w-full px-8 lg:px-16 relative z-10">
      <div className="flex items-end justify-between mb-8 border-b border-white/5 pb-3">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Shop by <span className="text-primary-400">Brand</span>
        </h2>
        <Link
          href="/brands"
          className="hidden md:flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-xs font-bold tracking-wider uppercase transition-colors group"
        >
          View All{" "}
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
      <div className="flex overflow-x-auto hide-scrollbar gap-6 md:justify-between items-center py-4">
        {BRANDS.map((brand, idx) => (
          <Link
            key={idx}
            href={`/shop/brand/${brand.name.toLowerCase().replace(" ", "-")}`}
            className="flex flex-col items-center gap-4 group min-w-25"
          >
            <div className="relative w-24 h-24 rounded-full bg-base-950 border-2 border-primary-500/30 flex items-center justify-center transition-all duration-500 group-hover:border-primary-500 group-hover:shadow-[0_0_25px_rgba(170,79,255,0.4)] group-hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                unoptimized
                className="object-cover z-10 group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <span className="text-xs font-bold text-base-300 uppercase tracking-widest group-hover:text-white transition-colors">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
