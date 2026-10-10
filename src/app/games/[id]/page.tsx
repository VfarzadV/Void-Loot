import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowLeft,
  Calendar,
  Gamepad2,
  Monitor,
  Layers,
  ShoppingBag,
  Trophy,
} from "lucide-react";

interface Genre {
  id: number;
  name: string;
}

interface Screenshot {
  id: number;
  image: string;
}

interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

interface RelatedGame {
  id: number;
  name: string;
  background_image: string;
}

interface Rating {
  id: number;
  title: string;
  count: number;
  percent: number;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  image: string;
  percent: string;
}

async function getGameDetails(id: string) {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const res = await fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

async function getGameScreenshots(id: string) {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const res = await fetch(
    `https://api.rawg.io/api/games/${id}/screenshots?key=${apiKey}`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return null;
  return res.json();
}

async function getGameMovies(id: string) {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const res = await fetch(
    `https://api.rawg.io/api/games/${id}/movies?key=${apiKey}`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return null;
  return res.json();
}

async function getRelatedGames(id: string) {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const res = await fetch(
    `https://api.rawg.io/api/games/${id}/game-series?key=${apiKey}`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return null;
  return res.json();
}

async function getGameAchievements(id: string) {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const res = await fetch(
    `https://api.rawg.io/api/games/${id}/achievements?key=${apiKey}`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const game = await getGameDetails(id);

  if (!game) {
    return { title: "Game Not Found | Void Loot" };
  }

  return {
    title: `${game.name} | Void Loot Store`,
    description:
      game.description_raw?.substring(0, 160) ||
      `Buy ${game.name} on Void Loot.`,
    openGraph: {
      title: `${game.name} | Void Loot`,
      description: game.description_raw?.substring(0, 160),
      images: [game.background_image],
      type: "website",
    },
  };
}

export default async function GameDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [game, screenshotsData, moviesData, relatedData, achievementsData] =
    await Promise.all([
      getGameDetails(id),
      getGameScreenshots(id),
      getGameMovies(id),
      getRelatedGames(id),
      getGameAchievements(id),
    ]);

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-950">
        <h1 className="text-4xl font-black text-white mb-4">
          404 - Data Not Found
        </h1>
        <Link
          href="/"
          className="text-primary-400 hover:text-primary-300 flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Return to Base
        </Link>
      </div>
    );
  }

  const screenshots = screenshotsData?.results || [];
  const movies = moviesData?.results || [];
  const relatedGames = relatedData?.results || [];
  const achievements = achievementsData?.results || [];
  const mockPrice = ((game.id % 40) + 19.99).toFixed(2);
  const pcPlatform = game.platforms?.find(
    (p: Platform) => p.platform.slug === "pc",
  );
  const pcRequirements = pcPlatform?.requirements;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.name,
    description: game.description_raw,
    image: game.background_image,
    datePublished: game.released,
    genre: game.genres?.map((g: Genre) => g.name),
    aggregateRating: game.metacritic
      ? {
          "@type": "AggregateRating",
          ratingValue: game.metacritic,
          bestRating: "100",
          worstRating: "0",
        }
      : undefined,
  };

  return (
    <div className="w-full flex flex-col pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative w-full h-[65vh] min-h-137.5 flex items-end pb-16 px-6 lg:px-12 border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={game.background_image || "/images/placeholder.jpg"}
            alt={game.name}
            fill
            unoptimized
            priority
            className="object-cover opacity-40 object-top"
          />
          <div className="absolute inset-0 bg-linear-to-t from-base-950 via-base-950/60 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-base-950 via-base-950/80 to-transparent" />
        </div>
        <div className="relative z-10 w-full max-w-5xl flex flex-col gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-base-400 hover:text-white transition-colors text-sm w-fit mb-4 border border-white/10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl"
          >
            <ArrowLeft size={16} /> Back to Store
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            {game.metacritic && (
              <span
                className={`px-3 py-1 rounded-md text-xs font-bold border backdrop-blur-md ${
                  game.metacritic >= 85
                    ? "bg-green-500/20 text-green-400 border-green-500/50"
                    : game.metacritic >= 70
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                      : "bg-orange-500/20 text-orange-400 border-orange-500/50"
                }`}
              >
                Metascore: {game.metacritic}
              </span>
            )}
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-primary-900/40 text-primary-300 border border-primary-500/30 backdrop-blur-md flex items-center gap-1.5">
              <Calendar size={14} /> {game.released || "TBA"}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-xl leading-tight">
            {game.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-base-300 mt-2">
            <div className="flex items-center gap-2">
              <Gamepad2 size={16} className="text-primary-400" />
              {game.genres?.map((g: Genre) => g.name).join(", ")}
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-cyan-400" />
              {game.developers?.[0]?.name || "Unknown Developer"}
            </div>
          </div>
          {game.ratings && game.ratings.length > 0 && (
            <div className="w-full max-w-xl mt-4">
              <div className="w-full h-1.5 rounded-full overflow-hidden flex bg-base-900 border border-white/5">
                {game.ratings.map((r: Rating) => {
                  let color = "bg-gray-500";
                  if (r.title === "exceptional") color = "bg-green-500";
                  else if (r.title === "recommended") color = "bg-blue-500";
                  else if (r.title === "meh") color = "bg-orange-500";
                  else if (r.title === "skip") color = "bg-red-500";
                  return (
                    <div
                      key={r.id}
                      style={{ width: `${r.percent}%` }}
                      className={`h-full ${color}`}
                      title={`${r.title}: ${r.percent}%`}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-[10px] text-base-400 uppercase tracking-wider font-bold">
                {game.ratings.map((r: Rating) => (
                  <div key={r.id} className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        r.title === "exceptional"
                          ? "bg-green-500"
                          : r.title === "recommended"
                            ? "bg-blue-500"
                            : r.title === "meh"
                              ? "bg-orange-500"
                              : "bg-red-500"
                      }`}
                    ></span>
                    {r.title} ({r.percent}%)
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-black text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-500 rounded-full"></span>{" "}
              About the Game
            </h3>
            <div
              className="text-base-300 leading-relaxed text-sm prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: game.description || game.description_raw,
              }}
            />
          </div>
          {achievements.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-primary-500 rounded-full"></span>{" "}
                Top Achievements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.slice(0, 6).map((ach: Achievement) => (
                  <div
                    key={ach.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-base-950 border border-white/5 hover:border-primary-500/30 transition-colors"
                  >
                    {ach.image ? (
                      <Image
                        src={ach.image}
                        alt={ach.name}
                        width={48}
                        height={48}
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-base-900 flex items-center justify-center text-primary-500">
                        <Trophy size={20} />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white line-clamp-1">
                        {ach.name}
                      </span>
                      <span className="text-[10px] text-base-400 line-clamp-2 mt-0.5">
                        {ach.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {movies.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-primary-500 rounded-full"></span>{" "}
                Official Trailer
              </h3>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <video
                  src={movies[0].data.max}
                  poster={movies[0].preview}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          {pcRequirements &&
            (pcRequirements.minimum || pcRequirements.recommended) && (
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary-500 rounded-full"></span>{" "}
                  System Requirements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pcRequirements.minimum && (
                    <div className="p-5 rounded-xl bg-base-950 border border-white/5">
                      <h4 className="text-primary-400 font-bold mb-3 text-sm">
                        Minimum
                      </h4>
                      <p className="text-xs text-base-300 leading-relaxed font-mono whitespace-pre-wrap">
                        {pcRequirements.minimum.replace("Minimum:", "").trim()}
                      </p>
                    </div>
                  )}
                  {pcRequirements.recommended && (
                    <div className="p-5 rounded-xl bg-base-950 border border-white/5">
                      <h4 className="text-primary-400 font-bold mb-3 text-sm">
                        Recommended
                      </h4>
                      <p className="text-xs text-base-300 leading-relaxed font-mono whitespace-pre-wrap">
                        {pcRequirements.recommended
                          .replace("Recommended:", "")
                          .trim()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          {screenshots.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-primary-500 rounded-full"></span>{" "}
                Gallery
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {screenshots.slice(0, 4).map((shot: Screenshot) => (
                  <div
                    key={shot.id}
                    className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group"
                  >
                    <Image
                      src={shot.image}
                      alt="Gameplay screenshot"
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 bg-base-900/60 border-base-800/80 sticky top-24 flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-2 pb-6 border-b border-white/10">
              <span className="text-base-400 text-xs font-bold uppercase tracking-widest">
                Digital Download
              </span>
              <span className="text-5xl font-black text-white drop-shadow-md">
                ${mockPrice}
              </span>
            </div>

            <button className="w-full py-4 rounded-xl font-black text-white bg-linear-to-r from-primary-600 to-primary-400 hover:from-primary-500 hover:to-primary-300 shadow-[0_0_20px_rgba(170,79,255,0.3)] hover:shadow-[0_0_30px_rgba(170,79,255,0.5)] transition-all flex items-center justify-center gap-2 group">
              <ShoppingBag
                size={20}
                className="group-hover:scale-110 transition-transform"
              />{" "}
              Add to Cart
            </button>
            <div className="flex flex-col gap-3 pt-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                Available Platforms
              </h4>
              <div className="flex flex-wrap gap-2">
                {game.parent_platforms?.map((p: Platform) => (
                  <span
                    key={p.platform.id}
                    className="px-3 py-1.5 rounded-lg bg-base-950 border border-white/5 text-xs text-base-300 flex items-center gap-1.5"
                  >
                    {p.platform.slug.includes("pc") && (
                      <Monitor size={12} className="text-primary-400" />
                    )}
                    {p.platform.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {relatedGames.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 border-t border-white/5">
          <h3 className="text-2xl font-black text-white flex items-center gap-2 mb-8">
            <span className="w-1 h-6 bg-primary-500 rounded-full"></span> More
            Like This
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedGames.slice(0, 5).map((rg: RelatedGame) => (
              <Link
                href={`/games/${rg.id}`}
                key={rg.id}
                className="group flex flex-col gap-3"
              >
                <div className="relative aspect-3/4 rounded-xl overflow-hidden border border-white/10 group-hover:border-primary-500/50 transition-colors">
                  <Image
                    src={rg.background_image || "/images/placeholder.jpg"}
                    alt={rg.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-sm font-bold text-base-50 group-hover:text-primary-400 transition-colors line-clamp-1">
                  {rg.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
