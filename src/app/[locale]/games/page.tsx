import Image from "next/image";
import Link from "next/link";
import Form from "next/form";
import { Search, Calendar, Gamepad2, Monitor, Star } from "lucide-react";
import WishlistButton from "@/components/cart/WishlistButton";
import AddToCartButton from "@/components/cart/AddToCartButton";
import Pagination from "@/components/shared/Pagination";
import GameSortDropdown from "@/components/games/GameSortDropdown";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

interface GameProduct {
  id: number;
  title: string;
  price: number;
  image: string;
  stock: number;
}

interface GameWhereClause {
  Category: string;
  Title?: { contains: string };
}

async function getGames(
  page: number,
  search: string,
  sort: string,
): Promise<{ results: GameProduct[]; count: number }> {
  const ITEMS_PER_PAGE = 20;

  const whereClause: GameWhereClause = {
    Category: "games",
  };

  if (search) {
    whereClause.Title = { contains: search };
  }

  let orderBy: Record<string, "asc" | "desc"> = { ProductID: "desc" };

  if (sort === "name") {
    orderBy = { Title: "asc" };
  } else if (sort === "-released" || sort === "-rating") {
    orderBy = { ProductID: "desc" };
  }

  const [totalCount, sqlGames] = await Promise.all([
    prisma.products.count({ where: whereClause }),
    prisma.products.findMany({
      where: whereClause,
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
  ]);

  return {
    count: totalCount,
    results: sqlGames.map((g) => ({
      id: g.ProductID,
      title: g.Title,
      price: Number(g.Price?.toString() || 0),
      image: g.ImageUrl || "/images/placeholder.jpg",
      stock: g.Stock || 0,
    })),
  };
}

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.search || "";
  const currentSort = params.sort || "";

  const t = await getTranslations("games");

  const data = await getGames(currentPage, searchQuery, currentSort);
  const games = data.results;

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-white/5">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {t("titlePrefix")}{" "}
            <span className="text-primary-400">{t("titleHighlight")}</span>{" "}
            {t("titleSuffix")}
          </h1>
          <p className="text-sm text-base-400">
            {searchQuery
              ? t("subtitleSearch", { query: searchQuery })
              : t("subtitleDefault")}
          </p>
        </div>

        <Form
          action="/games"
          aria-label="Search games"
          className="relative w-full md:w-80 group"
        >
          {currentSort && (
            <input type="hidden" name="sort" value={currentSort} />
          )}

          <Search
            size={18}
            className="absolute inset-s-4 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors"
          />
          <input
            type="text"
            aria-label="Search games"
            name="search"
            defaultValue={searchQuery}
            placeholder={t("searchPlaceholder")}
            className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 ps-11 pe-4 text-sm text-white placeholder-base-500 focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
          />

          {searchQuery && (
            <Link
              href={`/games${currentSort ? `?sort=${currentSort}` : ""}`}
              className="absolute inset-e-4 top-1/2 -translate-y-1/2 text-xs text-base-500 hover:text-white"
            >
              {t("clear")}
            </Link>
          )}
        </Form>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <p className="text-sm text-base-400 font-medium">
          {t("found")}{" "}
          <strong className="text-white">{data.count.toLocaleString()}</strong>{" "}
          {t("gamesCount")}
        </p>
        <GameSortDropdown />
      </div>

      {games.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center text-center">
          <Gamepad2 size={48} className="text-base-800 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            {t("noGamesTitle")}
          </h3>
          <p className="text-base-400 text-sm">{t("noGamesDesc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {games.map((game) => {
            const metacriticMock = 85 + (game.id % 12);

            return (
              <div
                key={game.id}
                className="group relative flex flex-col overflow-hidden rounded-xl glass-panel bg-base-950 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(170,79,255,0.15)] border border-base-800/60 hover:border-primary-500/50"
              >
                <Link
                  href={`/games/${game.id}`}
                  className="relative w-full aspect-video overflow-hidden bg-base-900 block"
                >
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-base-950 via-transparent to-transparent opacity-90" />

                  <div
                    className={`absolute top-3 inset-s-3 flex items-center justify-center w-8 h-8 rounded-md font-bold text-xs backdrop-blur-md border ${
                      metacriticMock >= 90
                        ? "bg-green-500/20 text-green-400 border-green-500/50"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                    }`}
                  >
                    {metacriticMock}
                  </div>

                  <div className="absolute top-3 right-3 z-20">
                    <WishlistButton
                      product={{
                        id: game.id,
                        title: game.title,
                        price: game.price,
                        image: game.image,
                      }}
                    />
                  </div>
                </Link>

                <div className="p-4 flex flex-col grow gap-3">
                  <div className="grow">
                    <Link href={`/games/${game.id}`}>
                      <h3 className="text-base font-bold text-base-50 mb-1.5 line-clamp-1 group-hover:text-primary-300 transition-colors">
                        {game.title}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-base-400 font-medium">
                      <span className="flex items-center gap-1 bg-base-900 px-2 py-1 rounded-md border border-white/5">
                        <Gamepad2 size={12} className="text-cyan-400" />
                        Digital Key
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-base-800/50 flex items-center justify-between">
                    <span className="text-lg font-black text-white">
                      ${game.price.toFixed(2)}
                    </span>
                    <AddToCartButton
                      product={{
                        id: game.id,
                        title: game.title,
                        price: game.price,
                        image: game.image,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {data.count > 20 && <Pagination pageCount={Math.ceil(data.count / 20)} />}
    </div>
  );
}
