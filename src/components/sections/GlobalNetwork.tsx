"use client";

import { useTranslations } from "next-intl";
import { Globe, Server, Activity, Zap, ShieldCheck } from "lucide-react";

interface RegionNode {
  city: string;
  country: string;
  ping: string;
  load: number;
  status: "optimal" | "stable";
}

const REGIONS: RegionNode[] = [
  { city: "Frankfurt", country: "Germany", ping: "12ms", load: 42, status: "optimal" },
  { city: "Tokyo", country: "Japan", ping: "24ms", load: 58, status: "optimal" },
  { city: "New York", country: "USA", ping: "18ms", load: 65, status: "stable" },
  { city: "London", country: "UK", ping: "15ms", load: 38, status: "optimal" },
  { city: "Singapore", country: "Singapore", ping: "28ms", load: 72, status: "stable" },
  { city: "Sydney", country: "Australia", ping: "35ms", load: 45, status: "optimal" },
];

export default function GlobalNetwork() {
  const t = useTranslations("globalNetwork");

  return (
    <div className="w-full flex flex-col gap-10 py-12 px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(170,79,255,0.2)] mb-2">
          <Globe size={32} className="text-primary-400 animate-spin-slow" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          {t("titlePrefix")} <span className="text-primary-500">{t("titleHighlight")}</span>
        </h2>
        <p className="text-sm text-base-400 leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel bg-base-950/60 p-6 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center border border-primary-500/20">
            <Server size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white">1,420+</span>
            <span className="text-xs font-bold text-base-500 uppercase tracking-wider">
              {t("activeNodes")}
            </span>
          </div>
        </div>

        <div className="glass-panel bg-base-950/60 p-6 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Zap size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white">14ms</span>
            <span className="text-xs font-bold text-base-500 uppercase tracking-wider">
              {t("globalLatency")}
            </span>
          </div>
        </div>

        <div className="glass-panel bg-base-950/60 p-6 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <Activity size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white">12.8 Tbps</span>
            <span className="text-xs font-bold text-base-500 uppercase tracking-wider">
              {t("bandwidth")}
            </span>
          </div>
        </div>

        <div className="glass-panel bg-base-950/60 p-6 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <ShieldCheck size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-emerald-400 flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {t("operational")}
            </span>
            <span className="text-xs font-bold text-base-500 uppercase tracking-wider mt-0.5">
              {t("status")}
            </span>
          </div>
        </div>
      </div>

      <div className="glass-panel bg-base-950/60 p-8 rounded-3xl border border-white/5 flex flex-col gap-6">
        <h3 className="text-xl font-black text-white flex items-center gap-2 border-b border-white/5 pb-4">
          <Globe size={20} className="text-primary-500" /> {t("regionsTitle")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REGIONS.map((region, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-2xl bg-base-900/40 border border-white/5 hover:border-primary-500/30 transition-colors"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-white">
                  {region.city}
                </span>
                <span className="text-xs text-base-400">{region.country}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-mono font-bold text-primary-400">
                    {region.ping}
                  </span>
                  <span className="text-[10px] text-base-500 font-mono">
                    {region.load}% {t("load")}
                  </span>
                </div>
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    region.status === "optimal"
                      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}