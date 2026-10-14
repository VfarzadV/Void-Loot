import Image from "next/image";
import Link from "next/link";
import {
  Cloud,
  Wifi,
  Server,
  Gamepad2,
  Monitor,
  Cpu,
  Play,
  Clock,
  Activity,
  Zap,
  Radio,
} from "lucide-react";

interface CloudGame {
  id: number;
  title: string;
  thumbnail: string;
  playtime?: string;
  progress?: number;
  resolution: string;
}

const RECENTLY_PLAYED: CloudGame[] = [
  {
    id: 1,
    title: "Cyberpunk 2077",
    thumbnail:
      "https://media.rawg.io/media/games/26d/26d4437715bee60138cb4a44dbe8bf2f.jpg",
    playtime: "45h 12m",
    progress: 68,
    resolution: "4K HDR",
  },
  {
    id: 2,
    title: "Ghost of Tsushima",
    thumbnail:
      "https://media.rawg.io/media/games/51c/51c430f1795400bb0837130df93dc063.jpg",
    playtime: "12h 30m",
    progress: 24,
    resolution: "1440p",
  },
];

const CLOUD_LIBRARY: CloudGame[] = [
  {
    id: 3,
    title: "Red Dead Redemption 2",
    thumbnail:
      "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg",
    resolution: "4K",
  },
  {
    id: 4,
    title: "Elden Ring",
    thumbnail:
      "https://media.rawg.io/media/games/174/1743b3dd185bda4a7be349347d4064df.jpg",
    resolution: "4K HDR",
  },
  {
    id: 5,
    title: "Forza Horizon 5",
    thumbnail:
      "https://media.rawg.io/media/games/082/082365507ff04d456c700157072d35db.jpg",
    resolution: "4K 120FPS",
  },
  {
    id: 6,
    title: "Marvel's Spider-Man",
    thumbnail:
      "https://media.rawg.io/media/games/9aa/9aa42d16d425fa6f179fc9dc2f763647.jpg",
    resolution: "1440p",
  },
  {
    id: 7,
    title: "God of War",
    thumbnail:
      "https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg",
    resolution: "4K",
  },
  {
    id: 8,
    title: "Control",
    thumbnail:
      "https://media.rawg.io/media/games/253/2534a46f3da7fa7c315f1387515ca3f3.jpg",
    resolution: "4K RTX On",
  },
  {
    id: 9,
    title: "Hogwarts Legacy",
    thumbnail:
      "https://media.rawg.io/media/games/59a/59a3ebcba3d08c51532c6ca877aff256.jpg",
    resolution: "1440p",
  },
  {
    id: 10,
    title: "Alan Wake 2",
    thumbnail:
      "https://media.rawg.io/media/games/5b9/5b963d7633cd640fa2ddce039eb64522.jpg",
    resolution: "4K HDR",
  },
];

export default function CloudGamingPage() {
  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-8 max-w-[1600px] mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary-500/10 border border-primary-500/30 text-primary-400 shadow-[0_0_20px_rgba(170,79,255,0.2)]">
            <Cloud size={32} />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Void
              <span className="text-primary-400 drop-shadow-[0_0_15px_rgba(170,79,255,0.5)]">
                Cloud
              </span>
            </h1>
            <p className="text-xs text-base-400 font-bold tracking-widest uppercase">
              Enterprise-Grade Gaming Servers
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-base-900/40 border border-white/5 backdrop-blur-md px-4 py-2.5 rounded-xl">
            <Server size={16} className="text-base-400" />
            <span className="text-xs font-bold text-white tracking-wider">
              EU-CENTRAL-01
            </span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Wifi size={16} className="text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 tracking-wider">
              PING: 12ms
            </span>
          </div>
        </div>
      </div>
      <div className="w-full grid lg:grid-cols-3 gap-6 mb-16">
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl glass-panel bg-base-950/80 p-8 md:p-10 flex flex-col justify-between min-h-85 border border-primary-500/20 hover:border-primary-500/40 transition-colors">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(170,79,255,0.15)_0%,transparent_60%)] pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                </span>
                <span className="text-primary-400 text-[10px] font-black uppercase tracking-widest">
                  Active Cloud Rig
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-md">
                NVIDIA RTX 4080
              </h2>
              <p className="text-sm text-base-400 font-medium max-w-sm leading-relaxed mt-1">
                Your dedicated instance is running optimally. Seamlessly stream
                AAA titles with ultra-low latency.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-base-900/50 backdrop-blur-md p-2 rounded-2xl border border-white/5 shrink-0">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-base-950 border border-white/5 text-base-300">
                <Monitor size={18} />
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary-600/20 border border-primary-500/30 text-primary-400 shadow-[0_0_10px_rgba(170,79,255,0.2)]">
                <Gamepad2 size={18} />
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-base-950 border border-white/5 text-base-300">
                <Radio size={18} />
              </div>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            <div className="flex flex-col gap-1.5 glass-panel bg-base-950/40 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5 text-[10px] text-base-400 uppercase tracking-wider font-bold">
                <Monitor size={12} /> Target Res
              </div>
              <span className="text-sm font-black text-white">4K UHD HDR</span>
            </div>
            <div className="flex flex-col gap-1.5 glass-panel bg-base-950/40 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5 text-[10px] text-base-400 uppercase tracking-wider font-bold">
                <Zap size={12} /> Target FPS
              </div>
              <span className="text-sm font-black text-white">120 FPS</span>
            </div>
            <div className="flex flex-col gap-1.5 glass-panel bg-base-950/40 p-4 rounded-2xl border border-primary-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-primary-500/5" />
              <div className="flex items-center gap-1.5 text-[10px] text-primary-300 uppercase tracking-wider font-bold relative z-10">
                <Cpu size={12} /> Ray Tracing
              </div>
              <span className="text-sm font-black text-primary-400 relative z-10 drop-shadow-[0_0_8px_rgba(170,79,255,0.8)]">
                Enabled (DLSS 3)
              </span>
            </div>
            <div className="flex flex-col gap-1.5 glass-panel bg-base-950/40 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5 text-[10px] text-base-400 uppercase tracking-wider font-bold">
                <Clock size={12} /> Session Limit
              </div>
              <span className="text-sm font-black text-emerald-400">
                Unlimited
              </span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Activity size={18} className="text-primary-500" /> Resume Playing
            </h3>
            <Link
              href="#"
              className="text-[10px] font-bold text-primary-400 uppercase tracking-wider hover:text-primary-300"
            >
              View All
            </Link>
          </div>
          <div className="flex flex-col gap-4 h-full">
            {RECENTLY_PLAYED.map((game) => (
              <div
                key={game.id}
                className="group relative flex items-center gap-4 glass-panel bg-base-950/60 p-3 rounded-2xl overflow-hidden hover:border-primary-500/40 hover:shadow-[0_8px_25px_rgba(170,79,255,0.15)] transition-all cursor-pointer flex-1"
              >
                <div className="relative w-24 h-full min-h-21.25 rounded-xl overflow-hidden shrink-0 border border-white/5">
                  <Image
                    src={game.thumbnail}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center shadow-[0_0_15px_rgba(170,79,255,0.6)]">
                      <Play
                        size={14}
                        className="text-white ml-0.5"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col grow pr-2">
                  <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-primary-400 transition-colors">
                    {game.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-base-400 font-bold mt-1.5 mb-2.5">
                    <span className="flex items-center gap-1.5">
                      <Clock size={10} className="text-primary-500" />{" "}
                      {game.playtime}
                    </span>
                    <span className="px-1.5 py-0.5 bg-base-900 rounded-md text-base-300 border border-white/5">
                      {game.resolution}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-base-900/80 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-linear-to-r from-primary-600 to-primary-400 rounded-full shadow-[0_0_10px_rgba(170,79,255,0.5)]"
                      style={{ width: `${game.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
            Cloud Library
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-base-900 border border-white/5 text-xs font-bold text-white">
              All Games
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-bold text-base-400 hover:text-white cursor-pointer transition-colors">
              Ready to Play
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CLOUD_LIBRARY.map((game) => (
            <div
              key={game.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl glass-panel bg-base-950 transition-all duration-500 hover:-translate-y-2 border border-base-800/80 hover:border-primary-500/50 hover:shadow-[0_15px_40px_rgba(170,79,255,0.2)]"
            >
              <div className="relative w-full aspect-video overflow-hidden bg-base-900">
                <Image
                  src={game.thumbnail}
                  alt={game.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-linear-to-t from-base-950 via-base-950/20 to-transparent" />
                <div className="absolute top-3 left-3 bg-base-950/80 backdrop-blur-md border border-primary-500/30 text-primary-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-[0_0_10px_rgba(170,79,255,0.2)] flex items-center gap-1.5">
                  <Cloud size={10} /> Cloud Ready
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 scale-90 group-hover:scale-100 transform bg-black/30 backdrop-blur-sm">
                  <button type="button" aria-label={`Stream ${game.title} now`} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-black text-sm shadow-[0_0_30px_rgba(170,79,255,0.6)] hover:bg-primary-500 hover:scale-105 transition-all">
                    <Play size={16} fill="currentColor" /> Stream Now
                  </button>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3 relative z-10 bg-base-950">
                <h4 className="text-base font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1">
                  {game.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-bold text-base-400 uppercase tracking-wider pt-3 border-t border-white/5">
                  <span className="px-2 py-1 rounded-md bg-base-900 border border-white/5">
                    {game.resolution}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-base-900 border border-white/5 flex items-center gap-1">
                    <Gamepad2 size={12} className="text-primary-500" />{" "}
                    Controller
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
