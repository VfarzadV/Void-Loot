import { Gamepad2 } from "lucide-react";

export default function GamesLoading() {
  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/5">
        <div className="flex flex-col gap-3 w-full max-w-md">
          <div className="h-10 w-64 bg-base-900/60 rounded-lg animate-pulse"></div>
          <div className="h-4 w-80 bg-base-900/40 rounded-lg animate-pulse"></div>
        </div>
        <div className="w-full md:w-80 h-11 bg-base-900/50 rounded-xl animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-xl glass-panel bg-base-950 border border-base-800/60"
          >
            <div className="w-full aspect-video bg-base-900/50 animate-pulse flex items-center justify-center">
              <Gamepad2 size={24} className="text-base-800" />
            </div>
            <div className="p-4 flex flex-col grow gap-3">
              <div className="h-5 w-3/4 bg-base-900/60 rounded animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-base-900/40 rounded-md animate-pulse"></div>
                <div className="h-5 w-20 bg-base-900/40 rounded-md animate-pulse"></div>
              </div>
              <div className="pt-3 mt-auto border-t border-base-800/50 flex justify-between">
                <div className="h-4 w-1/2 bg-base-900/40 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
