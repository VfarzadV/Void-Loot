import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Game {
  id: number;
  name: string;
  background_image: string;
}

export default function Hero({ featuredGames }: { featuredGames: Game[] }) {
  return (
    <section className="relative w-full min-h-[calc(100vh-100px)] flex items-center overflow-hidden px-8 lg:px-16">
      <div className="absolute inset-0 opacity-[0.07] bg-[url('/images/topography.svg')] bg-cover bg-center pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-base-950/0 via-base-950/50 to-base-950 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-primary-800/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
        <div className="flex flex-col items-start gap-6 glass-panel p-8 lg:p-12 border-l-4 border-l-primary-500/80 bg-base-900/20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            Trending Now
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-base-50 leading-[1.1] tracking-tight">
            Discover the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-600 drop-shadow-[0_2px_15px_rgba(170,79,255,0.4)]">
              Next Level
            </span>{" "}
            <br />
            of Gaming
          </h1>
          <p className="text-base-400 max-w-md leading-relaxed text-sm border-l-2 border-base-800 pl-4">
            بهترین و جدیدترین عناوین دنیای بازی را کشف کنید. پلتفرمی ساخته شده
            برای گیمرهای حرفه‌ای با پشتیبانی از تمامی پلتفرم‌ها.
          </p>
          <Link
            href="/shop"
            className="mt-4 group/btn flex items-center gap-3 bg-base-50 hover:bg-white text-base-950 px-8 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            ورود به فروشگاه
            <ChevronRight
              size={18}
              className="group-hover/btn:translate-x-1 transition-transform"
            />
          </Link>
        </div>
        <div className="relative w-full h-[400px] lg:h-[600px] flex items-center justify-center group/layout perspective-[1200px]">
          <div className="absolute w-[350px] h-[350px] bg-primary-600/20 blur-[100px] rounded-full group-hover/layout:blur-[130px] group-hover/layout:scale-110 transition-all duration-700 ease-out" />

          {featuredGames.map((game, index) => {
            let cardStyle = "";

            let layoutHover = "";
            const specificHover =
              " hover:!scale-110 hover:!z-50 hover:!rotate-0 hover:!-translate-y-8 hover:!brightness-110 hover:!blur-0 hover:!opacity-100 hover:border-primary-400/80 hover:shadow-[0_20px_50px_rgba(170,79,255,0.6)] cursor-pointer ";

            if (index === 0) {
              layoutHover =
                " group-hover/layout:-translate-x-44 group-hover/layout:-translate-y-2 group-hover/layout:-rotate-12 group-hover/layout:scale-100 group-hover/layout:opacity-100 group-hover/layout:blur-0 group-hover/layout:brightness-90 ";
              cardStyle =
                "w-48 h-72 -translate-x-12 translate-y-6 -rotate-6 scale-90 opacity-50 blur-[2px] brightness-75 z-10 border-2 border-transparent ";
            } else if (index === 1) {
              layoutHover =
                " group-hover/layout:-translate-y-6 group-hover/layout:scale-105 group-hover/layout:border-primary-400/80 group-hover/layout:shadow-[0_20px_50px_rgba(170,79,255,0.4)] group-hover/layout:brightness-90 ";
              cardStyle =
                "w-64 h-[400px] rotate-0 z-30 border-2 border-base-700/50 shadow-[0_0_30px_rgba(0,0,0,0.8)] brightness-90 ";
            } else if (index === 2) {
              layoutHover =
                " group-hover/layout:translate-x-44 group-hover/layout:-translate-y-2 group-hover/layout:rotate-12 group-hover/layout:scale-100 group-hover/layout:opacity-100 group-hover/layout:blur-0 group-hover/layout:brightness-90 ";
              cardStyle =
                "w-48 h-72 translate-x-12 translate-y-6 rotate-6 scale-90 opacity-50 blur-[2px] brightness-75 z-20 border-2 border-transparent ";
            }

            return (
              <Link
                href={`/games/${game.id}`}
                key={game.id}
                className={`absolute rounded-2xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] bg-base-950 block group/card ${cardStyle} ${layoutHover} ${specificHover}`}
              >
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                />
                <div className="absolute inset-0 bg-black transition-opacity duration-500 opacity-60 group-hover/layout:opacity-30 group-hover/card:!opacity-0" />
                <div className="absolute bottom-0 left-0 w-full p-6 pt-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-4 opacity-0 group-hover/layout:translate-y-0 group-hover/layout:opacity-100 transition-all duration-500 delay-100">
                  <h3 className="text-white font-bold text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                    {game.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
