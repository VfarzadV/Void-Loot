import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Compass, Home, Gamepad2 } from "lucide-react";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center px-6 lg:px-12 py-20 bg-base-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(170,79,255,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full glass-panel bg-base-950/80 p-8 md:p-12 rounded-3xl border border-primary-500/30 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(170,79,255,0.15)]">
        <div className="relative mb-6">
          <span className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-linear-to-b from-primary-400 to-primary-700 tracking-tighter drop-shadow-[0_0_30px_rgba(170,79,255,0.4)]">
            {t("code")}
          </span>
          <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
            <Compass
              size={120}
              className="text-primary-500 animate-spin-slow"
            />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
          {t("title")}
        </h1>

        <p className="text-sm text-base-400 mb-8 leading-relaxed max-w-md">
          {t("subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black text-sm text-white bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-[0_0_20px_rgba(170,79,255,0.3)] transition-all"
          >
            <Home size={18} /> {t("returnHome")}
          </Link>

          <Link
            href="/games"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm text-white bg-base-900 border border-white/10 hover:border-primary-500/50 hover:bg-base-800 transition-colors"
          >
            <Gamepad2 size={18} className="text-primary-400" />{" "}
            {t("exploreGames")}
          </Link>
        </div>
      </div>
    </div>
  );
}
