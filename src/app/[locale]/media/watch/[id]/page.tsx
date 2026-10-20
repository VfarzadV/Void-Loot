import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, Play, Clock, Share2, Heart, Info } from "lucide-react";

export default async function WatchVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("mediaWatch");

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-8 max-w-[1600px] mx-auto overflow-hidden">
      <Link
        href="/media"
        className="inline-flex items-center gap-2 text-base-400 hover:text-white transition-colors text-sm w-fit mb-6 bg-base-950 px-4 py-2 rounded-xl border border-white/5"
      >
        <ArrowLeft size={16} className="rtl:rotate-180" />
      </Link>

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-center group">
          <div className="absolute inset-0 bg-base-950/80 bg-[url('https://media.rawg.io/media/games/26d/26d4437715bee60138cb4a44dbe8bf2f.jpg')] bg-cover bg-center mix-blend-overlay opacity-60"></div>
          <div className="w-20 h-20 rounded-full bg-primary-600/90 text-white flex items-center justify-center backdrop-blur-md shadow-[0_0_40px_rgba(170,79,255,0.6)] cursor-pointer hover:scale-110 transition-transform z-10">
            <Play size={36} className="ms-2" fill="currentColor" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="px-3 py-1 rounded-md bg-primary-600/20 border border-primary-500/40 text-primary-400 text-[10px] font-black uppercase tracking-widest w-fit">
                Cinematic Trailer
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                Cyberpunk 2077: Phantom Liberty
              </h1>
              <div className="flex items-center gap-3 text-xs text-base-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-primary-500" />
                  3:42
                </span>
                <span className="w-1 h-1 rounded-full bg-base-700"></span>
                <span>152M {t("views")}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-base-900 border border-white/5 text-base-300 hover:text-rose-400 hover:border-rose-500/30 transition-colors text-xs font-bold">
                <Heart size={16} /> {t("like")}
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-base-900 border border-white/5 text-base-300 hover:text-white hover:border-white/20 transition-colors text-xs font-bold">
                <Share2 size={16} /> {t("share")}
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-base-950 border border-white/5 flex flex-col gap-3 mt-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Info size={16} className="text-primary-400" /> {t("descTitle")}
            </h3>
            <p className="text-sm text-base-300 leading-relaxed max-w-4xl">
              Return to Night City and embark on a high-stakes mission of
              espionage and intrigue to save the NUSA President. In this
              spy-thriller expansion, build alliances and make choices that will
              shatter the world around you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
