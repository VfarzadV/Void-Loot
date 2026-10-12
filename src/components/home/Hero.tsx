"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Play,
  Star,
  Calendar,
  Users,
  Gamepad2,
  User,
} from "lucide-react";

interface RawgGenre {
  name: string;
}

interface RawgGameDetailResponse {
  id: number;
  name: string;
  background_image: string;
  description_raw?: string;
  metacritic?: number | null;
  released?: string;
  genres?: RawgGenre[];
  added?: number;
}

export interface HeroGame {
  id: number;
  name: string;
  background_image: string;
  description: string;
  meta: number;
  year: string;
  genre: string;
  players: string;
}

export default function Hero({ slugs }: { slugs: string[] }) {
  const router = useRouter();
  const [games, setGames] = useState<HeroGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isLayoutHovered, setIsLayoutHovered] = useState(false);

  useEffect(() => {
    async function fetchRAWG() {
      const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
      try {
        const fetched = await Promise.all(
          slugs.map(async (slug) => {
            const res = await fetch(
              `https://api.rawg.io/api/games/${slug}?key=${apiKey}`,
            );
            if (res.ok) {
              const data: RawgGameDetailResponse = await res.json();
              return data;
            }
            return null;
          }),
        );

        const validGames: HeroGame[] = fetched
          .filter((g): g is RawgGameDetailResponse => g !== null)
          .map((data) => ({
            id: data.id,
            name: data.name,
            background_image: data.background_image || "",
            description: data.description_raw
              ? data.description_raw.length > 150
                ? data.description_raw.substring(0, 150) + "..."
                : data.description_raw
              : "Experience this masterpiece.",
            meta: data.metacritic ?? 90,
            year: data.released ? data.released.substring(0, 4) : "TBA",
            genre:
              data.genres && data.genres.length > 0
                ? data.genres[0].name
                : "Action",
            players: data.added ? (data.added / 1000).toFixed(1) + "k" : "1M+",
          }));

        setGames(validGames);
        setIsLoading(false);
      } catch (error) {
        console.error("RAWG Connection Error", error);
        setIsLoading(false);
      }
    }

    fetchRAWG();
  }, [slugs]);

  useEffect(() => {
    if (isLoading || games.length === 0 || isLayoutHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoading, games.length, isLayoutHovered]);

  if (isLoading) {
    return (
      <section className="relative w-full min-h-[75vh] flex items-center overflow-hidden px-6 lg:px-12 py-8">
        <div className="container mx-auto grid lg:grid-cols-2 gap-10 items-center relative z-10 w-full animate-pulse">
          <div className="flex flex-col items-start gap-4 p-6 lg:p-8 border-l-4 border-base-800 bg-base-900/20 backdrop-blur-md rounded-2xl w-full">
            <div className="w-32 h-6 bg-base-800/60 rounded-full"></div>
            <div className="w-full h-12 md:h-16 bg-base-800/60 rounded-xl mt-2"></div>
            <div className="w-3/4 h-12 md:h-16 bg-base-800/60 rounded-xl mb-2"></div>
            <div className="w-full h-4 bg-base-800/50 rounded"></div>
            <div className="w-5/6 h-4 bg-base-800/50 rounded"></div>
            <div className="w-2/3 h-4 bg-base-800/50 rounded"></div>
            <div className="flex gap-3 mt-6">
              <div className="w-36 h-12 bg-base-800/60 rounded-xl"></div>
              <div className="w-40 h-12 bg-base-800/60 rounded-xl"></div>
            </div>
          </div>
          <div className="flex flex-col items-center w-full mt-6 lg:mt-0 relative h-100 lg:h-125 justify-center">
            <div className="absolute w-80 h-80 rounded-full bg-primary-900/10 blur-[100px]"></div>
            <div className="w-64 lg:w-[320px] h-96 lg:h-115 bg-base-900/40 border border-white/5 rounded-2xl z-30 shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-linear-to-t from-base-950/80 to-transparent"></div>
            </div>
            <div className="absolute translate-x-28 lg:translate-x-48 -translate-y-2 rotate-12 w-48 lg:w-56 h-72 lg:h-96 bg-base-900/20 border border-white/5 rounded-2xl z-20"></div>
            <div className="absolute -translate-x-28 lg:-translate-x-48 -translate-y-2 -rotate-12 w-48 lg:w-56 h-72 lg:h-96 bg-base-900/20 border border-white/5 rounded-2xl z-10"></div>
          </div>
        </div>
      </section>
    );
  }

  if (games.length === 0) return null;

  const activeGame = games[currentIndex];

  return (
    <section className="relative w-full min-h-[75vh] flex items-center overflow-hidden px-6 lg:px-12 py-8">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden select-none">
        <h2
          key={`watermark-${activeGame.id}`}
          className="text-[120px] lg:text-[220px] font-black text-white/3 whitespace-nowrap tracking-tighter mix-blend-overlay animate-pulse"
          style={{ animationDuration: "4s" }}
        >
          {activeGame.name.toUpperCase()}
        </h2>
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 opacity-20 transition-all duration-1000 ease-out transform scale-110 filter blur-[90px]">
          <Image
            src={activeGame.background_image}
            alt="Background"
            fill
            unoptimized
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-base-950 via-base-950/80 to-base-950/90" />
        <div className="absolute inset-0 bg-linear-to-t from-base-950 via-transparent to-base-950" />
      </div>
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div
          className="absolute top-[20%] left-[10%] w-1.5 h-1.5 bg-primary-400/60 rounded-full animate-pulse blur-[1px]"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-[60%] left-[30%] w-2 h-2 bg-white/40 rounded-full animate-ping blur-[2px]"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute top-[30%] left-[60%] w-1 h-1 bg-primary-300/50 rounded-full animate-pulse blur-[1px]"
          style={{ animationDuration: "2.5s" }}
        ></div>
      </div>
      <div className="container mx-auto grid lg:grid-cols-2 gap-10 items-center relative z-10 w-full">
        <div className="flex flex-col items-start gap-4 glass-panel p-6 lg:p-8 border-l-4 border-l-primary-500/80 bg-base-900/30 backdrop-blur-xl transition-all duration-700 ease-in-out">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            RAWG Top Trending
          </div>
          <div className="min-h-24 flex flex-col justify-center">
            <h1
              key={activeGame.name}
              className="text-4xl lg:text-5xl font-black text-base-50 leading-[1.1] tracking-tight"
            >
              {activeGame.name}
            </h1>
          </div>
          <p
            key={activeGame.description}
            className="text-base-400 max-w-md leading-relaxed text-sm border-l-2 border-base-800 pl-4 mt-1 min-h-15"
          >
            {activeGame.description}
          </p>
          <div className="flex items-center gap-4 mt-1 py-2 px-1 border-y border-white/5 w-full">
            <div className="flex items-center gap-2 text-base-300">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-white">
                {activeGame.meta}
              </span>
            </div>
            <div className="w-px h-5 bg-white/10"></div>
            <div className="flex items-center gap-2 text-base-300">
              <Calendar size={16} className="text-primary-400" />
              <span className="text-sm font-bold text-white">
                {activeGame.year}
              </span>
            </div>
            <div className="w-px h-5 bg-white/10"></div>
            <div className="flex items-center gap-2 text-base-300">
              <Gamepad2 size={16} className="text-cyan-400" />
              <span className="text-sm font-bold text-white">
                {activeGame.genre}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <Link
              href={`/games/${activeGame.id}`}
              className="group flex items-center gap-3 bg-base-50 hover:bg-white text-base-950 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Explore Game{" "}
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/media"
              className="group flex items-center gap-3 bg-base-900/50 hover:bg-base-800/80 border border-base-700/50 text-base-50 px-6 py-3 rounded-xl font-bold transition-all duration-300 backdrop-blur-md"
            >
              <Play
                size={18}
                className="text-primary-400 group-hover:scale-110 transition-transform"
              />
              Watch Trailer
            </Link>
          </div>
          <div className="flex items-center gap-4 mt-2 pt-4 border-t border-base-800/50 w-full">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-base-800 border-2 border-base-950 flex items-center justify-center">
                <User size={14} className="text-base-400" />
              </div>
              <div className="w-8 h-8 rounded-full bg-base-800 border-2 border-base-950 flex items-center justify-center">
                <User size={14} className="text-base-400" />
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-600 border-2 border-base-950 flex items-center justify-center">
                <Users size={14} className="text-white" />
              </div>
            </div>
            <div className="text-sm">
              <p className="text-base-50 font-bold">
                +{activeGame.players} Players
              </p>
              <p className="text-base-400 text-xs">tracked by RAWG API</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full mt-6 lg:mt-0">
          <div
            className="relative w-full h-100 lg:h-125 flex items-center justify-center perspective-distant"
            onMouseEnter={() => setIsLayoutHovered(true)}
            onMouseLeave={() => setIsLayoutHovered(false)}
          >
            <div
              className={`absolute w-80 h-80 rounded-full transition-all duration-700 ease-out ${isLayoutHovered ? "bg-primary-500/30 blur-[150px] scale-125" : "bg-primary-600/20 blur-[120px]"}`}
            />
            {games.map((game, index) => {
              const positionIndex =
                (index - currentIndex + games.length) % games.length;
              const isHovered = hoveredCard === index;
              const sizeClass =
                positionIndex === 0
                  ? "w-64 lg:w-[320px] h-96 lg:h-[460px]"
                  : "w-48 lg:w-56 h-72 lg:h-96";
              let stateStyle = "";
              let overlayOpacity = "opacity-60";
              if (!isLayoutHovered) {
                if (positionIndex === 2)
                  stateStyle =
                    "-translate-x-16 lg:-translate-x-32 translate-y-6 -rotate-6 scale-90 blur-[2px] brightness-75 z-10";
                else if (positionIndex === 0) {
                  stateStyle =
                    "rotate-0 z-30 shadow-[0_0_40px_rgba(0,0,0,0.8)]";
                  overlayOpacity = "opacity-20";
                } else if (positionIndex === 1)
                  stateStyle =
                    "translate-x-16 lg:translate-x-32 translate-y-6 rotate-6 scale-90 blur-[2px] brightness-75 z-20";
              } else {
                if (positionIndex === 2)
                  stateStyle =
                    "-translate-x-28 lg:-translate-x-48 -translate-y-2 -rotate-12 scale-100 blur-0 brightness-90 z-10";
                else if (positionIndex === 0) {
                  stateStyle =
                    "-translate-y-4 scale-105 border-primary-400/50 shadow-[0_20px_50px_rgba(170,79,255,0.3)] brightness-90 z-30";
                  overlayOpacity = "opacity-40";
                } else if (positionIndex === 1)
                  stateStyle =
                    "translate-x-28 lg:translate-x-48 -translate-y-2 rotate-12 scale-100 blur-0 brightness-90 z-20";
              }
              if (isHovered) {
                if (positionIndex === 2)
                  stateStyle =
                    "!-translate-x-32 lg:!-translate-x-52 !-translate-y-6 !rotate-0 !scale-110 !z-50 !blur-0 !brightness-110 !border-primary-400/80 shadow-[0_20px_50px_rgba(170,79,255,0.6)]";
                else if (positionIndex === 0)
                  stateStyle =
                    "!-translate-y-8 !rotate-0 !scale-110 !z-50 !blur-0 !brightness-110 !border-primary-400/80 shadow-[0_20px_50px_rgba(170,79,255,0.6)]";
                else if (positionIndex === 1)
                  stateStyle =
                    "!translate-x-32 lg:!translate-x-52 !-translate-y-6 !rotate-0 !scale-110 !z-50 !blur-0 !brightness-110 !border-primary-400/80 shadow-[0_20px_50px_rgba(170,79,255,0.6)]";
                overlayOpacity = "!opacity-0";
              }
              return (
                <div
                  key={game.id}
                  onClick={() => {
                    if (positionIndex !== 0) {
                      setCurrentIndex(index);
                    } else {
                      router.push(`/games/${game.id}`);
                    }
                  }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`absolute cursor-pointer rounded-2xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] bg-base-950 block border-2 border-transparent ${sizeClass} ${stateStyle}`}
                >
                  <Image
                    src={game.background_image}
                    alt={game.name}
                    fill
                    unoptimized
                    priority
                    className={`object-cover transition-transform duration-700 ${isHovered || positionIndex === 0 ? "scale-105" : "scale-100"}`}
                  />
                  <div
                    className={`absolute inset-0 bg-black transition-opacity duration-500 ${overlayOpacity}`}
                  />
                  <div
                    className={`absolute bottom-0 left-0 w-full p-4 pt-14 bg-linear-to-t from-black/90 via-black/40 to-transparent transition-all duration-500 ${isLayoutHovered || isHovered || positionIndex === 0 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                  >
                    <h3 className="text-white font-bold text-base drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                      {game.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 text-base-400 font-mono text-xs z-10 mt-6 lg:mt-8">
            <span
              className={`transition-colors duration-300 ${currentIndex === 0 ? "text-primary-400 font-bold" : ""}`}
            >
              01
            </span>
            <div className="w-16 h-0.75 bg-base-800 rounded-full overflow-hidden relative cursor-pointer">
              <div
                className="absolute top-0 left-0 h-full bg-primary-500 transition-all duration-700 ease-out"
                style={{
                  width: "33.33%",
                  transform: `translateX(${currentIndex * 100}%)`,
                }}
              ></div>
            </div>
            <span
              className={`transition-colors duration-300 ${currentIndex === 2 ? "text-primary-400 font-bold" : ""}`}
            >
              03
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
