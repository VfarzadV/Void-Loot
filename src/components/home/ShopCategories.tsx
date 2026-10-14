"use client";

import Link from "next/link";
import {
  ArrowRight,
  Gamepad2,
  Cpu,
  Headphones,
  Keyboard,
  Armchair,
} from "lucide-react";

export default function ShopCategories() {
  return (
    <section className="w-full px-6 lg:px-12  relative z-10 flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary-400 text-xs font-bold tracking-widest uppercase">
            <span className="w-8 h-0.5 bg-primary-500 rounded-full"></span>
            Nexus Hardware & Gear
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-base-50 tracking-tight">
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-primary-600">
              Store Categories
            </span>
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden md:flex items-center gap-2 text-base-300 hover:text-white font-semibold transition-colors group text-sm"
        >
          View All Products{" "}
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          href="/shop/playstation"
          className="group relative overflow-hidden rounded-2xl bg-linear-to-r from-purple-950 via-purple-900/50 to-base-950 border border-purple-500/30 p-8 flex items-center justify-between min-h-55 transition-all duration-500 hover:border-purple-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]"
        >
          <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col gap-3">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">
              Next-Gen Console
            </span>
            <h3 className="text-3xl lg:text-4xl font-black text-white drop-shadow-md">
              PlayStation Consoles
            </h3>
            <p className="text-xs text-base-300 max-w-55">
              Experience exclusive titles in stunning 4K with ultra-high frame
              rates.
            </p>
          </div>
          <div className="relative z-10 w-24 h-24 flex items-center justify-center">
            <div className="w-16 h-20 bg-linear-to-b from-purple-600/40 to-indigo-950/80 rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.4)] flex items-center justify-center text-white font-bold text-xs border border-purple-400/40 backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
              <Gamepad2 size={32} className="text-purple-300" />
            </div>
          </div>
        </Link>
        <Link
          href="/shop/xbox"
          className="group relative overflow-hidden rounded-2xl bg-linear-to-r from-purple-950 via-purple-900/50 to-base-950 border border-purple-500/30 p-8 flex items-center justify-between min-h-55 transition-all duration-500 hover:border-purple-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]"
        >
          <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col gap-3">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">
              Ultimate Power
            </span>
            <h3 className="text-3xl lg:text-4xl font-black text-white drop-shadow-md">
              Xbox Consoles
            </h3>
            <p className="text-xs text-base-300 max-w-55">
              The world&apos;s most powerful hardware built for peak gaming
              performance.
            </p>
          </div>
          <div className="relative z-10 w-24 h-24 flex items-center justify-center">
            <div className="w-20 h-16 bg-linear-to-b from-purple-600/40 to-indigo-950/80 rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.4)] flex items-center justify-center text-white font-bold text-xs border border-purple-400/40 backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
              <Gamepad2 size={32} className="text-purple-300" />
            </div>
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Gaming Rigs & Cases",
            desc: "Custom Rigs & Powerhouses",
            href: "/shop/cases",
            icon: Cpu,
          },
          {
            title: "Mechanical Keyboards",
            desc: "Mechanical & RGB",
            href: "/shop/keyboards",
            icon: Keyboard,
          },
          {
            title: "Gaming Headsets",
            desc: "Immersive Surround Audio",
            href: "/shop/headsets",
            icon: Headphones,
          },
          {
            title: "Gaming Chairs",
            desc: "Ergonomic & Pro Comfort",
            href: "/shop/chairs",
            icon: Armchair,
          },
        ].map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <Link
              href={item.href}
              key={idx}
              className="group relative overflow-hidden rounded-2xl bg-linear-to-b from-purple-950/70 via-base-950 to-base-950 border border-purple-500/20 p-6 flex flex-col justify-between h-70 transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/60 hover:shadow-[0_10px_35px_rgba(168,85,247,0.2)]"
            >
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/15 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  NEXUS GEAR
                </span>
                <ArrowRight
                  size={16}
                  className="text-purple-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                />
              </div>
              <div className="relative z-10 flex flex-col items-center text-center my-auto py-2">
                <div className="w-16 h-16 rounded-2xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-4 group-hover:scale-110 group-hover:bg-purple-600/30 group-hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.25)] backdrop-blur-md">
                  <IconComponent size={28} strokeWidth={1.5} />
                </div>
                <h4 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-base-400">{item.desc}</p>
              </div>
              <div className="relative z-10 pt-4 border-t border-purple-500/10 flex items-center justify-between text-xs text-purple-300 font-semibold">
                <span>Explore Products</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
