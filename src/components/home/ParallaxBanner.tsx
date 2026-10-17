"use client";

import Link from "next/link";
import { Hexagon, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ParallaxBanner() {
  const t = useTranslations("home.banner");

  return (
    <section
      className="relative w-full max-w-7xl mx-auto h-64 flex items-center justify-center overflow-hidden border border-primary-500/20 rounded-2xl my-8 bg-fixed bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-base-950/80 backdrop-blur-[2px]"></div>
      <div className="absolute inset-0 bg-linear-to-r from-primary-900/40 to-base-950/80"></div>
      <div className="relative z-10 flex flex-col items-center text-center gap-3 px-4 max-w-xl mx-auto">
        <Hexagon
          size={28}
          className="text-primary-500 animate-pulse"
          strokeWidth={2}
        />
        <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter drop-shadow-md">
          {t("titlePrefix")}{" "}
          <span className="text-primary-400">{t("titleHighlight")}</span>{" "}
          {t("titleSuffix")}
        </h2>
        <p className="text-base-300 text-sm leading-relaxed max-w-md">
          {t("description")}
        </p>
        <Link
          href="/register"
          className="mt-2 group relative px-6 py-3 rounded-lg font-black text-white text-sm overflow-hidden shadow-[0_0_15px_rgba(170,79,255,0.2)] transition-transform hover:scale-105"
        >
          <span className="absolute inset-0 w-full h-full bg-linear-to-r from-primary-600 to-primary-400 transition-transform duration-300"></span>
          <span className="relative z-10 flex items-center gap-2">
            {t("buttonText")}{" "}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"
            />
          </span>
        </Link>
      </div>
    </section>
  );
}
