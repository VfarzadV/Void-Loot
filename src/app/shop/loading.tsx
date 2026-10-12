import { Monitor } from "lucide-react";

export default function ShopLoading() {
  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/5">
        <div className="flex flex-col gap-3 w-full max-w-md">
          <div className="h-10 w-72 bg-base-900/60 rounded-lg animate-pulse"></div>
          <div className="h-4 w-96 max-w-full bg-base-900/40 rounded-lg animate-pulse"></div>
        </div>
        <div className="w-full md:w-80 h-11 bg-base-900/50 rounded-xl animate-pulse"></div>
      </div>
      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
          <div className="h-6 w-32 bg-base-900/60 rounded animate-pulse"></div>
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-full bg-base-900/40 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        </aside>
        <div className="grow flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="h-5 w-32 bg-base-900/40 rounded animate-pulse"></div>
            <div className="h-9 w-40 bg-base-900/40 rounded-lg animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl glass-panel bg-base-950 border border-base-800/60"
              >
                <div className="w-full aspect-4/3 bg-base-900/30 animate-pulse flex items-center justify-center p-6">
                  <Monitor size={48} className="text-base-800/50" />
                </div>
                <div className="p-5 flex flex-col gap-3 border-t border-base-800/50">
                  <div className="h-3 w-20 bg-base-900/40 rounded animate-pulse"></div>
                  <div className="h-5 w-full bg-base-900/60 rounded animate-pulse"></div>
                  <div className="h-4 w-12 bg-base-900/40 rounded animate-pulse"></div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <div className="h-7 w-20 bg-base-900/60 rounded animate-pulse"></div>
                    <div className="h-10 w-10 bg-base-900/60 rounded-xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
