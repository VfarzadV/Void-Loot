import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  ArrowLeft,
  MessageCircle,
  ThumbsUp,
  Share2,
  Award,
  Clock,
} from "lucide-react";

export default async function PostDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("communityPost");

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-8 max-w-300 mx-auto overflow-hidden">
      <Link
        href="/community"
        className="inline-flex items-center gap-2 text-base-400 hover:text-white transition-colors text-sm w-fit mb-6 bg-base-950 px-4 py-2 rounded-xl border border-white/5"
      >
        <ArrowLeft size={16} className="rtl:rotate-180" />
      </Link>

      <div className="glass-panel bg-base-950/80 rounded-3xl border border-white/5 p-6 md:p-10 mb-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary-500/50 shadow-[0_0_15px_rgba(170,79,255,0.3)]">
              <Image
                src="https://i.pravatar.cc/150?u=neon"
                alt="Author"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">
                  NeonNinja
                </span>
                <span className="text-[10px] bg-primary-500/20 text-primary-400 border border-primary-500/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {t("role")}
                </span>
              </div>
              <span className="text-xs text-base-500 flex items-center gap-1.5 font-medium">
                <Clock size={12} /> 2 hours ago
              </span>
            </div>
          </div>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-base-900 border border-white/5 text-base-300 hover:text-white transition-colors text-xs font-bold">
            <Award size={16} className="text-yellow-500" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">
            HARDWARE
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-snug">
            RTX 5090 Leaked Specs - Is it worth the upgrade?
          </h1>
          <p className="text-sm md:text-base text-base-300 leading-relaxed whitespace-pre-line my-4">
            Just saw the latest leaks regarding the power draw on the new
            50-series cards. Are we really going to need 1200W PSUs just to run
            this thing? Currently sitting on a 3080 and considering the jump,
            but the required upgrades for the rest of the rig seem insane. Has
            anyone else seen the GN video on this? Let me know your thoughts.
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {["#GPU", "#NVIDIA", "#PCBuild"].map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-primary-400 bg-primary-900/20 px-2.5 py-1 rounded-md border border-primary-500/20"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-white/5">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600/20 border border-primary-500/40 text-primary-400 text-sm font-bold hover:bg-primary-500 hover:text-white transition-all shadow-[0_0_15px_rgba(170,79,255,0.2)]">
              <ThumbsUp size={18} /> 342
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-base-900 border border-white/5 text-base-300 hover:text-white transition-colors text-sm font-bold">
              <Share2 size={18} /> {t("share")}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <MessageCircle size={20} className="text-primary-500" />{" "}
          {t("comments")}
        </h3>
        <div className="flex flex-col gap-4">
          <div className="glass-panel bg-base-950/60 rounded-2xl border border-white/5 p-4 flex gap-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10 mt-1">
              <Image
                src="https://i.pravatar.cc/150?u=user2"
                alt="Commenter"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">TechGuru22</span>
                <span className="text-[10px] text-base-500">1 hour ago</span>
              </div>
              <p className="text-sm text-base-300">
                I think it&apos;s overkill for 90% of gamers. Unless you&apos;re
                running 4K at 144Hz or doing heavy 3D rendering, the 5080 will
                probably be the sweet spot.
              </p>
              <div className="flex items-center gap-4 mt-2">
                <button className="text-[11px] font-bold text-base-500 hover:text-primary-400 transition-colors flex items-center gap-1">
                  <ThumbsUp size={12} /> 45
                </button>
                <button className="text-[11px] font-bold text-base-500 hover:text-white transition-colors">
                  {t("reply")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
