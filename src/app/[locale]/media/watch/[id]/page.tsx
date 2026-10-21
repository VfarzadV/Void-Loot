import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, Play, Clock, Share2, Heart, Info } from "lucide-react";

const ALL_VIDEOS = [
  {
    id: 1,
    title: "Grand Theft Auto VI - Trailer 1",
    duration: "1:30",
    views: "152M",
    image:
      "https://media.rawg.io/media/games/960/960b601d9541cec776c5fa42a00bf6c4.jpg",
    desc: "Experience the next evolution of open-world gaming in the state of Leonida.",
    category: "Official Trailer",
  },
  {
    id: 2,
    title: "Death Stranding 2: On The Beach",
    duration: "9:40",
    views: "4.2M",
    image:
      "https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg",
    desc: "Should we have connected? Sam returns for a new journey beyond the chiral network.",
    category: "Extended Trailer",
  },
  {
    id: 3,
    title: "Ghost of Yōtei - Reveal Trailer",
    duration: "3:15",
    views: "8.1M",
    image:
      "https://media.rawg.io/media/games/51c/51c430f1795400bb0837130df93dc063.jpg",
    desc: "Embark on a new adventure set in 1603 around Mount Yōtei.",
    category: "Reveal Trailer",
  },
  {
    id: 4,
    title: "Marvel's Wolverine - Teaser",
    duration: "0:53",
    views: "22M",
    image:
      "https://media.rawg.io/media/games/d8f/d8f3b28fc747ed6f929ecfd8ad3d0a23.jpg",
    desc: "A standalone game directed by Brian Horton and Cameron Christian.",
    category: "Teaser",
  },
  {
    id: 5,
    title: "Raising Kratos - The Making of God of War",
    duration: "1:54:45",
    views: "12M",
    image:
      "https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg",
    desc: "A feature-length documentary exploring the creation of God of War.",
    category: "Documentary",
  },
  {
    id: 6,
    title: "Grounded: The Making of The Last of Us",
    duration: "1:25:10",
    views: "5.5M",
    image:
      "https://media.rawg.io/media/games/713/713269608dc8f2f40f5a670a14b2de94.jpg",
    desc: "Behind the scenes look at Naughty Dog's masterpiece.",
    category: "Documentary",
  },
  {
    id: 7,
    title: "The Story of Red Dead Redemption 2",
    duration: "45:20",
    views: "8.9M",
    image:
      "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg",
    desc: "Discover the narrative depth of Arthur Morgan's journey.",
    category: "Documentary",
  },
  {
    id: 8,
    title: "DOOM - Behind the Music",
    duration: "24:15",
    views: "3.2M",
    image:
      "https://media.rawg.io/media/games/c4b/c4b0cab189e73432de3a250d8cf1c84e.jpg",
    desc: "Mick Gordon discusses the heavy metal soundtrack of DOOM.",
    category: "Behind the Scenes",
  },
];

export default async function WatchVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("mediaWatch");

  const video = ALL_VIDEOS.find((v) => v.id.toString() === id);
  if (!video) notFound();

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-8 max-w-[1600px] mx-auto overflow-hidden">
      <Link
        href="/media"
        className="inline-flex items-center gap-2 text-base-400 hover:text-white transition-colors text-sm w-fit mb-6 bg-base-950 px-4 py-2 rounded-xl border border-white/5"
      >
        <ArrowLeft size={16} className="rtl:rotate-180" />
      </Link>

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-center group">
          <div
            className="absolute inset-0 bg-base-950/80 bg-cover bg-center mix-blend-overlay opacity-60"
            style={{ backgroundImage: `url('${video.image}')` }}
          ></div>
          <div className="w-20 h-20 rounded-full bg-primary-600/90 text-white flex items-center justify-center backdrop-blur-md shadow-[0_0_40px_rgba(170,79,255,0.6)] cursor-pointer hover:scale-110 transition-transform z-10">
            <Play size={36} className="ms-2" fill="currentColor" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="px-3 py-1 rounded-md bg-primary-600/20 border border-primary-500/40 text-primary-400 text-[10px] font-black uppercase tracking-widest w-fit">
                {video.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                {video.title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-base-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-primary-500" />
                  {video.duration}
                </span>
                <span className="w-1 h-1 rounded-full bg-base-700"></span>
                <span>
                  {video.views} {t("views")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-base-900 border border-white/5 text-base-300 hover:text-rose-400 hover:border-rose-500/30 transition-colors text-xs font-bold">
                <Heart size={16} /> {t("like")}
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-base-900 border border-white/5 text-base-300 hover:text-white hover:border-white/20 transition-colors text-xs font-bold">
                <Share2 size={16} /> {t("share")}
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-base-950 border border-white/5 flex flex-col gap-3 mt-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Info size={16} className="text-primary-400" /> {t("descTitle")}
            </h3>
            <p className="text-sm text-base-300 leading-relaxed max-w-4xl">
              {video.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
