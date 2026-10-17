"use client";

import { Rocket, ShieldCheck, LockKeyhole, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl"; 

export default function StoreFeatures() {
  const t = useTranslations("home.storeFeatures"); 

  const FEATURES = [
    {
      id: 1,
      title: t("fastDelivery.title"),
      desc: t("fastDelivery.desc"),
      icon: Rocket,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      glow: "shadow-[0_0_30px_rgba(96,165,250,0.3)]",
      border: "group-hover:border-blue-500/50",
      cardShadow: "group-hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)]",
      bgGlow: "bg-blue-500/30",
    },
    {
      id: 2,
      title: t("secureCheckout.title"),
      desc: t("secureCheckout.desc"),
      icon: LockKeyhole,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      glow: "shadow-[0_0_30px_rgba(52,211,153,0.3)]",
      border: "group-hover:border-emerald-500/50",
      cardShadow: "group-hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.3)]",
      bgGlow: "bg-emerald-500/30",
    },
    {
      id: 3,
      title: t("returns.title"),
      desc: t("returns.desc"),
      icon: RefreshCcw,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]",
      border: "group-hover:border-purple-500/50",
      cardShadow: "group-hover:shadow-[0_10px_40px_-10px_rgba(168,85,247,0.3)]",
      bgGlow: "bg-purple-500/30",
    },
    {
      id: 4,
      title: t("authenticity.title"),
      desc: t("authenticity.desc"),
      icon: ShieldCheck,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      glow: "shadow-[0_0_30px_rgba(251,113,133,0.3)]",
      border: "group-hover:border-rose-500/50",
      cardShadow: "group-hover:shadow-[0_10px_40px_-10px_rgba(225,29,72,0.3)]",
      bgGlow: "bg-rose-500/30",
    },
  ];

  return (
    <section className="w-full px-8 lg:px-16 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              className={`group relative flex flex-col items-center text-center p-8 rounded-3xl bg-base-950 border border-base-800/60 transition-all duration-500 hover:-translate-y-2 ${feature.border} ${feature.cardShadow} overflow-hidden`}
            >
              <div
                className={`absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full ${feature.bgGlow} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0`}
              />
              <div
                className={`relative z-10 w-20 h-20 rounded-full ${feature.bg} flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl ${feature.glow}`}
              >
                <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent rounded-full opacity-50" />
                <Icon
                  size={32}
                  className={`${feature.color} relative z-10 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110`}
                  strokeWidth={1.5}
                />
              </div>
              <div className="relative z-10 flex flex-col items-center mt-2">
                <h3 className="text-sm font-black text-base-50 uppercase tracking-wide mb-2 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-base-400 font-medium group-hover:text-base-300 transition-colors leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
