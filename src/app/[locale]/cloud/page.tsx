import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Cloud, Gamepad2 } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function CloudGamingPage() {
  const [t, locale, games] = await Promise.all([
    getTranslations("cloud"),
    getLocale(),
    prisma.products.findMany({
      where: { Category: "games" },
      orderBy: { Title: "asc" },
      take: 100,
      select: {
        ProductID: true,
        Title: true,
        Price: true,
        ImageUrl: true,
      },
    }),
  ]);
  const currency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="w-full flex flex-col gap-10 pb-20 px-6 lg:px-12 pt-8 max-w-[1600px] mx-auto overflow-hidden">
      <header className="flex flex-col gap-5 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary-500/10 border border-primary-500/30 text-primary-400 shadow-[0_0_20px_rgba(170,79,255,0.2)]">
            <Cloud size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              <span className="text-primary-400">{t("title")}</span>
            </h1>
            <p className="mt-1 text-xs text-base-400 font-bold tracking-widest uppercase">
              {t("subtitle")}
            </p>
          </div>
        </div>
        <p
          role="status"
          className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-amber-200"
        >
          {t("catalogOnly")}
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary-500 rounded-full" />
            {t("cloudLibrary")}
          </h2>
          <span className="rounded-lg bg-base-900 border border-white/5 px-3 py-1 text-xs font-bold text-base-300">
            {games.length}
          </span>
        </div>

        {games.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-base-950/60 p-10 text-center text-base-400">
            {t("catalogEmpty")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game) => (
              <article
                key={game.ProductID}
                className="group relative flex flex-col overflow-hidden rounded-2xl glass-panel bg-base-950 border border-base-800/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/50"
              >
                <div className="relative w-full aspect-video overflow-hidden bg-base-900">
                  <Image
                    src={game.ImageUrl || "/images/placeholder.svg"}
                    alt={game.Title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex grow flex-col gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold text-white line-clamp-2">
                      {game.Title}
                    </h3>
                    <Gamepad2
                      size={18}
                      className="mt-0.5 shrink-0 text-primary-400"
                    />
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/5 pt-4">
                    <span className="text-sm font-black text-primary-300">
                      {currency.format(Number(game.Price.toString()))}
                    </span>
                    <Link
                      href={`/games/${game.ProductID}`}
                      className="rounded-lg border border-primary-500/30 bg-primary-500/10 px-3 py-2 text-xs font-bold text-primary-300 hover:bg-primary-500/20"
                    >
                      {t("viewGame")}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
