"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Monitor,
  Gamepad,
  Star,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useTranslations } from "next-intl";
import WishlistButton from "../cart/WishlistButton";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface PlatformShowcaseProps {
  platformId: number;
  title: string;
  icon: "pc" | "playstation";
}

interface SQLGameProduct {
  ProductID: number;
  Title: string;
  Price: number | string;
  ImageUrl: string | null;
  Category: string;
  Stock: number;
  id?: number;
  name?: string;
  background_image?: string;
}

const fetchPlatformGames = async (
  platformId: number,
): Promise<SQLGameProduct[]> => {
  const res = await fetch(`/api/games/platform?id=${platformId}`);
  if (!res.ok) throw new Error("Failed to fetch platform games");
  return res.json();
};

export default function PlatformShowcase({
  platformId,
  title,
  icon,
}: PlatformShowcaseProps) {
  const addItem = useCartStore((state) => state.addItem);
  const IconComponent = icon === "playstation" ? Gamepad : Monitor;
  const t = useTranslations("home.showcase");

  const { data: games = [], isLoading } = useQuery({
    queryKey: ["platformGames", platformId],
    queryFn: () => fetchPlatformGames(platformId),
  });

  if (isLoading || games.length === 0) return null;

  return (
    <section className="relative z-10 box-border w-full min-w-0 max-w-full overflow-hidden px-6 lg:px-12">
      <div className="mb-5 flex items-end justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-linear-to-br from-primary-400 via-primary-600 to-primary-900 p-px shadow-[0_0_20px_rgba(170,79,255,0.2)]">
            <div className="flex size-full items-center justify-center rounded-xl bg-base-950">
              <IconComponent size={20} className="text-primary-400" />
            </div>
          </div>
          <h2 className="text-xl font-black tracking-tight text-base-50 md:text-2xl">
            {title}
          </h2>
        </div>
        <Link
          href={`/games?platform=${platformId}`}
          className="group hidden items-center gap-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 px-3 py-1.5 text-xs font-bold tracking-wide text-primary-300 transition-colors hover:border-primary-400/40 hover:bg-primary-500/10 hover:text-primary-200 md:flex"
        >
          {t("viewAll")}{" "}
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"
          />
        </Link>
      </div>

      <div className="relative w-full min-w-0 max-w-full overflow-hidden">
        <Swiper
          breakpointsBase="container"
          slidesPerView={2}
          spaceBetween={12}
          breakpoints={{
            480: { slidesPerView: 3, spaceBetween: 12 },
            640: { slidesPerView: 4, spaceBetween: 14 },
            820: { slidesPerView: 5, spaceBetween: 16 },
            1050: { slidesPerView: 6, spaceBetween: 16 },
          }}
          grabCursor
          watchOverflow
          className="!w-full min-w-0 max-w-full !overflow-hidden !pb-8 !pt-1"
        >
          {games.map((game: SQLGameProduct, index: number) => {
            const gameId = game.ProductID || game.id || index;
            const gameTitle = game.Title || game.name || "Unknown Game";
            const gameImage =
              game.ImageUrl ||
              game.background_image ||
              "/images/placeholder.jpg";
            const mockPrice = game.Price
              ? Number(game.Price).toFixed(2)
              : ((gameId % 40) + 19.99).toFixed(2);
            const metacritic = 85 + (gameId % 14);

            return (
              <SwiperSlide key={gameId} className="h-auto min-w-0">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-base-900/70 shadow-[0_4px_18px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/50 hover:shadow-[0_10px_28px_rgba(170,79,255,0.18)]">
                  <Link
                    href={`/games/${gameId}`}
                    className="relative block aspect-3/4 w-full shrink-0 overflow-hidden bg-base-900"
                  >
                    <WishlistButton
                      product={{
                        id: gameId,
                        title: gameTitle,
                        price: parseFloat(mockPrice),
                        image: gameImage,
                      }}
                    />
                    <Image
                      src={gameImage}
                      alt={gameTitle}
                      fill
                      sizes="(max-width: 479px) 80vw, (max-width: 767px) 42vw, (max-width: 1023px) 32vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/10 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-primary-400 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute end-2 top-2 flex items-center gap-1 rounded-full border border-white/15 bg-black/65 px-2 py-1 shadow-sm backdrop-blur-md">
                      <Star
                        size={10}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      <span className="text-[10px] font-bold text-white">
                        {metacritic}
                      </span>
                    </div>
                  </Link>
                  <div className="relative z-10 flex grow flex-col gap-2.5 bg-linear-to-b from-base-900/80 to-base-950 p-2.5">
                    <Link href={`/games/${gameId}`} className="grow">
                      <h3
                        className="line-clamp-2 text-xs font-bold leading-relaxed text-base-100 transition-colors group-hover:text-primary-300"
                        title={gameTitle}
                      >
                        {gameTitle}
                      </h3>
                    </Link>
                    <div className="mt-auto flex shrink-0 items-center justify-between gap-1 border-t border-white/10 pt-2">
                      <span className="text-xs font-black text-base-50 sm:text-sm">
                        ${mockPrice}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addItem({
                            id: gameId,
                            title: gameTitle,
                            price: parseFloat(mockPrice),
                            image: gameImage,
                          });
                        }}
                        className="whitespace-nowrap rounded-lg bg-primary-600 px-2 py-1.5 text-[10px] font-bold text-white shadow-[0_2px_10px_rgba(168,85,247,0.22)] transition-all hover:bg-primary-500 hover:shadow-[0_3px_14px_rgba(168,85,247,0.35)] sm:px-3 sm:py-2 sm:text-xs"
                      >
                        {t("addToCart")}
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
