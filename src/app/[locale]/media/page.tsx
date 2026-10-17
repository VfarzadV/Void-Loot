import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Play, Info, Clock, MonitorPlay, Flame, LucideIcon } from "lucide-react";

interface VideoItem {
  id: number;
  title: string;
  duration: string;
  views: string;
  image: string;
}

const FEATURED_VIDEO = {
  image:
    "https://media.rawg.io/media/games/26d/26d4437715bee60138cb4a44dbe8bf2f.jpg",
  duration: "3:42",
};

const TRENDING_TRAILERS = [
  {
    id: 1,
    title: "Grand Theft Auto VI - Trailer 1",
    duration: "1:30",
    views: "152M",
    image:
      "https://media.rawg.io/media/games/960/960b601d9541cec776c5fa42a00bf6c4.jpg",
  },
  {
    id: 2,
    title: "Death Stranding 2: On The Beach",
    duration: "9:40",
    views: "4.2M",
    image:
      "https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg",
  },
  {
    id: 3,
    title: "Ghost of Yōtei - Reveal Trailer",
    duration: "3:15",
    views: "8.1M",
    image:
      "https://media.rawg.io/media/games/51c/51c430f1795400bb0837130df93dc063.jpg",
  },
  {
    id: 4,
    title: "Marvel's Wolverine - Teaser",
    duration: "0:53",
    views: "22M",
    image:
      "https://media.rawg.io/media/games/d8f/d8f3b28fc747ed6f929ecfd8ad3d0a23.jpg",
  },
];

const DOCUMENTARIES = [
  {
    id: 5,
    title: "Raising Kratos - The Making of God of War",
    duration: "1:54:45",
    views: "12M",
    image:
      "https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg",
  },
  {
    id: 6,
    title: "Grounded: The Making of The Last of Us",
    duration: "1:25:10",
    views: "5.5M",
    image:
      "https://media.rawg.io/media/games/713/713269608dc8f2f40f5a670a14b2de94.jpg",
  },
  {
    id: 7,
    title: "The Story of Red Dead Redemption 2",
    duration: "45:20",
    views: "8.9M",
    image:
      "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg",
  },
  {
    id: 8,
    title: "DOOM - Behind the Music",
    duration: "24:15",
    views: "3.2M",
    image:
      "https://media.rawg.io/media/games/c4b/c4b0cab189e73432de3a250d8cf1c84e.jpg",
  },
];

const VideoRow = ({
  title,
  icon: Icon,
  videos,
  viewsLabel,
}: {
  title: string;
  icon: LucideIcon;
  videos: VideoItem[];
  viewsLabel: string;
}) => (
  <div className="flex flex-col gap-5 w-full">
    <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
      <Icon size={24} className="text-primary-500" /> {title}
    </h3>
    <div className="flex overflow-x-auto gap-4 pb-6 hide-scrollbar snap-x">
      {videos.map((video) => (
        <Link
          href={`/media/watch/${video.id}`}
          key={video.id}
          className="group relative shrink-0 w-72 sm:w-80 rounded-2xl overflow-hidden bg-base-950 border border-white/5 hover:border-primary-500/50 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(170,79,255,0.2)] snap-start"
        >
          <div className="relative w-full aspect-video">
            <Image
              src={video.image}
              alt={video.title}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-90">
              <div className="w-12 h-12 rounded-full bg-primary-600/90 text-white flex items-center justify-center backdrop-blur-md shadow-[0_0_20px_rgba(170,79,255,0.5)]">
                <Play size={20} className="ms-1 rtl:rotate-180" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-2 inset-e-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
              <Clock size={10} /> {video.duration}
            </div>
          </div>
          <div className="p-4 flex flex-col gap-1 bg-linear-to-b from-base-900 to-base-950 h-full">
            <h4
              className="text-sm font-bold text-base-50 line-clamp-1 group-hover:text-primary-300 transition-colors"
              title={video.title}
            >
              {video.title}
            </h4>
            <span className="text-[10px] text-base-400 font-medium">
              {video.views} {viewsLabel}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default async function MediaPage() {
  const t = await getTranslations("media");

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-6 max-w-[1600px] mx-auto overflow-hidden">
      <div className="flex items-center gap-3 mb-8">
        <MonitorPlay size={28} className="text-primary-500" />
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          {t("titlePrefix")}<span className="text-primary-400">{t("titleHighlight")}</span>
        </h1>
      </div>

      <section className="relative w-full h-[55vh] min-h-112.5 rounded-3xl overflow-hidden mb-12 border border-white/10 group">
        <Image
          src={FEATURED_VIDEO.image}
          alt={t("featured.title")}
          fill
          unoptimized
          priority
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-base-950 via-base-950/80 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-base-950 via-transparent to-transparent" />
        <div className="absolute bottom-0 inset-s-0 p-8 md:p-12 z-10 flex flex-col gap-4 max-w-2xl w-full">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md bg-primary-600 text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_15px_rgba(170,79,255,0.5)] animate-pulse">
              {t("premiere")}
            </span>
            <span className="text-xs font-bold text-primary-300">
              {t("featured.category")}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
            {t("featured.title")}
          </h2>
          <p className="text-sm text-base-300 line-clamp-3 leading-relaxed max-w-xl">
            {t("featured.description")}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <button type="button" className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-black text-sm hover:bg-base-200 transition-colors shadow-lg">
              <Play size={18} fill="currentColor" className="rtl:rotate-180" /> {t("playNow")}
            </button>
            <button type="button" className="flex items-center gap-2 bg-base-900/60 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-sm hover:bg-base-800 transition-colors">
              <Info size={18} /> {t("moreInfo")}
            </button>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-10">
        <VideoRow
          title={t("trendingTrailers")}
          icon={Flame}
          videos={TRENDING_TRAILERS}
          viewsLabel={t("views")}
        />
        <VideoRow
          title={t("originalDocumentaries")}
          icon={MonitorPlay}
          videos={DOCUMENTARIES}
          viewsLabel={t("views")}
        />
      </div>
    </div>
  );
}