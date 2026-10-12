export default function GameDetailsLoading() {
  return (
    <div className="w-full flex flex-col pb-20">
      <section className="relative w-full h-[65vh] min-h-137.5 flex items-end pb-16 px-6 lg:px-12 border-b border-white/10 bg-base-900/30 animate-pulse">
        <div className="relative z-10 w-full max-w-5xl flex flex-col gap-4">
          <div className="w-28 h-8 bg-base-900/60 rounded-xl mb-4"></div>
          <div className="flex gap-3 mb-2">
            <div className="w-24 h-6 bg-base-900/60 rounded-md"></div>
            <div className="w-32 h-6 bg-base-900/60 rounded-md"></div>
          </div>
          <div className="w-3/4 h-16 md:h-24 bg-base-900/60 rounded-2xl"></div>
          <div className="flex gap-4 mt-2">
            <div className="w-40 h-5 bg-base-900/60 rounded-md"></div>
            <div className="w-32 h-5 bg-base-900/60 rounded-md"></div>
          </div>
        </div>
      </section>
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <div className="w-48 h-8 bg-base-900/50 rounded-lg animate-pulse mb-2"></div>
            <div className="flex flex-col gap-3">
              <div className="w-full h-4 bg-base-900/40 rounded animate-pulse"></div>
              <div className="w-full h-4 bg-base-900/40 rounded animate-pulse"></div>
              <div className="w-11/12 h-4 bg-base-900/40 rounded animate-pulse"></div>
              <div className="w-4/5 h-4 bg-base-900/40 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-32 h-8 bg-base-900/50 rounded-lg animate-pulse mb-2"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full aspect-video bg-base-900/40 rounded-xl animate-pulse"></div>
              <div className="w-full aspect-video bg-base-900/40 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 bg-base-900/40 border-base-800/50 sticky top-24 flex flex-col gap-6 animate-pulse">
            <div className="flex flex-col items-center text-center gap-2 pb-6 border-b border-white/10">
              <div className="w-24 h-4 bg-base-900/60 rounded"></div>
              <div className="w-32 h-12 bg-base-900/60 rounded-xl mt-2"></div>
            </div>
            <div className="w-full h-14 bg-base-900/60 rounded-xl"></div>
            <div className="flex flex-col gap-3 pt-2">
              <div className="w-32 h-4 bg-base-900/60 rounded"></div>
              <div className="flex flex-wrap gap-2">
                <div className="w-16 h-8 bg-base-900/60 rounded-lg"></div>
                <div className="w-24 h-8 bg-base-900/60 rounded-lg"></div>
                <div className="w-20 h-8 bg-base-900/60 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
