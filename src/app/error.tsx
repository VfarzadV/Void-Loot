"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center px-6 text-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-xl glass-panel bg-base-950/80 border-rose-500/20 p-10 rounded-3xl">
        <div className="w-20 h-20 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
          <AlertTriangle size={40} className="text-rose-500" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-black text-white">System Malfunction</h2>
          <p className="text-base-400 text-sm">
            A critical error occurred while accessing the database. Our tech
            drones have been notified.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-white bg-rose-600 hover:bg-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all"
          >
            <RefreshCcw size={18} /> Reboot System
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-base-300 bg-base-900 border border-white/10 hover:text-white transition-colors"
          >
            <Home size={18} /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
