"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center px-6 lg:px-12 py-20 bg-base-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full glass-panel bg-base-950/80 p-8 md:p-12 rounded-3xl border border-red-500/30 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(239,68,68,0.15)]">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] mb-6 animate-pulse">
          <AlertTriangle size={40} />
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
          {t("title")}
        </h1>

        <p className="text-sm text-base-400 mb-8 leading-relaxed max-w-md">
          {t("subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black text-sm text-white bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
          >
            <RefreshCw size={18} /> {t("tryAgain")}
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm text-white bg-base-900 border border-white/10 hover:border-white/30 hover:bg-base-800 transition-colors"
          >
            <Home size={18} /> {t("returnHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
