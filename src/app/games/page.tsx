import Image from "next/image";
import Link from "next/link";
import Form from "next/form";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Gamepad2,
  Monitor,
} from "lucide-react";

interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

interface RawgGame {
  id: number;
  name: string;
  background_image: string;
  metacritic: number | null;
  released: string;
  genres: { name: string }[];
  parent_platforms: Platform[];
}

async function getGames(page: number, search: string) {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  let url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&page_size=20`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.search || "";

  const data = await getGames(currentPage, searchQuery);
  const games: RawgGame[] = data?.results || [];
  const hasNextPage = data?.next !== null;
  const hasPrevPage = data?.previous !== null;

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/5">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            The <span className="text-primary-400">Void</span> Archive
          </h1>
          <p className="text-sm text-base-400">
            {searchQuery
              ? `Showing results for "${searchQuery}"`
              : "Explore thousands of games powered by RAWG database."}
          </p>
        </div>
        <Form action="/games" aria-label="Search games" className="relative w-full md:w-80 group">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors"
          />
          <input
            type="text"
            aria-label="Search games"
            name="search"
            defaultValue={searchQuery}
            placeholder="Search games..."
            className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-base-500 focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
          />
          {searchQuery && (
            <Link
              href="/games"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-base-500 hover:text-white"
            >
              Clear
            </Link>
          )}
        </Form>
      </div>
      {games.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center text-center">
          <Gamepad2 size={48} className="text-base-800 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Games Found</h3>
          <p className="text-base-400 text-sm">
            Try adjusting your search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {games.map((game) => (
            <Link
              href={`/games/${game.id}`}
              key={game.id}
              className="group relative flex flex-col overflow-hidden rounded-xl glass-panel bg-base-950 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(170,79,255,0.15)] border border-base-800/60 hover:border-primary-500/50"
            >
              <div className="relative w-full aspect-video overflow-hidden bg-base-900">
                <Image
                  src={game.background_image || "/images/placeholder.jpg"}
                  alt={game.name}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-base-950 via-transparent to-transparent opacity-90" />
                {game.metacritic && (
                  <div
                    className={`absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-md font-bold text-xs backdrop-blur-md border ${
                      game.metacritic >= 90
                        ? "bg-green-500/20 text-green-400 border-green-500/50"
                        : game.metacritic >= 75
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                          : "bg-orange-500/20 text-orange-400 border-orange-500/50"
                    }`}
                  >
                    {game.metacritic}
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col grow gap-3">
                <div className="grow">
                  <h3 className="text-base font-bold text-base-50 mb-1.5 line-clamp-1 group-hover:text-primary-300 transition-colors">
                    {game.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-base-400 font-medium">
                    {game.released && (
                      <span className="flex items-center gap-1 bg-base-900 px-2 py-1 rounded-md border border-white/5">
                        <Calendar size={12} className="text-primary-400" />
                        {game.released.substring(0, 4)}
                      </span>
                    )}
                    {game.genres?.[0] && (
                      <span className="flex items-center gap-1 bg-base-900 px-2 py-1 rounded-md border border-white/5">
                        <Gamepad2 size={12} className="text-cyan-400" />
                        {game.genres[0].name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="pt-3 border-t border-base-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-base-400">
                    {game.parent_platforms?.some((p) =>
                      p.platform.slug.includes("pc"),
                    ) && <Monitor size={14} />}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-base-500 truncate max-w-37.5">
                      {game.parent_platforms
                        ?.slice(0, 3)
                        .map((p) => p.platform.name)
                        .join(", ")}
                      {(game.parent_platforms?.length || 0) > 3 ? " +" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="w-full flex items-center justify-center gap-4 mt-12 pt-8 border-t border-white/5">
        {hasPrevPage ? (
          <Link
            href={`/games?page=${currentPage - 1}${searchQuery ? `&search=${searchQuery}` : ""}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-base-900 text-white font-bold text-sm border border-white/10 hover:border-primary-500 hover:text-primary-400 transition-colors"
          >
            <ChevronLeft size={18} /> Previous
          </Link>
        ) : (
          <button
            disabled
            aria-label="Previous page (unavailable)"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-base-950 text-base-600 font-bold text-sm border border-white/5 cursor-not-allowed"
          >
            <ChevronLeft size={18} /> Previous
          </button>
        )}
        <div className="px-4 py-2 rounded-lg bg-primary-900/20 border border-primary-500/30 text-primary-400 font-bold text-sm">
        <span aria-current="page">Page {currentPage}</span>
        </div>
        {hasNextPage ? (
          <Link
            href={`/games?page=${currentPage + 1}${searchQuery ? `&search=${searchQuery}` : ""}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-base-900 text-white font-bold text-sm border border-white/10 hover:border-primary-500 hover:text-primary-400 transition-colors"
          >
            Next <ChevronRight size={18} />
          </Link>
        ) : (
          <button
            disabled
            aria-label="Next page (unavailable)"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-base-950 text-base-600 font-bold text-sm border border-white/5 cursor-not-allowed"
          >
            Next <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
