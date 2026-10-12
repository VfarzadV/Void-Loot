import Link from "next/link";
import { Hexagon, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl">
        <Hexagon
          size={64}
          className="text-primary-500 animate-pulse"
          strokeWidth={1.5}
        />
        <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-base-50 to-base-600 drop-shadow-lg">
          404
        </h1>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest">
            Signal Lost in the <span className="text-primary-400">Void</span>
          </h2>
          <p className="text-base-400 text-sm md:text-base">
            The page, game, or hardware you are looking for has been moved,
            deleted, or never existed in this timeline.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-white bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-[0_0_20px_rgba(170,79,255,0.3)] transition-all"
          >
            <Home size={18} /> Return to Base
          </Link>
          <Link
            href="/games"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-base-300 bg-base-900 border border-white/10 hover:text-white hover:border-primary-500 transition-colors"
          >
            <Search size={18} /> Browse Archive
          </Link>
        </div>
      </div>
    </div>
  );
}
