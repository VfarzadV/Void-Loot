"use client";
import Link from "next/link";
import { ShoppingCart, Search, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full h-20 px-6 lg:px-12 flex items-center justify-between z-40 sticky top-0 bg-base-950/80 backdrop-blur-xl border-b border-white/5">
      <Link
        href="/"
        className="text-2xl font-black tracking-tighter text-base-50 flex items-center gap-1 group"
      >
        Void
        <span className="text-primary-500 drop-shadow-[0_0_10px_rgba(170,79,255,0.5)] group-hover:text-primary-400 transition-colors">
          Loot
        </span>
      </Link>
      <div className="flex items-center gap-4 sm:gap-6">
        <button className="text-base-400 hover:text-white transition-colors hidden sm:block">
          <Search size={20} />
        </button>
        <button className="text-base-400 hover:text-white transition-colors hidden sm:block">
          <Bell size={20} />
        </button>
        <div className="w-px h-5 bg-white/10 hidden sm:block"></div>
        <button className="relative text-base-400 hover:text-white transition-colors group">
          <ShoppingCart
            size={22}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="absolute -top-1.5 -right-2 bg-primary-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(170,79,255,0.5)]">
            0
          </span>
        </button>
        <div className="w-px h-5 bg-white/10"></div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-bold text-base-300 hover:text-white transition-colors hidden sm:block"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="relative group px-4 py-2 rounded-xl font-bold text-sm text-white overflow-hidden shadow-[0_0_15px_rgba(170,79,255,0.2)] hover:shadow-[0_0_25px_rgba(170,79,255,0.4)] transition-shadow"
          >
            <span className="absolute inset-0 w-full h-full bg-linear-to-r from-primary-600 to-primary-400 group-hover:scale-105 transition-transform duration-300"></span>
            <span className="relative z-10">Sign Up</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
