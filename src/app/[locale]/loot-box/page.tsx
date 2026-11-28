"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { z } from "zod";
import {
  Sparkles,
  Gift,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import {
  isLootBoxRewardKey,
  LOOT_BOX_REWARDS,
  type LootBoxRewardKey,
} from "@/lib/loot-box-rewards";
import { toast } from "sonner";

const claimSchema = z.object({
  id: z.number().int().positive(),
  rewardKey: z.string().refine(isLootBoxRewardKey),
  createdAt: z.string().datetime(),
});

const historyResponseSchema = z.object({
  todayClaim: claimSchema.nullable(),
  history: z.array(claimSchema),
});

const claimResponseSchema = z.object({ claim: claimSchema });

type LootBoxClaim = {
  id: number;
  rewardKey: LootBoxRewardKey;
  createdAt: string;
};

const Loader = () => {
  const t = useTranslations("lootBox");
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      <p className="text-xs font-mono text-primary-400 tracking-widest uppercase animate-pulse">
        {t("neuralLink")}
      </p>
    </div>
  );
};

const LootBoxCanvas = dynamic(() => import("@/components/3d/LootBoxCanvas"), {
  ssr: false,
  loading: () => <Loader />,
});

export default function LootBoxPage() {
  const t = useTranslations("lootBox");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] === "fa" ? "fa" : "en";
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [todayClaim, setTodayClaim] = useState<LootBoxClaim | null>(null);
  const [history, setHistory] = useState<LootBoxClaim[]>([]);

  const POSSIBLE_REWARDS = [
    {
      key: LOOT_BOX_REWARDS[0].key,
      title: t("rewards.item1"),
      rarity: t("rewards.legendary"),
      color: "text-amber-400 border-amber-500/40 bg-amber-500/10",
      image: LOOT_BOX_REWARDS[0].image,
      value: LOOT_BOX_REWARDS[0].value,
    },
    {
      key: LOOT_BOX_REWARDS[1].key,
      title: t("rewards.item2"),
      rarity: t("rewards.epic"),
      color: "text-primary-400 border-primary-500/40 bg-primary-500/10",
      image: LOOT_BOX_REWARDS[1].image,
      value: LOOT_BOX_REWARDS[1].value,
    },
    {
      key: LOOT_BOX_REWARDS[2].key,
      title: t("rewards.item3"),
      rarity: t("rewards.rare"),
      color: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
      image: LOOT_BOX_REWARDS[2].image,
      value: LOOT_BOX_REWARDS[2].value,
    },
  ];

  const [reward, setReward] = useState<LootBoxClaim | null>(null);
  const displayedReward = reward
    ? POSSIBLE_REWARDS.find((item) => item.key === reward.rewardKey)
    : null;

  useEffect(() => {
    let isCurrent = true;

    const loadHistory = async () => {
      try {
        const response = await fetch("/api/loot-box");
        if (response.status === 401) {
          if (isCurrent) setAuthRequired(true);
          return;
        }
        if (!response.ok) throw new Error("LOOT_BOX_HISTORY_FAILED");

        const parsed = historyResponseSchema.safeParse(await response.json());
        if (!parsed.success) throw new Error("INVALID_LOOT_BOX_HISTORY");
        if (!isCurrent) return;

        setTodayClaim(parsed.data.todayClaim);
        setReward(parsed.data.todayClaim);
        setHistory(parsed.data.history);
        setAuthRequired(false);
      } catch (error) {
        console.error("Load loot box history error:", error);
        toast.error(t("historyLoadFailed"));
      } finally {
        if (isCurrent) setIsLoadingHistory(false);
      }
    };

    void loadHistory();
    return () => {
      isCurrent = false;
    };
  }, [t]);

  const handleOpenBox = async () => {
    if (isUnlocking || todayClaim || isLoadingHistory || authRequired) return;
    setIsUnlocking(true);
    toast.info(t("extractingToast"));
    try {
      const response = await fetch("/api/loot-box", { method: "POST" });
      const body: unknown = await response.json();

      if (response.status === 401) {
        setAuthRequired(true);
        toast.error(t("loginRequired"));
        return;
      }

      if (response.status === 409) {
        const parsed = claimResponseSchema.safeParse(body);
        if (!parsed.success) throw new Error("INVALID_DAILY_CLAIM");
        setTodayClaim(parsed.data.claim);
        setReward(parsed.data.claim);
        setHistory((current) => [
          parsed.data.claim,
          ...current.filter((claim) => claim.id !== parsed.data.claim.id),
        ]);
        toast.info(t("dailyLimit"));
        return;
      }

      if (!response.ok) throw new Error("LOOT_BOX_FAILED");
      const parsed = claimResponseSchema.safeParse(body);
      if (!parsed.success) throw new Error("INVALID_LOOT_BOX_REWARD");

      const claim = parsed.data.claim;
      setTodayClaim(claim);
      setHistory((current) => [claim, ...current]);
      await new Promise<void>((resolve) => setTimeout(resolve, 3500));
      setReward(claim);
      toast.success(t("decryptCompleteToast"));
    } catch (error) {
      console.error("Open loot box request error:", error);
      toast.error(t("drawFailed"));
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div
      className={`relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden px-6 lg:px-12 py-8 transition-colors duration-1000 ${isUnlocking ? "bg-red-950/20" : "bg-base-950"}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[60px_60px] opacity-40 pointer-events-none z-0" />
      <div
        className={`absolute top-1/4 inset-s-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full blur-[150px] pointer-events-none transition-colors duration-1000 z-0 ${isUnlocking ? "bg-red-600/20" : "bg-primary-600/15"}`}
      />
      <div className="absolute bottom-10 inset-s-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-4 max-w-7xl mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-400 hover:text-white transition-colors bg-base-950/80 px-4 py-2.5 rounded-xl border border-white/5 backdrop-blur-md"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" /> {t("exitChamber")}
        </Link>
        <div
          className={`flex items-center gap-2 text-[11px] font-mono font-bold px-4 py-2 rounded-lg border backdrop-blur-md transition-colors ${isUnlocking ? "text-red-400 bg-red-500/10 border-red-500/30" : "text-primary-400 bg-primary-500/10 border-primary-500/30"}`}
        >
          <Cpu size={14} className={isUnlocking ? "animate-pulse" : ""} />
          {isUnlocking ? t("systemOverride") : t("interactiveRelic")}
        </div>
      </div>

      <div
        className={`relative z-10 w-full h-[60vh] min-h-112.5 my-auto flex items-center justify-center transition-transform duration-75 ${isUnlocking ? "animate-[shake_0.5s_ease-in-out_infinite]" : ""}`}
      >
        <LootBoxCanvas isUnlocking={isUnlocking} onBoxClick={handleOpenBox} />
        {!todayClaim && !isUnlocking && !authRequired && (
          <div className="absolute bottom-6 inset-s-1/2 -translate-x-1/2 rtl:translate-x-1/2 pointer-events-none text-center animate-in slide-in-from-bottom-4 duration-1000">
            <span className="text-[11px] font-mono uppercase tracking-widest text-base-400 bg-base-950/90 px-6 py-2.5 rounded-full border border-white/10 backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              {t("dragInstruction")}
            </span>
          </div>
        )}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto w-full flex flex-col items-center text-center">
        {!displayedReward ? (
          <div className="flex flex-col items-center gap-4 glass-panel bg-base-950/50 p-8 rounded-3xl border border-white/5 backdrop-blur-md w-full">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
              {t("titlePrefix")}{" "}
              <span
                className={isUnlocking ? "text-red-500" : "text-primary-400"}
              >
                {t("titleHighlight")}
              </span>{" "}
              {t("titleSuffix")}
            </h1>
            <p className="text-xs md:text-sm text-base-400 max-w-lg">
              {t("subtitle")}
            </p>
            <p className="text-xs text-amber-300">{t("demoNotice")}</p>
            <button
              onClick={handleOpenBox}
              disabled={
                isUnlocking ||
                Boolean(todayClaim) ||
                isLoadingHistory ||
                authRequired
              }
              className={`mt-4 flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-sm text-white shadow-xl transition-all disabled:opacity-80 disabled:cursor-not-allowed ${
                isUnlocking
                  ? "bg-red-600 shadow-[0_0_40px_rgba(239,68,68,0.5)] scale-95"
                  : "bg-linear-to-r from-primary-600 via-primary-500 to-cyan-500 hover:from-primary-500 hover:to-cyan-400 shadow-[0_0_30px_rgba(170,79,255,0.4)] hover:shadow-[0_0_50px_rgba(0,229,255,0.5)] hover:-translate-y-1"
              }`}
            >
              {isUnlocking ? (
                <>
                  <Sparkles size={20} className="animate-spin" />{" "}
                  {t("decrypting")}
                </>
              ) : (
                <>
                  <Gift size={20} />{" "}
                  {todayClaim
                    ? t("dailyLimit")
                    : isLoadingHistory
                      ? t("loadingHistory")
                      : t("decryptBtn")}
                </>
              )}
            </button>
            {authRequired && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-base-300">{t("loginRequired")}</p>
                <Link
                  href={`/${locale}/login?redirect=/${locale}/loot-box`}
                  className="text-sm font-bold text-primary-400 hover:text-primary-300"
                >
                  {t("loginAction")}
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel bg-base-950/95 border-2 border-primary-500/50 p-6 md:p-8 rounded-3xl w-full flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_20px_60px_rgba(170,79,255,0.3)] animate-in zoom-in-95 duration-500">
            <div className="flex items-center gap-5 text-start w-full">
              <div className="w-16 h-16 rounded-2xl bg-primary-500/20 border border-primary-500/40 flex items-center justify-center text-primary-400 shrink-0 shadow-[0_0_20px_rgba(170,79,255,0.4)]">
                <CheckCircle2 size={32} />
              </div>
              <div className="flex flex-col gap-1.5">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md border w-fit ${displayedReward.color}`}
                >
                  {displayedReward.rarity} {t("dropBadge")}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white">
                  {displayedReward.title}
                </h3>
                <p className="text-xs text-amber-300">{t("demoNotice")}</p>
                <span className="text-xs text-base-400 font-mono">
                  {t("marketValue")}{" "}
                  <strong className="text-emerald-400 text-sm">
                    {displayedReward.value}
                  </strong>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 mt-4 sm:mt-0">
              <button
                type="button"
                onClick={() => setReward(null)}
                className="p-4 rounded-xl bg-base-900 border border-white/10 text-base-400 hover:text-white hover:bg-base-800 transition-colors"
                title={t("resetRelic")}
              >
                <RotateCcw size={20} />
              </button>
              <div className="grow flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle2 size={18} /> {t("savedToHistory")}
              </div>
            </div>
          </div>
        )}
      </div>

      <section className="relative z-10 max-w-7xl mx-auto w-full mt-10">
        <h2 className="text-lg font-black text-white mb-4">{t("historyTitle")}</h2>
        {history.length === 0 ? (
          <p className="text-sm text-base-400">{t("emptyHistory")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((claim) => {
              const claimReward = POSSIBLE_REWARDS.find(
                (item) => item.key === claim.rewardKey,
              );
              if (!claimReward) return null;

              return (
                <article
                  key={claim.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-base-900/70 p-4"
                >
                  <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={claimReward.image}
                      alt={claimReward.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white">
                      {claimReward.title}
                    </p>
                    <p className="text-xs text-primary-300">
                      {claimReward.rarity}
                    </p>
                    <time
                      dateTime={claim.createdAt}
                      className="text-xs text-base-500"
                    >
                      {new Date(claim.createdAt).toLocaleDateString(locale)}
                    </time>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px) rotate(-1deg); }
          50% { transform: translateX(4px) rotate(1deg); }
          75% { transform: translateX(-4px) rotate(-1deg); }
        }
      `,
        }}
      />
    </div>
  );
}
