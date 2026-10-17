"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Truck,
  Search,
  PackageCheck,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface TrackingResult {
  id: string;
  status: string;
  courier: string;
  eta: string;
  destination: string;
  currentStep: number;
}

export default function TrackingPage() {
  const t = useTranslations("tracking");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setHasSearched(true);
    if (query.toUpperCase().includes("VL") || query.length > 4) {
      setResult({
        id: query.toUpperCase(),
        status: t("steps.shipping"),
        courier: "Void Express Global (Sector 7)",
        eta: "24 - 48 Hours",
        destination: "Tehran, IR (Sec-4)",
        currentStep: 3,
      });
    } else {
      setResult(null);
    }
  };

  const STEPS = [
    { title: t("steps.placed"), icon: Clock },
    { title: t("steps.verified"), icon: ShieldCheck },
    { title: t("steps.shipping"), icon: Truck },
    { title: t("steps.delivered"), icon: PackageCheck },
  ];

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-10 max-w-4xl mx-auto overflow-hidden">
      <div className="flex flex-col items-center text-center mb-12 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(170,79,255,0.2)] mb-2">
          <Truck size={32} className="text-primary-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          {t("titlePrefix")} <span className="text-primary-500">{t("titleHighlight")}</span>
        </h1>
        <p className="text-sm text-base-400 max-w-xl">
          {t("subtitle")}
        </p>
      </div>

      <form
        onSubmit={handleTrack}
        className="relative w-full max-w-2xl mx-auto mb-16 flex flex-col sm:flex-row gap-3"
      >
        <div className="relative grow group">
          <Search
            size={20}
            className="absolute inset-s-5 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors"
          />
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("inputPlaceholder")}
            className="w-full bg-base-950 border border-base-800 rounded-2xl py-4 ps-14 pe-6 text-sm text-white placeholder-base-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-4 rounded-2xl font-black text-sm text-white bg-primary-600 hover:bg-primary-500 shadow-[0_0_20px_rgba(170,79,255,0.3)] transition-all shrink-0"
        >
          {t("trackBtn")}
        </button>
      </form>

      {hasSearched && (
        <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-500">
          {result ? (
            <div className="glass-panel bg-base-950/80 border border-primary-500/30 rounded-3xl p-8 md:p-10 flex flex-col gap-10 shadow-[0_15px_40px_rgba(170,79,255,0.15)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-base-400 font-mono">
                    ID: <strong className="text-white">{result.id}</strong>
                  </span>
                  <h2 className="text-2xl font-black text-white">
                    {t("trackingDetails")}
                  </h2>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-primary-500/20 border border-primary-500/40 text-primary-300 font-bold text-xs w-fit">
                  {result.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-base-900/50 border border-white/5">
                  <Truck size={24} className="text-primary-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-base-500 uppercase tracking-wider font-bold">
                      {t("courier")}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {result.courier}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-base-900/50 border border-white/5">
                  <Clock size={24} className="text-cyan-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-base-500 uppercase tracking-wider font-bold">
                      {t("estimatedDelivery")}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {result.eta}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-base-900/50 border border-white/5">
                  <MapPin size={24} className="text-rose-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-base-500 uppercase tracking-wider font-bold">
                      {t("destination")}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {result.destination}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 pt-6">
                <div className="absolute top-1/2 inset-s-0 inset-e-0 h-1 bg-base-900 hidden md:block -translate-y-1/2 z-0" />
                {STEPS.map((step, idx) => {
                  const isCompleted = idx + 1 <= result.currentStep;
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={idx}
                      className="relative z-10 flex md:flex-col items-center gap-4 md:gap-3 w-full md:w-auto text-start md:text-center"
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                          isCompleted
                            ? "bg-primary-500 text-white border-primary-400 shadow-[0_0_20px_rgba(170,79,255,0.5)]"
                            : "bg-base-900 text-base-500 border-white/5"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 size={22} /> : <StepIcon size={20} />}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-xs font-bold ${isCompleted ? "text-white" : "text-base-500"}`}
                        >
                          {step.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="glass-panel bg-base-950/60 border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center gap-4">
              <AlertCircle size={48} className="text-rose-500 mb-2" />
              <h3 className="text-xl font-bold text-white">
                {t("notFound")}
              </h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}